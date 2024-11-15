const getEmptyFolder = () => ({
  folders: {},
  files: [],
});

const getFile = (file, fileName) => ({
  ...file,
  fileName,
});

const addFolderToObject = (key, object) => {
  if (object[key]) return object[key];
  object[key] = getEmptyFolder();
  return object[key];
};

const hasWrappingFolder = (sampleFile) => sampleFile.name.split('/').length > 1;

export const getAllFiles = (structure) => {
  return [
    ...structure.files,
    ...Object.keys(structure.folders).flatMap((folderName) =>
      getAllFiles(structure.folders[folderName])
    ),
  ];
};

// Returns the absolute path folder that contains all the files
export const getMainFolder = (downloadDir, sampleFile) => {
  if (hasWrappingFolder(sampleFile)) {
    const filePathParts = sampleFile.name.split('/');
    return `${downloadDir}/${filePathParts[0]}`;
  }

  return downloadDir;
};

export const getFolderStructure = (files) => {
  const structure = getEmptyFolder();

  if (!files.length) return structure;

  if (!hasWrappingFolder(files[0])) {
    structure.files.push(getFile(files[0], files[0].name, 0));
    return structure;
  }

  files.forEach((file, index) => {
    const parts = file.name.split('/');

    // Remove the main folder
    parts.shift();

    const fileName = parts.pop();
    let prevFolder = structure;
    parts.forEach((folderName) => {
      prevFolder = addFolderToObject(folderName, prevFolder.folders);
    });
    prevFolder.files.push(getFile(file, fileName, index));
  });

  return structure;
};
