<script>
  import { torrentDetails, session } from '~helpers/stores';
  import { getSize } from '~helpers/sizeHelper';
  import {
    TRANSMISSION_COLUMN_DOWNLOAD_DIR,
    TRANSMISSION_COLUMN_FILES,
    TRANSMISSION_COLUMN_FILE_STATS,
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SIZE,
  } from '~helpers/constants/columns';
  import Icon from '~components/Icon';
  import Checkbox from '~components/Checkbox';
  import PriorityIndicator from '~components/PriorityIndicator';
  import Select from '~components/Select';
  import { slide } from 'svelte/transition';

  let selectedFiles = [];
  const prioOptions = [
    { label: "Don't download", value: -2 },
    { label: 'Low', value: -1 },
    { label: 'Normal', value: 0 },
    { label: 'High', value: 1 },
  ];

  $: files = $torrentDetails[TRANSMISSION_COLUMN_FILES];
  $: allSelected = files.length === selectedFiles.length;

  const selectAll = () => {
    if (allSelected) {
      selectedFiles = [];
      return;
    }
    selectedFiles = files.map((file) => file.name);
  };

  const selectFile = (event) => {
    if (event.target.checked) {
      selectedFiles = [...selectedFiles, event.target.value];
      return;
    }

    selectedFiles = selectedFiles.filter((file) => file !== event.target.value);
  };

  const getFolderName = (file) => {
    const filePathParts = file.name.split('/');
    if (filePathParts.length > 1) {
      return `/${filePathParts[0]}`;
    }

    return '';
  };

  const getRelativePath = (file) => {
    const filePathParts = file.name.split('/');
    if (filePathParts.length > 1) {
      filePathParts.shift();
      return filePathParts.join('/');
    }

    return file.name;
  };

  const getFileSize = (file) => {
    return getSize(file.length, {
      perSize: $session[SESSION_COLUMN_UNITS][SESSION_COLUMN_UNITS_SIZE],
    });
  };

  const handleSelectedFilePrioChange = (event) => {
    torrentDetails.setPriority($torrentDetails, selectedFiles, event.detail);
  };

  const handleSingleFilePrioChange = (fileIndex, event) => {
    const fileName = files[fileIndex].name;
    torrentDetails.setPriority($torrentDetails, [fileName], event.detail);
  };

  const getFilePriority = (fileStats) => {
    if (!fileStats.wanted) {
      return -2;
    }
    return fileStats.priority;
  };
</script>

<div class="container">
  <div class="locations" class:selected="{!!selectedFiles.length}">
    {#if files.length}
      <div class="location item">
        <div class="icon-or-checkbox" class:selected="{allSelected}">
          <Checkbox bind:checked="{allSelected}" on:change="{selectAll}" />
          <Icon name="Disk" />
        </div>
        <div class="path">
          {$torrentDetails[TRANSMISSION_COLUMN_DOWNLOAD_DIR]}{getFolderName(
            files[0]
          )}
        </div>
      </div>
      {#each files as file, index}
        <div class="file item">
          <div
            class="icon-or-checkbox"
            class:selected="{selectedFiles.includes(file.name)}"
          >
            <Checkbox
              group="{selectedFiles}"
              value="{file.name}"
              on:change="{selectFile}"
            />
            <Icon name="File" />
          </div>
          <div class="path">{getRelativePath(file)}</div>
          <div class="details">
            <span>{getFileSize(file).value}{getFileSize(file).size}</span>
            <span>{Math.round((file.bytesCompleted / file.length) * 100)}%</span
            >
            <PriorityIndicator
              value="{getFilePriority(
                $torrentDetails[TRANSMISSION_COLUMN_FILE_STATS][index]
              )}"
              allowDisabled="{true}"
              on:click="{handleSingleFilePrioChange.bind(this, index)}"
            />
          </div>
        </div>
      {/each}
    {:else}
      <div class="empty">
        No files to show right now. Metadata is probably missing.
      </div>
    {/if}
  </div>
  {#if selectedFiles.length}
    <div class="action-bar" transition:slide="{{ duration: 250 }}">
      <div class="text">
        <span class="focus">{selectedFiles.length}</span>
        selected
        {selectedFiles.length > 1 ? 'files' : 'file'}
      </div>

      <div class="select-container">
        <Select
          options="{prioOptions}"
          placeholder="Set priority"
          on:change="{handleSelectedFilePrioChange}"
        />
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .empty {
    color: var(--color-modal-text);
    font-size: 14px;
  }

  .locations {
    flex-grow: 1;
    padding: 20px 25px;
    overflow-y: auto;
    transition: padding 0.25s;
  }

  .locations.selected {
    padding: 20px 25px 5px;
  }

  .location {
    display: flex;
    fill: var(--color-modal-files-icon);
    color: var(--color-modal-text-light);
    align-items: center;
    margin-bottom: 4px;
    line-height: 18px;
    font-size: 14px;
  }

  .file {
    display: grid;
    fill: var(--color-modal-files-icon);
    color: var(--color-modal-text);
    font-size: 13px;
    margin-bottom: 3px;
    grid-template-columns: auto 1fr auto;
  }

  .details {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    font-size: 11px;
    gap: 6px;
    line-height: 19px;
  }

  .item:hover :global(.icon),
  .icon-or-checkbox.selected :global(.icon) {
    opacity: 0;
  }

  .item:hover :global(.checkbox),
  .icon-or-checkbox.selected :global(.checkbox) {
    opacity: 1;
  }

  .icon-or-checkbox {
    position: relative;
    width: 18px;
    height: 18px;
    margin-right: 5px;
    flex-shrink: 0;
  }

  .icon-or-checkbox > :global(.icon) {
    position: absolute;
    height: 14px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    transition: opacity 0.2s ease-in-out;
  }

  .icon-or-checkbox > :global(.checkbox) {
    position: absolute;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .path {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px 25px;
  }

  .text {
    color: var(--color-modal-text);
    font-size: 14px;
    flex-grow: 1;
  }

  .focus {
    color: var(--color-active);
    font-weight: 700;
  }

  .select-container {
    flex-grow: 1;
  }
</style>
