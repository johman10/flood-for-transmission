<script>
  import InputMultiple from '~components/InputMultiple';
  import InputPath from '~components/InputPath';
  import InputFile from '~components/InputFile';
  import Icon from '~components/Icon';
  import Checkbox from '~components/Checkbox';
  import Button from '~components/Button';
  import { modals, torrents, alerts, session } from '~helpers/stores';
  import {
    SESSION_COLUMN_DOWNLOAD_DIR,
    SESSION_COLUMN_START_ADDED,
  } from '~helpers/constants/columns';

  let loadingInitial = true;
  let loadingSubmit = false;
  let tab = 'url';
  let fileNames = [];
  let files = null;
  let destination = null;
  let start = null;

  $: cleanFileNames = fileNames
    .map((fileName) => fileName.trim())
    .filter(Boolean);

  session
    .addColumns([SESSION_COLUMN_DOWNLOAD_DIR, SESSION_COLUMN_START_ADDED])
    .then(($session) => {
      destination = $session[SESSION_COLUMN_DOWNLOAD_DIR];
      start = $session[SESSION_COLUMN_START_ADDED];
    })
    .finally(() => {
      loadingInitial = false;
    });

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSubmit = () => {
    const promises = files.map((file) => toBase64(file));
    return Promise.all(promises).then((base64Files) =>
      base64Files.map((base64File) => ({
        'metainfo': base64File,
        'paused': !start,
        'download-dir': destination,
      }))
    );
  };

  const handleUrlSubmit = () => {
    const dataItems = cleanFileNames.map((filename) => ({
      filename,
      'paused': !start,
      'download-dir': destination,
    }));
    return Promise.resolve(dataItems);
  };

  const handleSubmit = () => {
    loadingSubmit = true;

    let promise;
    if (tab === 'file') {
      promise = handleFileSubmit();
    } else if (tab === 'url') {
      promise = handleUrlSubmit();
    } else {
      throw new Error('<Add> Unexpected tab');
    }

    promise
      .then((dataItems) => {
        return Promise.all(dataItems.map((item) => torrents.add(item)));
      })
      .then((responses) => {
        const duplicateResponses = responses
          .map((response) => response.arguments['torrent-duplicate'])
          .filter(Boolean);
        const pluralize = responses.length > 1 ? 'torrents' : 'torrent';

        if (!duplicateResponses.length) {
          alerts.add(`Succesfully added ${responses.length} ${pluralize}`);
        } else if (duplicateResponses.length === responses.length) {
          alerts.add(`All the uploaded ${pluralize} already exist`, 'negative');
        } else {
          const pluralizeDuplicates =
            duplicateResponses.length > 1 ? 'torrents' : 'torrent';
          const successCount = responses.length - duplicateResponses.length;
          alerts.add(
            `Succesfully added ${successCount} ${pluralize}, the other ${duplicateResponses.length} ${pluralizeDuplicates} already exist`,
            'negative'
          );
        }

        modals.close();
      })
      .catch((e) => {
        if (e) {
          console.error(e);
          alerts.add(
            'Failed to add some torrent, please try again',
            'negative'
          );
        }
        loadingSubmit = false;
      });
  };
</script>

<h1>Add Torrents</h1>
<ul class="tabs">
  <li on:click="{() => (tab = 'url')}" class:active="{tab === 'url'}">
    By URL
  </li>
  <li on:click="{() => (tab = 'file')}" class:active="{tab === 'file'}">
    By File
  </li>
</ul>

<div class="content" class:loading-initial="{loadingInitial}">
  <Icon name="SpinnerIcon" />
  <form on:submit|preventDefault="{handleSubmit}">
    {#if tab === 'url'}
      <InputMultiple
        label="Torrents"
        type="url"
        placeholder="Torrent URL or Magnet Link"
        bind:values="{fileNames}"
        required="{!cleanFileNames.length}"
      />
    {:else if tab === 'file'}
      <InputFile
        label="Torrents"
        bind:files
        multiple
        required
        accept=".torrent,application/x-bittorrent"
      />
    {/if}
    <InputPath
      label="Destination"
      placeholder="Destination"
      bind:value="{destination}"
      pattern="^/.*"
      validationMessage="Destination must be an absolute path."
      required
    />
    <div class="button-group">
      <Checkbox label="Start Torrent" bind:checked="{start}" />
      <Button priority="tertiary" on:click="{modals.close}">Cancel</Button>
      <Button priority="primary" loading="{loadingSubmit}" type="submit">
        Add Torrent
      </Button>
    </div>
  </form>
</div>

<style>
  h1 {
    color: var(--color-modal-header);
    font-size: 20px;
    font-weight: 500;
    padding: 20px 25px 0;
  }

  ul {
    color: var(--color-modal-tab-label);
    font-size: 13px;
    font-weight: 500;
    margin: 5px 0 0;
    padding: 0 25px;
    box-shadow: inset 0 -1px 0 var(--color-modal-add-tab-bar-shadow);
  }

  li {
    cursor: pointer;
    display: inline-block;
    margin-right: 15px;
    padding: 5px 0 10px 0;
    position: relative;
  }

  li.active {
    color: var(--color-modal-tab-label-active);
    font-weight: 700;
  }

  li.active::after {
    background-color: var(--color-modal-tab-label-active);
    bottom: 0;
    content: '';
    height: 1px;
    left: 0;
    position: absolute;
    right: 0;
  }

  .content {
    overflow-y: auto;
    padding: 20px 25px 20px 25px;
    color: var(--color-modal-text);
    position: relative;
  }

  .content.loading-initial {
    display: flex;
    align-items: center;
    justify-content: center;
    fill: var(--color-modal-loading);
  }

  .content > :global(.icon) {
    position: absolute;
    height: 30px;
    width: 30px;
    display: none;
  }

  .content.loading-initial > :global(.icon) {
    display: inherit;
  }

  .content.loading-initial form {
    visibility: hidden;
  }

  .button-group {
    display: flex;
    justify-content: flex-end;
    margin-top: 25px;
    gap: 10px;
  }
</style>
