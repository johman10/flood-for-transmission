<script>
  import InputMultiple from '~components/InputMultiple';
  import InputPath from '~components/InputPath';
  import Checkbox from '~components/Checkbox';
  import Button from '~components/Button';
  import { modals, alerts } from '~helpers/stores';
  import {
    handleTorrentAddResponses,
  } from '~helpers/fileHelper';
  import { isValidUrl } from '~helpers/urlHelper';

  export let destination;
  export let start;

  const TORRENT_HASH_REGEX = /^[\da-f]{40}$/i;

  let fileNames = [];
  let loadingSubmit = false;

  $: cleanFileNames = fileNames
    .map((fileName) => fileName.trim())
    .filter(Boolean);

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

    handleUrlSubmit(event)
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

<form on:submit|preventDefault="{handleSubmit}">
  <InputMultiple
      label="Torrents"
      class="torrent-url-hash-input"
      placeholder="Torrent URL, Magnet Link or hash"
      bind:values="{fileNames}"
      required="{!cleanFileNames.length}"
  />
  <InputPath
    label="Destination"
    placeholder="Destination"
    bind:value="{destination}"
    pattern="^(/|[a-zA-Z]:\\).*$"
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

<style>
  .button-group {
    display: flex;
    justify-content: flex-end;
    margin-top: 25px;
    gap: 10px;
  }
</style>
