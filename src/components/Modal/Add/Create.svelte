<script>
  import createTorrent from '~helpers/create-torrent';

  import InputMultiple from '~components/InputMultiple';
  import InputFile from '~components/InputFile';
  import Checkbox from '~components/Checkbox';
  import Button from '~components/Button';
  import { modals, torrents, alerts } from '~helpers/stores';
  import Input from '~components/Input';
  import {
    getFileAddBody,
    handleTorrentAddResponses,
  } from '~helpers/fileHelper';

  let files = [];
  let trackers = []
  let loadingSubmit = false;
  let baseName = null;
  let comment = null;
  let infoSource = null;
  let isPrivate = false

  $: cleanTrackers = trackers
    .map((tracker) => tracker.trim())
    .filter(Boolean);

  const handleTorrentCreation = () => {
    return new Promise((resolve, reject) => {
      createTorrent(files,
      {
        name: baseName,
        comment,
        createdBy: 'Flood for Transmission - https://github.com/johman10/flood-for-transmission',
        private: isPrivate,
        announceList: cleanTrackers ? [cleanTrackers.map(tracker => ([tracker]))] : undefined,
        info: infoSource
          ? {
              source: infoSource,
            }
          : undefined,
      }, (err, torrent) => {
        if (err) return reject(err);
        return resolve(torrent);
      })
    })
  }

  const handleSubmit = () => {
    loadingSubmit = true;

    handleTorrentCreation()
      .then((torrentBuffer) => {
        return getFileAddBody([new Blob([torrentBuffer])])
      })
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
            'Failed to create torrent, please try again',
            'negative'
          );
        }
        loadingSubmit = false;
      });
  };
</script>

<form on:submit|preventDefault="{handleSubmit}">
  <InputFile
    label="Torrents"
    bind:files="{files}"
    multiple
    required
  />
  <InputMultiple
      label="Trackers (optional)"
      placeholder="Tracker URL"
      bind:values="{trackers}"
  />
  <Input
    label="Base name"
    placeholder="Optional base name for the torrent"
    bind:value="{baseName}"
  />
  <Input
    label="Comment"
    placeholder="Optional comment for the torrent"
    bind:value="{comment}"
  />
  <Input
    label="Info source"
    placeholder="Optional source entry for in the infohash"
    bind:value="{infoSource}"
  />
  <Checkbox
    label="Private"
    bind:checked="{isPrivate}"
  />

  <div class="button-group">
    <!-- <Checkbox label="Start Torrent" bind:checked="{start}" /> -->
    <Button priority="tertiary" on:click="{modals.close}">Cancel</Button>
    <Button priority="primary" loading="{loadingSubmit}" type="submit">
      Create Torrent
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
