<script>
  import { torrentDetails } from '~helpers/stores';
  import {
    TRANSMISSION_COLUMN_DOWNLOAD_DIR,
    TRANSMISSION_COLUMN_FILES,
  } from '~helpers/constants/columns';

  import Select from '~components/Select';
  import ActionBarView from '~components/Modal/TorrentDetail/ActionBarView';
  import Folder from './Folder';
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

  const handleSingleFilePrioChange = (fileIndex, event) => {
    const fileName = files[fileIndex].name;
    torrentDetails.setPriority($torrentDetails, [fileName], event.detail);
  };
</script>

<div class="container">
  <ActionBarView items="{selectedFiles}" itemName="file" itemNamePlural="files">
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
        onSingleFilePrioChange="{handleSingleFilePrioChange}"
      />
    {:else}
      <div class="empty">
        No files to show right now. Metadata is probably missing.
      </div>
    {/if}

    <div slot="actions" class="select-container">
      <Select
        options="{prioOptions}"
        placeholder="Set priority"
        on:change="{handleSelectedFilePrioChange}"
      />
    </div>
  </ActionBarView>
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
