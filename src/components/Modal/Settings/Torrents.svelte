<script>
  import Header from './Header.svelte';
  import Icon from '~components/Icon';
  import Input from '~components/Input';
  import InputPath from '~components/InputPath';
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
    SESSION_COLUMN_DOWNLOAD_QUEUE_SIZE,
    SESSION_COLUMN_DOWNLOAD_QUEUE_ENABLED,
    SESSION_COLUMN_SEED_QUEUE_SIZE,
    SESSION_COLUMN_SEED_QUEUE_ENABLED,
    SESSION_COLUMN_INCOMPLETE_DIR,
    SESSION_COLUMN_INCOMPLETE_DIR_ENABLED,
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
  let downloadQueueSize = null;
  let downloadQueueEnabled = null;
  let seedQueueSize = null;
  let seedQueueEnabled = null;
  let incompleteDir = null;
  let incompleteDirEnabled = null;

  session
    .addColumns([
      SESSION_COLUMN_DOWNLOAD_DIR,
      SESSION_COLUMN_START_ADDED,
      SESSION_COLUMN_RENAME_PARTIAL_FILES,
      SESSION_COLUMN_SEED_RATIO_LIMITED,
      SESSION_COLUMN_SEED_RATIO_LIMIT,
      SESSION_COLUMN_IDLE_SEEDING_LIMIT_ENABLED,
      SESSION_COLUMN_IDLE_SEEDING_LIMIT,
      SESSION_COLUMN_DOWNLOAD_QUEUE_SIZE,
      SESSION_COLUMN_DOWNLOAD_QUEUE_ENABLED,
      SESSION_COLUMN_SEED_QUEUE_SIZE,
      SESSION_COLUMN_SEED_QUEUE_ENABLED,
      SESSION_COLUMN_INCOMPLETE_DIR,
      SESSION_COLUMN_INCOMPLETE_DIR_ENABLED,
    ])
    .then(($session) => {
      downloadDir = $session[SESSION_COLUMN_DOWNLOAD_DIR];
      startAddedTorrents = $session[SESSION_COLUMN_START_ADDED];
      renamePartialFiles = $session[SESSION_COLUMN_RENAME_PARTIAL_FILES];
      seedRatioLimited = $session[SESSION_COLUMN_SEED_RATIO_LIMITED];
      seedRatioLimit = $session[SESSION_COLUMN_SEED_RATIO_LIMIT];
      idleSeedingLimited = $session[SESSION_COLUMN_IDLE_SEEDING_LIMIT_ENABLED];
      idleSeedingLimit = $session[SESSION_COLUMN_IDLE_SEEDING_LIMIT];
      downloadQueueSize = $session[SESSION_COLUMN_DOWNLOAD_QUEUE_SIZE];
      downloadQueueEnabled = $session[SESSION_COLUMN_DOWNLOAD_QUEUE_ENABLED];
      seedQueueSize = $session[SESSION_COLUMN_SEED_QUEUE_SIZE];
      seedQueueEnabled = $session[SESSION_COLUMN_SEED_QUEUE_ENABLED];
      incompleteDir = $session[SESSION_COLUMN_INCOMPLETE_DIR];
      incompleteDirEnabled = $session[SESSION_COLUMN_INCOMPLETE_DIR_ENABLED];
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
        [SESSION_COLUMN_DOWNLOAD_DIR]: downloadDir,
        [SESSION_COLUMN_START_ADDED]: startAddedTorrents,
        [SESSION_COLUMN_RENAME_PARTIAL_FILES]: renamePartialFiles,
        [SESSION_COLUMN_SEED_RATIO_LIMITED]: seedRatioLimited,
        [SESSION_COLUMN_SEED_RATIO_LIMIT]: seedRatioLimit,
        [SESSION_COLUMN_IDLE_SEEDING_LIMIT_ENABLED]: idleSeedingLimited,
        [SESSION_COLUMN_IDLE_SEEDING_LIMIT]: idleSeedingLimit,
        [SESSION_COLUMN_DOWNLOAD_QUEUE_SIZE]: downloadQueueSize,
        [SESSION_COLUMN_DOWNLOAD_QUEUE_ENABLED]: downloadQueueEnabled,
        [SESSION_COLUMN_SEED_QUEUE_SIZE]: seedQueueSize,
        [SESSION_COLUMN_SEED_QUEUE_ENABLED]: seedQueueEnabled,
        [SESSION_COLUMN_INCOMPLETE_DIR]: incompleteDir,
        [SESSION_COLUMN_INCOMPLETE_DIR_ENABLED]: incompleteDirEnabled
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
    <InputPath
      label="Download to"
      bind:value="{downloadDir}"
      hint="This will be used as the default location for Transmission when adding a new torrent."
    />
    <Checkbox label="Start when added" bind:checked="{startAddedTorrents}" />
    <Checkbox
      label="{'Append ".part" to incomplete files\' names'}"
      bind:checked="{renamePartialFiles}"
    />
    <Checkbox
      label="Custom download queue size:"
      bind:checked="{downloadQueueEnabled}"
    />
    <Input bind:value="{downloadQueueSize}" type="number" hint="Will default to 5 when not enabled" />
    <Checkbox
      label="Incomplete directory:"
      bind:checked="{incompleteDirEnabled}"
    />
    <InputPath bind:value="{incompleteDir}" hint="Will default to the download directory when not enabled" />

    <Header text="Seeding" />
    <Checkbox
      label="Stop seeding at ratio:"
      bind:checked="{seedRatioLimited}"
    />
    <Input bind:value="{seedRatioLimit}" type="number" step="0.000001" />
    <Checkbox
      label="Stop seeding if idle for (min):"
      bind:checked="{idleSeedingLimited}"
    />
    <Input bind:value="{idleSeedingLimit}" type="number" />
    <Checkbox
      label="Custom seed queue size:"
      bind:checked="{seedQueueEnabled}"
    />
    <Input bind:value="{seedQueueSize}" type="number" hint="Will default to 5 if not enabled" />

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
    fill: var(--color-modal-loading);
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
    color: var(--color-modal-text);
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
