<script context="module">
  let num = 0;
</script>

<script>
  import Icon from '~components/Icon';

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

  const handleDragOver = (event) => {
    event.preventDefault();
    hovering = true;
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    hovering = false;
  };

  const handleFiles = (newFiles) => {
    const fileList = Array.from(newFiles);
    if (acceptList) {
      const allFilesValid = fileList.every((file) => {
        const splitName = file.name.split('.');
        const extension = `.${splitName[splitName.length - 1]}`;
        return acceptList.some(
          (type) => type === file.type || type === extension
        );
      });

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
    event.preventDefault();
    hovering = false;

    const { dataTransfer } = event;
    handleFiles(dataTransfer.files);
    event.target.value = '';
  };

  const handleChange = (event) => {
    event.preventDefault();
    handleFiles(event.target.files);
    event.target.value = '';
  };

  const removeFile = (removeFile) => {
    files = files.filter((file) => removeFile !== file);
  };
</script>

<label class="label-text" for="{id}">{label}</label>
{#if files && files.length}
  <ul class="file-list">
    {#each files as file}
      <li class="file-item">
        <span class="file-label">
          <Icon name="File" />
          {file.name}
        </span>
        <button class="remove-file-button" on:click="{() => removeFile(file)}">
          <Icon name="Close" />
        </button>
      </li>
    {/each}
  </ul>
{/if}
<label
  for="{id}"
  class="zone"
  class:invalid
  class:file="{files}"
  class:hovering
  on:dragenter="{handleDragOver}"
  on:dragover="{handleDragOver}"
  on:dragleave="{handleDragLeave}"
  on:drop="{handleDrop}"
>
  <Icon name="Files" />
  {#if invalid}
    You're trying to upload a file that's not a torrent, please try again.
  {:else}
    Drop some files here, or click to browse.
  {/if}
  <input
    type="file"
    id="{id}"
    on:input="{handleChange}"
    bind:this="{input}"
    required="{required && (!files || !files.length)}"
    multiple="{multiple}"
    {...$$restProps}
  />
</label>

<style>
  .label-text {
    display: block;
    font-size: 13px;
    margin-bottom: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-list {
    list-style: none;
    outline: none;
    background-color: #293341;
    border: 1px solid #202d3c;
    border-bottom: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    color: #8899a8;
    font-size: 14px;
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
    border-bottom: solid 1px #202d3c;
  }

  .file-label > :global(.icon) {
    height: 14px;
    fill: currentColor;
    margin-right: 4px;
    opacity: 0.5;
  }

  .file-item:hover .remove-file-button {
    background-color: #e95779;
    transition: background-color 125ms;
    fill: white;
  }

  .remove-file-button {
    border: 0;
    border-radius: 3px;
    padding: 3px;
    display: flex;
    fill: rgba(94, 114, 140, 0.5);
    background-color: transparent;
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
    color: #8899a8;
    outline: none;
    background-color: #293341;
    border: 1px solid #202d3c;
    border-radius: 4px;
    fill: rgba(94, 114, 140, 0.5);
    position: relative;
  }

  .zone.hovering,
  .zone:hover {
    border-color: #17212b;
    fill: #258de5;
  }

  .zone.invalid {
    fill: #e95779;
  }

  .zone > :global(.icon) {
    height: 64px;
    transition: fill 0.25s;
    width: 64px;
  }

  input {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    pointer-events: none;
  }
</style>
