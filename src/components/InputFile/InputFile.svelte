<script context="module">
  let num = 0;
</script>

<script>
  import FileIcon from '@lucide/svelte/icons/file';
  import FilesIcon from '@lucide/svelte/icons/files';
  import XIcon from '@lucide/svelte/icons/x';
  import { areAllFilesValid } from '~helpers/fileHelper';

  export let files;
  export let label;
  export let accept = null;
  export let required = false;
  export let multiple = false;

  if (accept.indexOf('*') > -1) {
    console.warn(
      '<InputFile> received an non allowed wildcard in the accept value.'
    );
  }

  $: acceptList = accept
    ? accept
        .split(',')
        .filter(Boolean)
        .map((type) => type.trim())
    : null;

  let hovering = false;
  let invalid = false;
  let input;

  num += 1;
  const id = `file-input-${num}`;

  const handleDragOver = () => {
    hovering = true;
  };

  const handleDragLeave = () => {
    hovering = false;
  };

  const handleFiles = (newFiles) => {
    const fileList = Array.from(newFiles);
    if (acceptList) {
      const allFilesValid = areAllFilesValid(fileList, acceptList);

      if (!allFilesValid) {
        invalid = true;
        return;
      }
    }

    invalid = false;
    if (multiple) {
      files = files ? [...files, ...fileList] : fileList;
    } else {
      files = [fileList[0]];
    }
    return files;
  };

  const handleDrop = (event) => {
    hovering = false;

    const { dataTransfer } = event;
    handleFiles(dataTransfer.files);
    event.target.value = '';
  };

  const handleChange = (event) => {
    handleFiles(event.target.files);
    event.target.value = '';
  };

  const removeFile = (removeFile) => {
    files = files.filter((file) => removeFile !== file);
  };
</script>

<label class="label-text" for={id}>{label}</label>
{#if files && files.length}
  <ul class="file-list">
    {#each files as file (file.name)}
      <li class="file-item">
        <span class="file-label">
          <FileIcon class="icon" />
          {file.name}
        </span>
        <button
          class="remove-file-button"
          type="button"
          on:click={() => removeFile(file)}
        >
          <XIcon class="icon" />
        </button>
      </li>
    {/each}
  </ul>
{/if}
<label
  for={id}
  class="zone"
  class:invalid={invalid}
  class:file={files}
  class:hovering={hovering}
  on:dragenter|preventDefault={handleDragOver}
  on:dragover|preventDefault={handleDragOver}
  on:dragleave|preventDefault={handleDragLeave}
  on:drop|preventDefault={handleDrop}
>
  <FilesIcon class="icon" />
  {#if invalid}
    You're trying to upload a file that's not a torrent, please try again.
  {:else}
    Drop some files here, or click to browse.
  {/if}
  <input
    type="file"
    id={id}
    on:input|preventDefault={handleChange}
    bind:this={input}
    required={required && (!files || !files.length)}
    multiple={multiple}
    {...$$restProps}
  />
</label>

<style>
  .label-text {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: var(--muted-foreground);
    margin-bottom: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-list {
    list-style: none;
    outline: none;
    background-color: var(--color-input-file-background);
    border: 1px solid var(--color-input-file-border);
    border-bottom: 0;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    color: var(--color-input-file-text);
    font-size: 13px;
  }

  .file-item {
    display: flex;
    overflow: hidden;
    padding: 7.5px 12px;
    text-overflow: ellipsis;
    transition: background-color 0.25s;
    white-space: nowrap;
    line-height: 1.25;
    align-items: center;
    justify-content: space-between;
  }

  .file-item:not(:last-child) {
    border-bottom: solid 1px var(--color-input-file-border);
  }

  .file-label {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-label > :global(.icon) {
    height: 14px;
    color: currentColor;
    margin-right: 4px;
    opacity: 0.5;
  }

  .file-item:hover .remove-file-button {
    background-color: var(--color-input-file-remove-background-active);
    transition: background-color 125ms;
    color: var(--color-input-file-remove-icon-active);
  }

  .remove-file-button {
    border: 0;
    border-radius: 3px;
    padding: 3px;
    display: flex;
    color: var(--color-input-file-remove-icon);
    background-color: var(--color-input-file-remove-background);
    cursor: pointer;
  }

  .remove-file-button > :global(.icon) {
    height: 12px;
  }

  .zone.file {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .zone {
    cursor: pointer;
    font-size: 12px;
    padding: 25px;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--color-input-file-text);
    outline: none;
    background-color: var(--color-input-file-background);
    border: 1px solid var(--color-input-file-border);
    border-radius: 4px;
    position: relative;
  }

  .zone.hovering,
  .zone:hover {
    border-color: var(--color-input-file-border-active);
    color: var(--color-input-file-icon-active);
  }

  .zone.invalid {
    color: var(--color-input-file-icon-invalid);
  }

  .zone > :global(.icon) {
    height: 32px;
    width: 32px;
    margin-bottom: 8px;
    stroke-width: 1.5;
    transition: color 0.25s;
  }

  input {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    pointer-events: none;
  }

  .zone > :global(.icon) {
    color: var(--muted-foreground);
  }

  .zone:hover > :global(.icon),
  .zone.hovering > :global(.icon) {
    color: var(--primary);
  }
</style>
