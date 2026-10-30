// Torrents can contain tens of thousands of files, so everything here works on
// flat arrays indexed by number instead of nested objects, and every function
// is a single linear pass.

export const PRIORITY_MIXED = null;

const PRIORITY_BITS = { [-1]: 1, 0: 2, 1: 4 };
const BIT_PRIORITIES = { 1: -1, 2: 0, 4: 1 };

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
});

const createFolder = (name, path, parent, depth) => ({
  name,
  path,
  parent,
  depth,
  folders: [],
  files: [],
  // Range into tree.order covering every file inside this folder
  start: 0,
  end: 0,
});

// Folder 0 is an unnamed root. `tree.root` points at the folder whose contents
// are shown, which skips the wrapping folder that multi-file torrents have.
export const buildFileTree = (files) => {
  const folders = [createFolder('', '', -1, -1)];
  const folderLookup = new Map();
  const fileNodes = new Array(files.length);

  files.forEach((file, index) => {
    const parts = file.name.split('/');
    const name = parts.pop();
    let parent = 0;
    let path = '';

    parts.forEach((part) => {
      path = path ? `${path}/${part}` : part;
      let folderIndex = folderLookup.get(path);
      if (folderIndex === undefined) {
        folderIndex = folders.length;
        folders.push(
          createFolder(part, path, parent, folders[parent].depth + 1)
        );
        folders[parent].folders.push(folderIndex);
        folderLookup.set(path, folderIndex);
      }
      parent = folderIndex;
    });

    fileNodes[index] = {
      index,
      name,
      path: file.name,
      length: file.length,
      parent,
      depth: folders[parent].depth + 1,
    };
    folders[parent].files.push(index);
  });

  folders.forEach((folder) => {
    folder.folders.sort((a, b) =>
      collator.compare(folders[a].name, folders[b].name)
    );
    folder.files.sort((a, b) =>
      collator.compare(fileNodes[a].name, fileNodes[b].name)
    );
  });

  // Depth-first file order, so each folder maps to one contiguous range
  const order = [];
  const visit = (folderIndex) => {
    const folder = folders[folderIndex];
    folder.start = order.length;
    folder.folders.forEach(visit);
    order.push(...folder.files);
    folder.end = order.length;
  };
  visit(0);

  let root = 0;
  if (!folders[0].files.length && folders[0].folders.length === 1) {
    root = folders[0].folders[0];
  }

  return { folders, files: fileNodes, order, root };
};

export const getFolderFiles = (tree, folderIndex, include = null) => {
  const { start, end } = tree.folders[folderIndex];
  const files = tree.order.slice(start, end);
  return include ? files.filter((fileIndex) => include[fileIndex]) : files;
};

const priorityFromBits = (bits) => BIT_PRIORITIES[bits] ?? PRIORITY_MIXED;

export const getFilePriority = (fileStat) => fileStat?.priority ?? 0;

// Aggregated size, progress, wanted state and priority for every folder.
// When `include` is given, only files flagged in it are counted.
export const getFolderStats = (tree, fileStats, include = null) => {
  const count = tree.folders.length;
  const length = new Float64Array(count);
  const completed = new Float64Array(count);
  const wantedLength = new Float64Array(count);
  const wantedCompleted = new Float64Array(count);
  const fileCount = new Uint32Array(count);
  const wantedCount = new Uint32Array(count);
  const wantedPriorities = new Uint8Array(count);
  const allPriorities = new Uint8Array(count);

  tree.files.forEach((file) => {
    if (include && !include[file.index]) return;
    const stat = fileStats[file.index] || {};
    const folder = file.parent;
    const bytesCompleted = stat.bytesCompleted || 0;
    const priorityBit = PRIORITY_BITS[getFilePriority(stat)] || 0;

    length[folder] += file.length;
    completed[folder] += bytesCompleted;
    fileCount[folder] += 1;
    allPriorities[folder] |= priorityBit;
    if (stat.wanted) {
      wantedLength[folder] += file.length;
      wantedCompleted[folder] += bytesCompleted;
      wantedCount[folder] += 1;
      wantedPriorities[folder] |= priorityBit;
    }
  });

  // Children are always created after their parent, so walking backwards
  // rolls every folder up before its parent is read.
  for (let index = count - 1; index > 0; index -= 1) {
    const parent = tree.folders[index].parent;
    length[parent] += length[index];
    completed[parent] += completed[index];
    wantedLength[parent] += wantedLength[index];
    wantedCompleted[parent] += wantedCompleted[index];
    fileCount[parent] += fileCount[index];
    wantedCount[parent] += wantedCount[index];
    wantedPriorities[parent] |= wantedPriorities[index];
    allPriorities[parent] |= allPriorities[index];
  }

  return {
    length,
    completed,
    wantedLength,
    wantedCompleted,
    fileCount,
    wantedCount,
    // Priority of the files that will be downloaded, or of all files if
    // nothing in the folder is wanted.
    priority: (folderIndex) =>
      priorityFromBits(
        wantedPriorities[folderIndex] || allPriorities[folderIndex]
      ),
  };
};

// Every whitespace separated term has to appear somewhere in the file path.
export const getFileMatches = (tree, query) => {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const files = new Uint8Array(tree.files.length);
  const folders = new Uint32Array(tree.folders.length);
  const indices = [];

  tree.order.forEach((fileIndex) => {
    const path = tree.files[fileIndex].path.toLowerCase();
    if (!terms.every((term) => path.includes(term))) return;

    files[fileIndex] = 1;
    indices.push(fileIndex);
    let folder = tree.files[fileIndex].parent;
    while (folder !== -1) {
      folders[folder] += 1;
      folder = tree.folders[folder].parent;
    }
  });

  return { files, folders, indices };
};

// Flattens the part of the tree that is currently on screen into rows. While
// filtering, every folder with a match is shown expanded.
export const getVisibleRows = (tree, expanded, matches) => {
  const rows = [];
  const rootDepth = tree.folders[tree.root].depth + 1;

  const visit = (folderIndex) => {
    const folder = tree.folders[folderIndex];

    folder.folders.forEach((childIndex) => {
      if (matches && !matches.folders[childIndex]) return;
      const isExpanded = !!matches || !!expanded[childIndex];
      rows.push({
        folder: childIndex,
        depth: tree.folders[childIndex].depth - rootDepth,
        expanded: isExpanded,
      });
      if (isExpanded) visit(childIndex);
    });

    folder.files.forEach((fileIndex) => {
      if (matches && !matches.files[fileIndex]) return;
      rows.push({
        file: fileIndex,
        depth: tree.files[fileIndex].depth - rootDepth,
      });
    });
  };
  visit(tree.root);

  return rows;
};

export const getAllFolders = (tree) =>
  tree.folders.map((_, index) => index).filter((index) => index !== 0);

// Returns the absolute path folder that contains all the files
export const getMainFolder = (downloadDir, tree) => {
  if (tree.root === 0) return downloadDir;
  return `${downloadDir}/${tree.folders[tree.root].path}`;
};
