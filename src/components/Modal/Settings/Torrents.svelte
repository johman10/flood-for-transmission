<script>
  import Header from './Header.svelte';
  import Icon from '~components/Icon';
  import Input from '~components/Input';
  import Checkbox from '~components/Checkbox';
  import Button from '~components/Button';
  import { session, modals, alerts } from '~helpers/stores';
  import {
    SESSION_COLUMN_DOWNLOAD_DIR,
    SESSION_COLUMN_START_ADDED,
    SESSION_COLUMN_RENAME_PARTIAL_FILES,
    SESSION_COLUMN_IDLE_SEEDING_LIMIT_ENABLED,
    SESSION_COLUMN_IDLE_SEEDING_LIMIT,
    SESSION_COLUMN_SEED_RATIO_LIMITED,
    SESSION_COLUMN_SEED_RATIO_LIMIT,
  } from '~helpers/constants/columns';

  let loadingInitial = true;
  let loadingSubmit = false;
  let downloadDir = null;
  let startAddedTorrents = null;
  let renamePartialFiles = null;
  let seedRatioLimited = null;
  let seedRatioLimit = null;
  let idleSeedingLimited = null;
  let idleSeedingLimit = null;

  session
    .addColumns([
      SESSION_COLUMN_DOWNLOAD_DIR,
      SESSION_COLUMN_START_ADDED,
      SESSION_COLUMN_RENAME_PARTIAL_FILES,
      SESSION_COLUMN_SEED_RATIO_LIMITED,
      SESSION_COLUMN_SEED_RATIO_LIMIT,
      SESSION_COLUMN_IDLE_SEEDING_LIMIT_ENABLED,
      SESSION_COLUMN_IDLE_SEEDING_LIMIT,
    ])
    .then(($session) => {
      downloadDir = $session[SESSION_COLUMN_DOWNLOAD_DIR];
      startAddedTorrents = $session[SESSION_COLUMN_START_ADDED];
      renamePartialFiles = $session[SESSION_COLUMN_RENAME_PARTIAL_FILES];
      seedRatioLimited = $session[SESSION_COLUMN_SEED_RATIO_LIMITED];
      seedRatioLimit = $session[SESSION_COLUMN_SEED_RATIO_LIMIT];
      idleSeedingLimited = $session[SESSION_COLUMN_IDLE_SEEDING_LIMIT_ENABLED];
      idleSeedingLimit = $session[SESSION_COLUMN_IDLE_SEEDING_LIMIT];
      loadingInitial = false;
    })
    .catch(() => {
      alerts.add(
        'Unable to fetch the data for that action right now. Try again later.',
        'negative'
      );
    });

  const handleSubmit = () => {
    loadingSubmit = true;

    session
      .update({
        'download-dir': downloadDir,
        'start-added-torrents': startAddedTorrents,
        'rename-partial-files': renamePartialFiles,
        seedRatioLimited,
        seedRatioLimit,
        'idle-seeding-limit-enabled': idleSeedingLimited,
        'idle-seeding-limit': idleSeedingLimit,
      })
      .then(() => {
        alerts.add('Succesfully saved torrent settings');
      })
      .catch(() => {
        alerts.add(
          'Failed saving torrent settings, please try again',
          'negative'
        );
      })
      .finally(() => {
        loadingSubmit = false;
      });
  };
</script>

<div class="wrapper" class:loading-initial="{loadingInitial}">
  <Icon name="SpinnerIcon" />
  <form on:submit|preventDefault="{handleSubmit}">
    <Header text="Downloading" />
    <Input label="Download to" bind:value="{downloadDir}" />
    <Checkbox label="Start when added" bind:checked="{startAddedTorrents}" />
    <Checkbox
      label="{'Append ".part" to incomplete files\' names'}"
      bind:checked="{renamePartialFiles}"
    />

    <Header text="Seeding" />
    <Checkbox
      label="Stop seeding at ratio:"
      bind:checked="{seedRatioLimited}"
    />
    <Input bind:value="{seedRatioLimit}" type="number" />
    <Checkbox
      label="Stop seeding if idle for (min):"
      bind:checked="{idleSeedingLimited}"
    />
    <Input bind:value="{idleSeedingLimit}" type="number" />

    <div class="buttons">
      <Button type="button" priority="tertiary" on:click="{modals.close}">
        Cancel
      </Button>
      <Button type="submit" priority="primary" loading="{loadingSubmit}">
        Save settings
      </Button>
    </div>
  </form>
</div>

<style>
  .wrapper {
    min-height: 100%;
    display: flex;
  }

  .wrapper.loading-initial {
    align-items: center;
    justify-content: center;
    fill: #3ea7ff;
  }

  .wrapper > :global(.icon) {
    position: absolute;
    height: 30px;
    width: 30px;
    display: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .wrapper.loading-initial > :global(.icon) {
    display: inherit;
  }

  .wrapper.loading-initial form {
    visibility: hidden;
  }

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    line-height: 1;
    color: #7d8d9f;
  }

  form :global(.checkbox) {
    margin-bottom: 15px;
  }

  .buttons {
    flex-grow: 1;
    align-items: flex-end;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
</style>
