<script context="module">
  let num = 0;
</script>

<script>
  import Icon from '~components/Icon';

  export let files;
  export let label;
  export let accept = null;
  export let required = false;

  if (accept.indexOf('*') > -1) {
    console.warn(
      '<FileInput> received an non allowed wildcard in the accept value.'
    );
  }

  $: acceptList = accept
    ? accept
        .split(',')
        .filter(Boolean)
        .map((type) => type.trim())
    : null;
  $: actualRequired = required && (!files || !files.length);

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
    let file = fileList[0];
    if (acceptList) {
      file = fileList.find((file) => {
        const splitName = file.name.split('.');
        const extension = `.${splitName[splitName.length - 1]}`;
        return acceptList.some(
          (type) => type === file.type || type === extension
        );
      });
    }
    if (!file) {
      invalid = true;
      return;
    }
    invalid = false;
    files = [file];
    return file;
  };

  const handleDrop = (event) => {
    event.preventDefault();
    hovering = false;

    const { dataTransfer } = event;
    handleFiles(dataTransfer.files);
  };

  const handleChange = (event) => {
    event.preventDefault();

    const file = handleFiles(event.target.files);
    if (file) return;
    event.target.value = '';
  };
</script>

<label class="label-text" for="{id}">{label}</label>
{#if files}
  <ul class="file-list">
    {#each files as file}
      <li class="file-item">
        <Icon name="File" />
        {file.name}
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
    There seems to be no torrent there, please try again.
  {:else}Drop some files here, or click to browse.{/if}
  <input
    type="file"
    id="{id}"
    {...$$restProps}
    bind:files
    on:input="{handleChange}"
    bind:this="{input}"
    required="{actualRequired}"
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
  }

  .file-item > :global(.icon) {
    height: 14px;
    fill: currentColor;
    margin-right: 4px;
    opacity: 0.5;
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
