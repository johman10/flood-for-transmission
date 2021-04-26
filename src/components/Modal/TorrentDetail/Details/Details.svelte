<script>
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

  $: size = getSize($torrentDetails[TRANSMISSION_COLUMN.SIZE], {
    perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
  });

  $: downloaded = getSize($torrentDetails[TRANSMISSION_COLUMN.DOWNLOADED], {
    perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
  });

  $: uploaded = getSize($torrentDetails[TRANSMISSION_COLUMN.UPLOADED], {
    perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
  });
</script>

<div class="content">
  <h1 class="header">General</h1>

  <div class="column column--label">Added</div>
  <div class="column column--value">
    <DateRenderer value="{$torrentDetails[TRANSMISSION_COLUMN.ADDED]}" />
  </div>

  <div class="column column--label">Done</div>
  <div class="column column--value">
    <DateRenderer value="{$torrentDetails[TRANSMISSION_COLUMN.DONE]}" />
  </div>

  <div class="column column--label">Location</div>
  <div class="column column--value">
    {$torrentDetails[TRANSMISSION_COLUMN.DOWNLOAD_DIR]}
  </div>

  <div class="column column--label">Labels</div>
  <div class="column column--value">
    {#if $torrentDetails[TRANSMISSION_COLUMN.LABELS]}
      {#each $torrentDetails[TRANSMISSION_COLUMN.LABELS] as label}
        <Badge>{label}</Badge>
      {/each}
    {/if}
  </div>

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

  <h1 class="header">Torrent</h1>

  <div class="column column--label">Comment</div>
  <div class="column column--value">
    {$torrentDetails[TRANSMISSION_COLUMN.COMMENT]}
  </div>

  <div class="column column--label">Creation Date</div>
  <div class="column column--value">
    {$torrentDetails[TRANSMISSION_COLUMN.CREATED]}
  </div>

  <div class="column column--label">Hash</div>
  <div class="column column--value">
    {$torrentDetails[TRANSMISSION_COLUMN.HASH]}
  </div>

  <div class="column column--label">Size</div>
  <div class="column column--value">{size.value}{size.size}</div>

  <div class="column column--label">Private</div>
  <div class="column column--value">
    <BooleanRenderer value="{$torrentDetails[TRANSMISSION_COLUMN.PRIVATE]}" />
  </div>

  <div class="column column--label">Error text</div>
  <div class="column column--value">
    {$torrentDetails[TRANSMISSION_COLUMN.ERROR_STRING]}
  </div>
</div>

<style>
  .content {
    font-size: 13px;
    color: var(--color-modal-text);
    line-height: 16px;
    display: grid;
    grid-gap: 1px 0;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(2, minmax(136px, max-content));
    padding: 20px 25px;
    height: 100%;
    overflow-y: auto;
  }

  /* To add empty space in the bottom when scrolling */
  .content::after {
    content: '';
    height: 25px;
  }

  .header {
    font-size: inherit;
    color: var(--color-modal-details-header);
    font-weight: 700;
    grid-column: 1 / 3;
    padding-top: 10px;
  }

  .header:first-of-type {
    padding-top: 0;
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
</style>
