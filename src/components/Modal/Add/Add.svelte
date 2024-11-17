<script>
  import { preventDefault } from 'svelte/legacy';

  import InputMultiple from '~components/InputMultiple';
  import InputPath from '~components/InputPath';
  import InputFile from '~components/InputFile';
  import Icon from '~components/Icon';
  import Checkbox from '~components/Checkbox';
  import Button from '~components/Button';
  import { modals, torrents, alerts, session } from '~helpers/stores';
  import { isValidUrl } from '~helpers/urlHelper';
  import {
    SESSION_COLUMN_DOWNLOAD_DIR,
    SESSION_COLUMN_START_ADDED,
  } from '~helpers/constants/columns';
  import { PATH_VALIDATION_REGEX } from '~helpers/constants/paths';
  import {
    getFileAddBody,
    handleTorrentAddResponses,
  } from '~helpers/fileHelper';

  const TORRENT_HASH_REGEX = /^[\da-f]{40}$/i;

  let loadingInitial = $state(true);
  let loadingSubmit = $state(false);
  let tab = $state('url');
  let fileNames = $state([]);
  let files = $state(null);
  let destination = $state(null);
  let start = $state(null);

  let cleanFileNames = $derived(
    fileNames.map((fileName) => fileName.trim()).filter(Boolean)
  );

  session
    .addColumns([SESSION_COLUMN_DOWNLOAD_DIR, SESSION_COLUMN_START_ADDED])
    .then(($session) => {
      destination = $session[SESSION_COLUMN_DOWNLOAD_DIR];
      start = $session[SESSION_COLUMN_START_ADDED];
    })
    .finally(() => {
      loadingInitial = false;
    });

  const validateInputs = (formElement) => {
    const inputs = Array.from(
      formElement.querySelectorAll('.torrent-url-hash-input')
    );
    const validity = inputs.map(
      (input) => TORRENT_HASH_REGEX.test(input.value) || isValidUrl(input.value)
    );
    const invalidIndex = validity.indexOf(false);

    if (invalidIndex === -1) return false;

    // Set errors for the first invalid input
    inputs[invalidIndex].setCustomValidity(
      'Invalid URL, magnet or torrent hash'
    );
    formElement.reportValidity();
    return true;
  };

  const handleUrlSubmit = (event) => {
    if (validateInputs(event.target)) {
      return Promise.reject();
    }

    const dataItems = cleanFileNames.map((filename) => {
      let hashUrl;
      if (TORRENT_HASH_REGEX.test(filename)) {
        hashUrl = `magnet:?xt=urn:btih:${filename}`;
      }

      return {
        'filename': hashUrl || filename,
        'paused': !start,
        'download-dir': destination,
      };
    });
    return Promise.resolve(dataItems);
  };

  const handleSubmit = (event) => {
    loadingSubmit = true;

    let promise;
    if (tab === 'file') {
      promise = getFileAddBody(files, start, destination);
    } else if (tab === 'url') {
      promise = handleUrlSubmit(event);
    } else {
      throw new Error('<Add> Unexpected tab');
    }

    promise
      .then((dataItems) => {
        return Promise.all(dataItems.map((item) => torrents.add(item)));
      })
      .then((responses) => {
        handleTorrentAddResponses(responses);

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
  <li onclick={() => (tab = 'url')} class:active={tab === 'url'}>
    By URL or hash
  </li>
  <li onclick={() => (tab = 'file')} class:active={tab === 'file'}>By File</li>
</ul>

<div class="content" class:loading-initial={loadingInitial}>
  <Icon name="SpinnerIcon" />
  <form onsubmit={preventDefault(handleSubmit)}>
    {#if tab === 'url'}
      <InputMultiple
        label="Torrents"
        class="torrent-url-hash-input"
        placeholder="Torrent URL, Magnet Link or hash"
        bind:values={fileNames}
        required={!cleanFileNames.length}
      />
    {:else if tab === 'file'}
      <InputFile
        label="Torrents"
        bind:files={files}
        multiple
        required
        accept=".torrent,application/x-bittorrent"
      />
    {/if}
    <InputPath
      label="Destination"
      placeholder="Destination"
      bind:value={destination}
      pattern={PATH_VALIDATION_REGEX}
      validationMessage="Destination must be an absolute path."
      required
    />
    <div class="button-group">
      <Checkbox label="Start Torrent" bind:checked={start} />
      <Button priority="tertiary" onclick={modals.close}>Cancel</Button>
      <Button priority="primary" loading={loadingSubmit} type="submit">
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
