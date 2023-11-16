<script>
  import { torrentDetails, session } from '~helpers/stores';
  import { getSize } from '~helpers/sizeHelper';
  import { getAllFiles } from '~helpers/folderStructureHelper';
  import {
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SIZE,
    TRANSMISSION_COLUMN_FILE_STATS,
  } from '~helpers/constants/columns';
  import IconCheckbox from './IconCheckbox.svelte';
  import PriorityIndicator from '~components/PriorityIndicator';

  export let folderName;
  export let structure;
  export let selectedFiles;
  export let level = 0;
  export let iconName = null;
  export let collapsible = true;
  export let strong = false;
  export let onSingleFilePrioChange;

  let open = true;

  $: allChecked = getAllFiles(structure).every((file) =>
    selectedFiles.includes(file.name)
  );

  const getFileSize = (file) => {
    return getSize(file.length, {
      perSize: $session[SESSION_COLUMN_UNITS][SESSION_COLUMN_UNITS_SIZE],
    });
  };

  const getFilePriority = (fileStats) => {
    if (!fileStats.wanted) {
      return -2;
    }
    return fileStats.priority;
  };

  const selectFile = (fileName) =>
    (selectedFiles = [...selectedFiles, fileName]);
  const unselectFile = (fileName) =>
    (selectedFiles = selectedFiles.filter((file) => file !== fileName));

  const handleFileCheckbox = (event) => {
    if (event.target.checked) {
      selectFile(event.target.value);
      return;
    }

    unselectFile(event.target.value);
  };

  const selectFolder = (event) => {
    const folderFileNames = getAllFiles(structure).map((file) => file.name);

    if (event.target.checked) {
      selectedFiles = [...selectedFiles, ...folderFileNames];
      return;
    }

    selectedFiles = selectedFiles.filter(
      (file) => !folderFileNames.includes(file)
    );
  };
</script>

<div
  class="folder"
  style="{`margin-left: ${level * 8}px`}"
  class:strong="{strong}"
  title="{folderName}"
>
  <IconCheckbox
    checked="{allChecked}"
    on:change="{selectFolder}"
    iconName="{iconName ?? (open ? 'FolderOpen' : 'FolderClosed')}"
  />
  <div
    class="path"
    class:no-action="{!collapsible}"
    on:click="{() => collapsible && (open = !open)}"
  >
    {folderName}
  </div>
</div>
{#if open}
  {#each Object.keys(structure.folders) as nestedFolder}
    <svelte:self
      folderName="{nestedFolder}"
      structure="{structure.folders[nestedFolder]}"
      bind:selectedFiles="{selectedFiles}"
      level="{level + 1}"
      onSingleFilePrioChange="{onSingleFilePrioChange}"
    />
  {/each}
  {#each structure.files as file}
    <div
      class="file"
      style="{`margin-left: ${(level + 1) * 8}px`}"
      title="{file.fileName}"
    >
      <IconCheckbox
        on:change="{handleFileCheckbox}"
        group="{selectedFiles}"
        value="{file.name}"
        iconName="File"
      />
      <div
        class="path"
        on:click="{() =>
          selectedFiles.includes(file.name)
            ? unselectFile(file.name)
            : selectFile(file.name)}"
      >
        {file.fileName}
      </div>
      <div class="details">
        <span>{getFileSize(file).value}{getFileSize(file).size}</span>
        <span>{Math.round((file.bytesCompleted / file.length) * 100)}%</span>
        <PriorityIndicator
          value="{getFilePriority(
            $torrentDetails[TRANSMISSION_COLUMN_FILE_STATS][file.index]
          )}"
          allowDisabled="{true}"
          on:click="{onSingleFilePrioChange.bind(this, file.index)}"
        />
      </div>
    </div>
  {/each}
{/if}

<style>
  .folder,
  .file {
    fill: var(--color-modal-files-icon);
    color: var(--color-modal-text);
    font-size: 13px;
    margin-bottom: 3px;
    display: grid;
  }

  .folder {
    grid-template-columns: auto 1fr;
  }

  .file {
    grid-template-columns: auto 1fr auto;
  }

  .folder.strong {
    color: var(--color-modal-text-light);
    margin-bottom: 4px;
    line-height: 18px;
    font-size: 14px;
  }

  .details {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    font-size: 11px;
    gap: 6px;
    line-height: 19px;
  }

  .path {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .path.no-action {
    cursor: initial;
  }
</style>
