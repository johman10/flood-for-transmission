<script>
  import Input from '~components/Input';
  import Icon from '~components/Icon';
  import FileInput from '~components/FileInput';
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
  let filename = null;
  let files = null;
  let destination = null;
  let start = null;

  session
    .addColumns([SESSION_COLUMN_DOWNLOAD_DIR, SESSION_COLUMN_START_ADDED])
    .then(($session) => {
      destination = $session[SESSION_COLUMN_DOWNLOAD_DIR];
      start = $session[SESSION_COLUMN_START_ADDED];
    })
    .finally(() => {
      loadingInitial = false;
    });

  const setTab = (newTab) => {
    filename = null;
    files = null;
    tab = newTab;
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = () => {
    loadingSubmit = true;

    let metainfoPromise = Promise.resolve();
    if (files) {
      metainfoPromise = toBase64(files[0]);
    }

    metainfoPromise
      .then((metainfo) => {
        const data = {
          filename,
          'paused': !start,
          'download-dir': destination,
        };
        if (metainfo) {
          delete data.filename;
          data.metainfo = metainfo;
        }
        return torrents.add(data);
      })
      .then((response) => {
        if (response.arguments['torrent-duplicate']) {
          alerts.add('The torrent already exists', 'negative');
          return;
        }

        alerts.add('Succesfully added a torrent');
        modals.close();
      })
      .catch(() => {
        alerts.add('Failed to add torrent', 'negative');
      })
      .finally(() => {
        loadingSubmit = false;
      });
  };
</script>

<h1>Add Torrents</h1>
<ul class="tabs">
  <li on:click="{setTab.bind(this, 'url')}" class:active="{tab === 'url'}">
    By URL
  </li>
  <li on:click="{setTab.bind(this, 'file')}" class:active="{tab === 'file'}">
    By File
  </li>
</ul>

<div class="content" class:loading-initial="{loadingInitial}">
  <Icon name="SpinnerIcon" />
  <form on:submit|preventDefault="{handleSubmit}">
    {#if tab === 'url'}
      <Input
        label="Torrents"
        type="url"
        placeholder="Torrent URL or Magnet Link"
        bind:value="{filename}"
        required
      />
    {:else}
      <FileInput
        label="Torrents"
        bind:files
        required
        accept=".torrent,application/x-bittorrent"
      />
    {/if}
    <Input
      label="Destination"
      placeholder="Destination"
      bind:value="{destination}"
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
    color: #e6f0ff;
    font-size: 20px;
    font-weight: 500;
    padding: 20px 25px 0;
  }

  ul {
    color: #abc2e2;
    font-size: 13px;
    font-weight: 500;
    margin: 5px 0 0;
    padding: 0 25px;
    box-shadow: inset 0 -1px 0 #363e48;
  }

  li {
    cursor: pointer;
    display: inline-block;
    margin-right: 15px;
    padding: 5px 0 10px 0;
    position: relative;
  }

  li.active {
    color: #3ea7ff;
    font-weight: 700;
  }

  li.active::after {
    background-color: #3ea7ff;
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
    color: #7d8d9f;
    position: relative;
  }

  .content.loading-initial {
    display: flex;
    align-items: center;
    justify-content: center;
    fill: #3ea7ff;
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
