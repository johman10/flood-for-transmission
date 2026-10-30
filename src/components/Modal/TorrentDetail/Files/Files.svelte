<script>
  import { torrentDetails, session } from '~helpers/stores';
  import {
    TRANSMISSION_COLUMN,
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SIZE,
  } from '~helpers/constants/columns';
  import { getSize } from '~helpers/sizeHelper';
  import {
    buildFileTree,
    getAllFolders,
    getFileMatches,
    getFilePriority,
    getFolderFiles,
    getFolderStats,
    getMainFolder,
    getVisibleRows,
  } from '~helpers/folderStructureHelper';
  import FolderIcon from '@lucide/svelte/icons/folder';
  import FolderOpenIcon from '@lucide/svelte/icons/folder-open';
  import CheckIcon from '@lucide/svelte/icons/check';
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import FileIcon from '@lucide/svelte/icons/file';
  import HardDriveIcon from '@lucide/svelte/icons/hard-drive';
  import SearchIcon from '@lucide/svelte/icons/search';
  import PriorityIndicator from '~components/PriorityIndicator';

  const ROW_HEIGHT = 30;
  const OVERSCAN = 10;
  // Smaller torrents open fully expanded, bigger ones start collapsed
  const AUTO_EXPAND_FILE_LIMIT = 250;

  const prioOptions = [
    { label: 'High', value: 1 },
    { label: 'Normal', value: 0 },
    { label: 'Low', value: -1 },
  ];

  let query = '';
  // Folder index -> true for every expanded folder
  let expanded = {};
  let listElement;
  let scrollTop = 0;
  let viewportHeight = 0;

  $: files = $torrentDetails[TRANSMISSION_COLUMN.FILES];
  $: fileStats = $torrentDetails[TRANSMISSION_COLUMN.FILE_STATS];
  $: perSize = $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE];

  // Only rebuilt when the file list itself changes (first load, rename),
  // not on every poll.
  $: tree = files?.length ? buildFileTree(files) : null;
  $: resetExpanded(tree);
  $: stats = tree && fileStats ? getFolderStats(tree, fileStats) : null;
  $: matches = tree && query.trim() ? getFileMatches(tree, query) : null;
  // While filtering, folders only count (and toggle) the matching files
  $: rowStats =
    matches && stats ? getFolderStats(tree, fileStats, matches.files) : stats;
  $: rows = tree ? getVisibleRows(tree, expanded, matches) : [];
  $: targetFiles = matches ? matches.indices : tree?.order || [];

  $: start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  $: end = Math.min(
    rows.length,
    Math.ceil((scrollTop + viewportHeight) / ROW_HEIGHT) + OVERSCAN
  );
  $: visibleRows = rows.slice(start, end);

  const expandFolders = (folders) =>
    Object.fromEntries(folders.map((folderIndex) => [folderIndex, true]));

  function resetExpanded(tree) {
    if (!tree) return;
    expanded = expandFolders(
      tree.files.length <= AUTO_EXPAND_FILE_LIMIT ? getAllFolders(tree) : []
    );
  }

  const formatSize = (bytes) => {
    const { value, size } = getSize(bytes, { perSize });
    return `${value} ${size}`;
  };

  const formatPercent = (completed, length) => {
    if (!length) return 100;
    return Math.floor((completed / length) * 100);
  };

  const getRowInfo = (row, stats, fileStats) => {
    if (row.folder !== undefined) {
      const folder = tree.folders[row.folder];
      const fileCount = stats?.fileCount[row.folder] || 0;
      const wantedCount = stats?.wantedCount[row.folder] || 0;
      return {
        name: folder.name,
        title: folder.path,
        length: stats?.length[row.folder] || 0,
        percent: formatPercent(
          stats?.completed[row.folder],
          stats?.length[row.folder]
        ),
        wanted:
          wantedCount === fileCount ? 'all' : wantedCount ? 'some' : 'none',
        priority: stats ? stats.priority(row.folder) : 0,
        detail: `${wantedCount}/${fileCount}`,
      };
    }

    const file = tree.files[row.file];
    const stat = fileStats?.[row.file] || {};
    return {
      name: file.name,
      title: file.path,
      length: file.length,
      percent: formatPercent(stat.bytesCompleted, file.length),
      wanted: stat.wanted ? 'all' : 'none',
      priority: getFilePriority(stat),
    };
  };

  const getRowFiles = (row) =>
    row.folder !== undefined
      ? getFolderFiles(tree, row.folder, matches?.files)
      : [row.file];

  const toggleWanted = (row, wanted) => {
    torrentDetails.setFilesWanted(
      $torrentDetails,
      getRowFiles(row),
      wanted !== 'all'
    );
  };

  const setRowPriority = (row, event) => {
    torrentDetails.setFilesPriority(
      $torrentDetails,
      getRowFiles(row),
      event.detail
    );
  };

  const toggleExpanded = (folderIndex) => {
    if (matches) return;
    expanded = { ...expanded, [folderIndex]: !expanded[folderIndex] };
  };

  const expandAll = () => {
    expanded = expandFolders(getAllFolders(tree));
  };

  const collapseAll = () => {
    expanded = {};
    listElement.scrollTop = 0;
  };

  const setTargetsWanted = (wanted) => {
    torrentDetails.setFilesWanted($torrentDetails, targetFiles, wanted);
  };

  const setTargetsPriority = (priority) => {
    torrentDetails.setFilesPriority($torrentDetails, targetFiles, priority);
  };

  const handleSearchKeydown = (event) => {
    if (event.key === 'Escape' && query) {
      event.stopPropagation();
      query = '';
    }
  };
</script>

<div class="container">
  {#if !tree}
    <div class="empty">
      {#if files}
        No files to show right now. Metadata is probably missing.
      {:else}
        Loading files…
      {/if}
    </div>
  {:else}
    <div class="toolbar">
      <label class="search">
        <SearchIcon class="icon" />
        <input
          type="search"
          placeholder="Filter {tree.files.length} {tree.files.length === 1
            ? 'file'
            : 'files'}…"
          bind:value={query}
          on:keydown={handleSearchKeydown}
        />
      </label>
      {#if tree.folders.length > 2}
        <button
          class="link"
          on:click={expandAll}
          disabled={!!matches}
          title="Expand all folders"
        >
          Expand all
        </button>
        <button
          class="link"
          on:click={collapseAll}
          disabled={!!matches}
          title="Collapse all folders"
        >
          Collapse all
        </button>
      {/if}
    </div>

    <div class="summary">
      <div class="totals">
        {#if stats}
          <strong>{stats.wantedCount[0]}</strong>
          of {stats.fileCount[0]}
          {stats.fileCount[0] === 1 ? 'file' : 'files'} wanted ·
          <strong>{formatSize(stats.wantedLength[0])}</strong>
          of {formatSize(stats.length[0])}
          {#if stats.wantedLength[0]}
            · {formatPercent(stats.wantedCompleted[0], stats.wantedLength[0])}%
            done
          {/if}
        {/if}
      </div>
      <div class="bulk">
        <span class="bulk-label">
          {#if matches}
            {matches.indices.length} matching:
          {:else}
            All files:
          {/if}
        </span>
        <button
          class="link"
          disabled={!targetFiles.length}
          on:click={() => setTargetsWanted(true)}
        >
          Download
        </button>
        <button
          class="link"
          disabled={!targetFiles.length}
          on:click={() => setTargetsWanted(false)}
        >
          Skip
        </button>
        <span class="divider"></span>
        {#each prioOptions as { label, value } (value)}
          <button
            class="link"
            disabled={!targetFiles.length}
            title="Set priority to {label.toLowerCase()}"
            on:click={() => setTargetsPriority(value)}
          >
            {label}
          </button>
        {/each}
      </div>
    </div>

    <div class="header-row">
      <div
        class="main-folder"
        title={getMainFolder(
          $torrentDetails[TRANSMISSION_COLUMN.DOWNLOAD_DIR],
          tree
        )}
      >
        <HardDriveIcon class="icon" />
        <span>
          {getMainFolder(
            $torrentDetails[TRANSMISSION_COLUMN.DOWNLOAD_DIR],
            tree
          )}
        </span>
      </div>
      <div class="column size">Size</div>
      <div class="column progress">Done</div>
      <div class="column priority">Priority</div>
    </div>

    <div
      class="list"
      bind:this={listElement}
      bind:clientHeight={viewportHeight}
      on:scroll={() => (scrollTop = listElement.scrollTop)}
    >
      {#if !rows.length}
        <div class="empty">No files match “{query}”.</div>
      {/if}
      <div class="spacer" style="height: {rows.length * ROW_HEIGHT}px">
        <div class="rows" style="transform: translateY({start * ROW_HEIGHT}px)">
          {#each visibleRows as row (row.folder !== undefined ? `d${row.folder}` : row.file)}
            {@const info = getRowInfo(row, rowStats, fileStats)}
            <div
              class="row"
              class:folder={row.folder !== undefined}
              class:unwanted={info.wanted === 'none'}
              style="--depth: {row.depth}"
            >
              <div class="name" title={info.title}>
                {#if row.folder !== undefined}
                  <button
                    class="toggle"
                    class:open={row.expanded}
                    on:click={() => toggleExpanded(row.folder)}
                    aria-label={row.expanded ? 'Collapse' : 'Expand'}
                  >
                    <ChevronDownIcon class="icon" />
                  </button>
                {:else}
                  <span class="toggle-spacer"></span>
                {/if}
                <button
                  class="check"
                  class:checked={info.wanted === 'all'}
                  class:mixed={info.wanted === 'some'}
                  role="checkbox"
                  aria-checked={info.wanted === 'some'
                    ? 'mixed'
                    : info.wanted === 'all'}
                  title={info.wanted === 'all' ? "Don't download" : 'Download'}
                  on:click={() => toggleWanted(row, info.wanted)}
                >
                  {#if info.wanted === 'all'}
                    <CheckIcon class="icon" />
                  {/if}
                </button>
                {#if row.folder !== undefined}
                  <button
                    class="label"
                    on:click={() => toggleExpanded(row.folder)}
                  >
                    <svelte:component
                      this={row.expanded ? FolderOpenIcon : FolderIcon}
                      class="icon"
                    />
                    <span class="text">{info.name}</span>
                    <span class="count">{info.detail}</span>
                  </button>
                {:else}
                  <button
                    class="label"
                    on:click={() => toggleWanted(row, info.wanted)}
                  >
                    <FileIcon class="icon" />
                    <span class="text">{info.name}</span>
                  </button>
                {/if}
              </div>
              <div class="column size">{formatSize(info.length)}</div>
              <div class="column progress">
                <div class="bar">
                  <div class="fill" style="width: {info.percent}%"></div>
                </div>
                <span>{info.percent}%</span>
              </div>
              <div class="column priority">
                <PriorityIndicator
                  value={info.priority}
                  on:click={(event) => setRowPriority(row, event)}
                />
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px 25px 0;
    color: var(--color-modal-text);
    font-size: 13px;
  }

  .empty {
    font-size: 14px;
    padding: 4px 0;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }

  .search {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-grow: 1;
    padding: 0 10px;
    height: 32px;
    border-radius: 4px;
    background: var(--color-input-background);
    border: 1px solid var(--color-input-border);
    color: var(--color-input-addon-icon);
    transition: border-color 0.2s;
  }

  .search:focus-within {
    border-color: var(--color-input-border-active);
    color: var(--color-input-addon-icon-active);
  }

  .search > :global(.icon) {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  .search input {
    flex-grow: 1;
    min-width: 0;
    background: none;
    border: none;
    outline: none;
    color: var(--color-input-text-active);
    font: inherit;
  }

  .search input::placeholder {
    color: var(--color-input-placeholder);
  }

  button {
    background: none;
    border: none;
    padding: 0;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  button:disabled {
    cursor: default;
    opacity: 0.4;
  }

  .link {
    color: var(--color-modal-link);
    white-space: nowrap;
    font-size: 12px;
    font-weight: 500;
  }

  .link:not(:disabled):hover {
    text-decoration: underline;
  }

  .summary {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 6px 16px;
    margin-bottom: 10px;
    font-size: 12px;
  }

  .summary strong {
    color: var(--color-modal-header);
    font-weight: 500;
  }

  .bulk {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .divider {
    width: 1px;
    height: 12px;
    background: var(--color-modal-torrent-details-shadow);
  }

  .header-row,
  .row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 72px 92px 48px;
    align-items: center;
    column-gap: 12px;
  }

  .header-row {
    padding: 6px 0;
    border-bottom: 1px solid var(--color-modal-torrent-details-shadow);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .main-folder {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    text-transform: none;
    letter-spacing: 0;
    font-size: 13px;
    color: var(--color-modal-text-light);
  }

  .main-folder span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .main-folder > :global(.icon) {
    width: 14px;
    flex-shrink: 0;
  }

  .list {
    flex-grow: 1;
    min-height: 0;
    overflow-y: auto;
    margin: 0 -25px;
    padding: 0 25px;
  }

  .spacer {
    position: relative;
  }

  .row {
    height: 30px;
    border-radius: 3px;
  }

  .row:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  .row.unwanted .label,
  .row.unwanted .size,
  .row.unwanted .progress,
  .row.unwanted .priority {
    opacity: 0.45;
  }

  .name {
    display: flex;
    align-items: center;
    min-width: 0;
    padding-left: calc(var(--depth) * 18px);
  }

  .toggle,
  .toggle-spacer {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-modal-text);
  }

  .toggle > :global(.icon) {
    width: 14px;
    height: 14px;
    transform: rotate(-90deg);
    transition: transform 0.15s;
  }

  .toggle.open > :global(.icon) {
    transform: none;
  }

  .check {
    position: relative;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin: 0 8px 0 2px;
    border-radius: 3px;
    border: 1px solid var(--color-checkbox-border-dark);
    background: var(--color-checkbox-background-dark);
    color: var(--color-active);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .check:hover,
  .check:focus-visible {
    border-color: var(--color-active);
  }

  .check.checked,
  .check.mixed {
    border-color: var(--color-active);
    background: rgba(var(--rgb-active), 0.15);
  }

  .check > :global(.icon) {
    width: 16px;
    height: 16px;
  }

  .check.mixed::after {
    content: '';
    width: 8px;
    height: 2px;
    border-radius: 1px;
    background: var(--color-active);
  }

  .label {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    flex-grow: 1;
    height: 30px;
    text-align: left;
    color: var(--color-modal-files-icon);
  }

  .folder .label {
    color: var(--color-modal-tab-label);
  }

  .label > :global(.icon) {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  .text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .count {
    flex-shrink: 0;
    font-size: 11px;
    color: var(--color-modal-text);
  }

  .column {
    white-space: nowrap;
    font-size: 12px;
  }

  .size {
    text-align: right;
  }

  .progress {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .progress span {
    width: 34px;
    text-align: right;
  }

  .bar {
    flex-grow: 1;
    height: 3px;
    border-radius: 2px;
    background: var(--color-progress-bar-download-background);
    overflow: hidden;
  }

  .fill {
    height: 100%;
    background: var(--color-progress-bar-download);
  }

  .header-row .progress,
  .header-row .priority {
    display: block;
  }

  .header-row .size {
    text-align: right;
  }

  .priority {
    display: flex;
    justify-content: flex-end;
    cursor: pointer;
  }

  @media (max-width: 700px) {
    .container {
      padding: 12px 16px 0;
    }

    .list {
      margin: 0 -16px;
      padding: 0 16px;
    }

    .header-row,
    .row {
      grid-template-columns: minmax(0, 1fr) 60px 36px 40px;
      column-gap: 8px;
    }

    .bar {
      display: none;
    }

    .toolbar .link {
      display: none;
    }
  }

  .main-folder > :global(.icon) {
    color: var(--color-modal-files-icon);
  }

  .folder .label > :global(.icon) {
    color: var(--color-modal-files-folder);
  }
</style>
