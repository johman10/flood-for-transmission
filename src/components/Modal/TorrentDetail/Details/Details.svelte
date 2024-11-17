<script>
  import { preventDefault } from 'svelte/legacy';

  import { torrentDetails, session } from '~helpers/stores';
  import {
    TRANSMISSION_COLUMN,
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SIZE,
  } from '~helpers/constants/columns';
  import { getSize } from '~helpers/sizeHelper';
  import DateRenderer from '~components/TorrentList/Renderers/DateRenderer.svelte';
  import BooleanRenderer from '~components/TorrentList/Renderers/BooleanRenderer.svelte';
  import Badge from '~components/Badge';
  import Input from '~components/Input';
  import Select from '~components/Select';
  import Checkbox from '~components/Checkbox';
  import InputPath from '~components/InputPath';
  import Button from '~components/Button';

  let downloadLimit = $state(null);
  let downloadLimitEnabled = $state(null);
  let uploadLimit = $state(null);
  let uploadLimitEnabled = $state(null);
  let honorsSessionLimits = $state(null);
  let location = $state(null);
  let peerLimit = $state(null);
  let queuePosition = $state(null);
  let seedIdleLimit = $state(null);
  let seedIdleMode = $state(null);
  let seedRatioLimit = $state(null);
  let seedRatioMode = $state(null);
  let sequentialDownload = $state(null);

  let loadingInitial = $state(true);
  let loadingSubmit = $state(false);

  const seedModeOptions = [
    { label: 'Global', value: 0 },
    { label: 'Custom', value: 1 },
    { label: 'Unlimited', value: 2 },
  ];

  function setServerValues() {
    downloadLimit = $torrentDetails[TRANSMISSION_COLUMN.DOWNLOAD_LIMIT];
    downloadLimitEnabled =
      $torrentDetails[TRANSMISSION_COLUMN.DOWNLOAD_LIMIT_ENABLED];
    uploadLimit = $torrentDetails[TRANSMISSION_COLUMN.UPLOAD_LIMIT];
    uploadLimitEnabled =
      $torrentDetails[TRANSMISSION_COLUMN.UPLOAD_LIMIT_ENABLED];
    honorsSessionLimits =
      $torrentDetails[TRANSMISSION_COLUMN.HONORS_SESSION_LIMITS];
    location = $torrentDetails[TRANSMISSION_COLUMN.DOWNLOAD_DIR];
    peerLimit = $torrentDetails[TRANSMISSION_COLUMN.PEER_LIMIT];
    queuePosition = $torrentDetails[TRANSMISSION_COLUMN.QUEUE_POSITION];
    seedIdleLimit = $torrentDetails[TRANSMISSION_COLUMN.SEED_IDLE_LIMIT];
    seedIdleMode = $torrentDetails[TRANSMISSION_COLUMN.SEED_IDLE_MODE];
    seedRatioLimit = $torrentDetails[TRANSMISSION_COLUMN.SEED_RATIO_LIMIT];
    seedRatioMode = $torrentDetails[TRANSMISSION_COLUMN.SEED_RATIO_MODE];
    sequentialDownload =
      $torrentDetails[TRANSMISSION_COLUMN.SEQUENTIAL_DOWNLOAD];

    loadingInitial = false;
  }

  function handleSubmit() {
    loadingSubmit = true;

    torrentDetails
      .setDetails($torrentDetails, {
        [TRANSMISSION_COLUMN.DOWNLOAD_LIMIT]: downloadLimit,
        [TRANSMISSION_COLUMN.DOWNLOAD_LIMIT_ENABLED]: downloadLimitEnabled,
        [TRANSMISSION_COLUMN.UPLOAD_LIMIT]: uploadLimit,
        [TRANSMISSION_COLUMN.UPLOAD_LIMIT_ENABLED]: uploadLimitEnabled,
        [TRANSMISSION_COLUMN.HONORS_SESSION_LIMITS]: honorsSessionLimits,
        [TRANSMISSION_COLUMN.DOWNLOAD_DIR]: location,
        [TRANSMISSION_COLUMN.PEER_LIMIT]: peerLimit,
        [TRANSMISSION_COLUMN.QUEUE_POSITION]: queuePosition,
        [TRANSMISSION_COLUMN.SEED_IDLE_LIMIT]: seedIdleLimit,
        [TRANSMISSION_COLUMN.SEED_IDLE_MODE]: seedIdleMode,
        [TRANSMISSION_COLUMN.SEED_RATIO_LIMIT]: seedRatioLimit,
        [TRANSMISSION_COLUMN.SEED_RATIO_MODE]: seedRatioMode,
        [TRANSMISSION_COLUMN.SEQUENTIAL_DOWNLOAD]: sequentialDownload,
      })
      .catch(() => {
        setServerValues();
      })
      .finally(() => {
        loadingSubmit = false;
      });
  }

  $effect(() => {
    if (loadingInitial && $torrentDetails.loaded) {
      setServerValues();
    }
  });
  let size = $derived(
    getSize($torrentDetails[TRANSMISSION_COLUMN.SIZE], {
      perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
    })
  );
  let downloaded = $derived(
    getSize($torrentDetails[TRANSMISSION_COLUMN.DOWNLOADED], {
      perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
    })
  );
  let uploaded = $derived(
    getSize($torrentDetails[TRANSMISSION_COLUMN.UPLOADED], {
      perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
    })
  );
</script>

<form onsubmit={preventDefault(handleSubmit)} class="content">
  <div class="info">
    <h1 class="header no-padding-top">General</h1>

    <div class="column column--label">Added</div>
    <div class="column column--value">
      <DateRenderer value={$torrentDetails[TRANSMISSION_COLUMN.ADDED]} />
    </div>

    <div class="column column--label">Done</div>
    <div class="column column--value">
      <DateRenderer value={$torrentDetails[TRANSMISSION_COLUMN.DONE]} />
    </div>

    <div class="column column--label">Labels</div>
    <div class="column column--value">
      {#if $torrentDetails[TRANSMISSION_COLUMN.LABELS]}
        {#each $torrentDetails[TRANSMISSION_COLUMN.LABELS] as label}
          <Badge>{label}</Badge>
        {/each}
      {/if}
    </div>
  </div>

  <div class="inputs">
    <div class="input-group">
      <InputPath bind:value={location} label="Download location" />
    </div>
  </div>

  <div class="info">
    <h1 class="header">Transfer</h1>

    <div class="column column--label">Download progress</div>
    <div class="column column--value">
      {Math.round(
        $torrentDetails[TRANSMISSION_COLUMN.DOWNLOAD_PROGRESS] * 10000
      ) / 100}%
    </div>

    <div class="column column--label">Downloaded</div>
    <div class="column column--value">{downloaded.value}{downloaded.size}</div>

    <div class="column column--label">Uploaded</div>
    <div class="column column--value">{uploaded.value}{uploaded.size}</div>

    <div class="column column--label">Peers</div>
    <div class="column column--value">
      {$torrentDetails[TRANSMISSION_COLUMN.DOWNLOADING_FROM]}
      of
      {$torrentDetails[TRANSMISSION_COLUMN.PEERS_CONNECTED]}
    </div>

    <div class="column column--label">Seeds</div>
    <div class="column column--value">
      {$torrentDetails[TRANSMISSION_COLUMN.SEEDING_TO]}
      of
      {$torrentDetails[TRANSMISSION_COLUMN.PEERS_CONNECTED]}
    </div>
  </div>

  <div class="inputs">
    <div class="input-group">
      <Checkbox
        bind:checked={downloadLimitEnabled}
        label="Download limit (kB/s)"
      />
      <Input bind:value={downloadLimit} type="number" />
    </div>

    <div class="input-group">
      <Checkbox bind:checked={uploadLimitEnabled} label="Upload limit (kB/s)" />
      <Input bind:value={uploadLimit} type="number" />
    </div>

    <div class="input-group">
      <Checkbox
        bind:checked={honorsSessionLimits}
        label="Honor session limits"
        hint="Ignores the global session limit if disabled"
      />
    </div>

    <div class="input-group">
      <Checkbox
        bind:checked={sequentialDownload}
        label="Download sequentially"
        hint="Download file pieces from start to end instead of at random"
      />
    </div>

    <div class="input-group">
      <Input
        bind:value={peerLimit}
        type="number"
        label="Maximum amount of peers"
      />
    </div>

    <div class="input-group">
      <Input bind:value={queuePosition} type="number" label="Queue position" />
    </div>

    <div class="input-group">
      <Select
        options={seedModeOptions}
        onchange={(event) => (seedIdleMode = event.detail)}
        value={seedIdleMode}
        direction="below"
        label="Seed idle mode"
      />
      <Input
        bind:value={seedIdleLimit}
        type="number"
        label="Seed idle limit"
        disabled={seedIdleMode !== 1}
      />
    </div>

    <div class="input-group">
      <Select
        options={seedModeOptions}
        onchange={(event) => (seedRatioMode = event.detail)}
        value={seedRatioMode}
        direction="below"
        label="Seed ratio mode"
      />
      <Input
        bind:value={seedRatioLimit}
        type="number"
        label="Seed ratio limit"
        step="0.01"
        disabled={seedRatioMode !== 1}
      />
    </div>
  </div>

  <div class="info">
    <h1 class="header">Torrent</h1>

    <div class="column column--label">Comment</div>
    <div class="column column--value">
      {$torrentDetails[TRANSMISSION_COLUMN.COMMENT]}
    </div>

    <div class="column column--label">Creation Date</div>
    <div class="column column--value">
      <DateRenderer value={$torrentDetails[TRANSMISSION_COLUMN.CREATED]} />
    </div>

    <div class="column column--label">Hash</div>
    <div class="column column--value">
      {$torrentDetails[TRANSMISSION_COLUMN.HASH]}
    </div>

    <div class="column column--label">Size</div>
    <div class="column column--value">{size.value}{size.size}</div>

    <div class="column column--label">Private</div>
    <div class="column column--value">
      <BooleanRenderer value={$torrentDetails[TRANSMISSION_COLUMN.PRIVATE]} />
    </div>

    <div class="column column--label">Error text</div>
    <div class="column column--value">
      {$torrentDetails[TRANSMISSION_COLUMN.ERROR_STRING]}
    </div>
  </div>

  <div class="buttons">
    <Button type="button" priority="tertiary" onclick={setServerValues}>
      Reset
    </Button>
    <Button type="submit" priority="primary" loading={loadingSubmit}>
      Save config
    </Button>
  </div>
</form>

<style>
  .content {
    overflow-y: auto;
    font-size: 13px;
    color: var(--color-modal-text);
    line-height: 16px;
    padding: 20px 25px;
    height: 100%;
  }

  /* To add empty space in the bottom when scrolling */
  .content::after {
    content: '';
    height: 25px;
  }

  .info {
    display: grid;
    grid-gap: 1px 0;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(2, minmax(136px, max-content));
  }

  .header {
    font-size: inherit;
    color: var(--color-modal-details-header);
    font-weight: 700;
    grid-column: 1 / 3;
  }

  .header.no-padding-top {
    padding-top: 0;
  }

  .inputs {
    padding-top: 10px;
  }

  .input-group {
    padding-bottom: 15px;
    display: flex;
    gap: 5px;
    flex-direction: column;
  }

  .inputs :global(.input-container) {
    margin-bottom: 0;
  }

  .column.column--label {
    padding-right: 15px;
    font-weight: 500;
    white-space: nowrap;
    grid-column: 1;
  }

  .column.column--value {
    grid-column: 2;
    display: flex;
    flex-wrap: wrap;
    column-gap: 10px;
    row-gap: 5px;
  }

  .column.column--value > :global(.badge) {
    margin-left: 0;
  }

  .buttons {
    flex-grow: 1;
    align-items: flex-end;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
  }
</style>
