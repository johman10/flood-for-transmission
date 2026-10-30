<script context="module">
  let num = 0;
</script>

<script>
  import { torrents, alerts, session } from '~helpers/stores';
  import {
    SESSION_COLUMN_DOWNLOAD_DIR,
    SESSION_COLUMN_START_ADDED,
  } from '~helpers/constants/columns';
  import {
    handleTorrentAddResponses,
    getFileAddBody,
    areAllFilesValid,
  } from '~helpers/fileHelper';
  import FilesIcon from '@lucide/svelte/icons/files';

  let hovering = false;
  let counter = 0;
  let input;

  num += 1;
  const id = `torrent-dropzone-${num}`;
  const acceptList = ['.torrent', 'application/x-bittorrent'];

  const handleDragEnter = () => {
    counter += 1;
    hovering = true;
  };

  const handleDragLeave = () => {
    counter -= 1;
    if (counter !== 0) return;

    hovering = false;
  };

  const handleFiles = (files) => {
    const fileList = Array.from(files);
    const allFilesValid = areAllFilesValid(fileList, acceptList);

    if (!allFilesValid) {
      alerts.add(
        'Seems like some of the dropped files are invalid, try again with valid .torrent files',
        'negative'
      );
      return;
    }

    return fileList;
  };

  const handleFileSubmit = (files) => {
    let destination = null;
    let start = null;

    session
      .addColumns([SESSION_COLUMN_DOWNLOAD_DIR, SESSION_COLUMN_START_ADDED])
      .then(($session) => {
        destination = $session[SESSION_COLUMN_DOWNLOAD_DIR];
        start = $session[SESSION_COLUMN_START_ADDED];
      })
      .then(() => {
        return getFileAddBody(files, start, destination);
      })
      .then((dataItems) => {
        return Promise.all(dataItems.map((item) => torrents.add(item)));
      })
      .then(handleTorrentAddResponses)
      .catch((e) => {
        if (!e) return;

        console.error(e);
        alerts.add('Failed to add some torrent, please try again', 'negative');
      });
  };

  const handleDrop = (event) => {
    hovering = false;

    const { dataTransfer } = event;
    const files = handleFiles(dataTransfer.files);
    if (files) {
      handleFileSubmit(files);
    }
    event.target.value = '';
  };
</script>

<svelte:body
  on:dragenter|preventDefault={handleDragEnter}
  on:dragleave|preventDefault={handleDragLeave}
  on:dragover|preventDefault
/>

<label
  class="dropzone"
  class:hovering={hovering}
  for={id}
  on:drop|preventDefault={handleDrop}
>
  <div class="dropzone-content">
    <FilesIcon class="icon" />
    Drop here to add them to Transmission.
  </div>
  <input type="file" id={id} bind:this={input} multiple />
</label>

<style>
  .dropzone {
    z-index: 99;
    position: sticky;
    width: 100%;
    height: 100%;
    inset: 0;
    background-color: var(--color-dropzone-background);
    display: none;
    align-items: center;
    justify-content: center;
  }

  .dropzone.hovering {
    display: flex;
  }

  .dropzone:before {
    content: '';
    position: absolute;
    inset: 16px;
    border: 2px dashed var(--primary);
    border-radius: 16px;
    background: color-mix(in oklch, var(--primary) 6%, transparent);
  }

  .dropzone-content {
    color: var(--color-input-file-text);
    font-size: 14px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .dropzone-content > :global(.icon) {
    height: 56px;
    width: 56px;
    color: var(--primary);
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
