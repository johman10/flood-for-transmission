<script>
  import Input from '~components/Input';
  import Checkbox from '~components/Checkbox';
  import Button from '~components/Button';
  import {
    modals,
    torrents,
    alerts,
    selectedTorrents,
    session,
  } from '~helpers/stores';
  import { SESSION_COLUMN_DOWNLOAD_DIR } from '~helpers/constants/columns';

  let loading = false;
  let location = $session[SESSION_COLUMN_DOWNLOAD_DIR];
  let moveData = true;
  let basePath = false;

  const handleLocation = () => {
    if (loading) return;

    loading = true;
    if (!$selectedTorrents.length) {
      loading = false;
      alerts.add('Select at least one torrent to continue', 'negative');
      return;
    }

    torrents
      .setLocation($selectedTorrents, location, moveData)
      .then(() => {
        alerts.add('Succesfully set location');
        modals.close();
      })
      .catch(() => {
        alerts.add('Failed to set location', 'negative');
      });
  };
</script>

<h1>Set torrent location</h1>

<div class="content">
  <form on:submit|preventDefault="{handleLocation}">
    <Input
      type="text"
      bind:value="{location}"
      placeholder="Destination"
      label="Torrent location"
    />
    <Checkbox label="Use as base path" bind:checked="{basePath}" />
    <div class="button-group">
      <Checkbox label="Move data" bind:checked="{moveData}" />
      <Button priority="tertiary" on:click="{modals.close}">Cancel</Button>
      <Button priority="primary" loading="{loading}" type="submit">
        Set torrent location
      </Button>
    </div>
  </form>
</div>

<style>
  h1 {
    color: #e6f0ff;
    font-size: 20px;
    font-weight: 500;
    padding: 20px 25px 0;
  }

  .content {
    overflow-y: auto;
    padding: 20px 25px 20px 25px;
    color: #7d8d9f;
  }

  .button-group {
    display: flex;
    justify-content: flex-end;
    margin-top: 25px;
  }

  .button-group > :global(*) {
    margin-left: 10px;
  }
</style>
