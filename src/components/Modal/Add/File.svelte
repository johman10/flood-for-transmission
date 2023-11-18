<script>
  import InputFile from '~components/InputFile';
  import InputPath from '~components/InputPath';
  import Checkbox from '~components/Checkbox';
  import Button from '~components/Button';
  import { modals, torrents, alerts } from '~helpers/stores';
  import {
    getFileAddBody,
    handleTorrentAddResponses,
  } from '~helpers/fileHelper';

  export let destination;
  export let start;

  let files = [];
  let loadingSubmit = false;

  const handleSubmit = (event) => {
    loadingSubmit = true;

    getFileAddBody(files, start, destination)
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
  <InputFile
    label="Files"
    bind:files="{files}"
    multiple
    required
    accept=".torrent,application/x-bittorrent"
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
