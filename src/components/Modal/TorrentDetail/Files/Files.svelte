<script>
  import { torrentDetails } from '~helpers/stores';
  import {
    TRANSMISSION_COLUMN_DOWNLOAD_DIR,
    TRANSMISSION_COLUMN_FILES,
  } from '~helpers/constants/columns';

  import Select from '~components/Select';
  import Folder from './Folder';
  import { slide } from 'svelte/transition';
  import {
    getFolderStructure,
    getMainFolder,
  } from '~helpers/folderStructureHelper';

  let selectedFiles = [];
  const prioOptions = [
    { label: "Don't download", value: -2 },
    { label: 'Low', value: -1 },
    { label: 'Normal', value: 0 },
    { label: 'High', value: 1 },
  ];

  $: files = $torrentDetails[TRANSMISSION_COLUMN_FILES];
  $: structure = getFolderStructure(files);

  const handleSelectedFilePrioChange = (event) => {
    torrentDetails.setPriority($torrentDetails, selectedFiles, event.detail);
  };
</script>

<div class="container">
  <div class="locations" class:selected="{!!selectedFiles.length}">
    {#if files.length}
      <Folder
        structure="{structure}"
        bind:selectedFiles
        iconName="Disk"
        folderName="{getMainFolder(
          $torrentDetails[TRANSMISSION_COLUMN_DOWNLOAD_DIR],
          files[0]
        )}"
        collapsible="{false}"
        strong="{true}"
      />
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
