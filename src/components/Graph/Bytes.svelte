<script>
  import { sessionStats, session } from '~helpers/stores';
  import { getSize } from '~helpers/sizeHelper';
  import {
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SIZE,
    SESSION_STATS_CUMULATIVE_STATS,
    SESSION_STATS_TOTAL_UPLOAD,
    SESSION_STATS_TOTAL_DOWNLOAD,
  } from '~helpers/constants/columns';

  export let direction;
  export let hidden = false;

  if (!['upload', 'download'].includes(direction)) {
    throw new Error(
      `[Graph/Bytes] unrecognized direction. ${direction} not one of ['upload', 'download']`
    );
  }

  $: valueColumn =
    direction === 'upload'
      ? SESSION_STATS_TOTAL_UPLOAD
      : SESSION_STATS_TOTAL_DOWNLOAD;

  $: ({ value, size } = getSize(
    $sessionStats[SESSION_STATS_CUMULATIVE_STATS]?.[valueColumn],
    {
      perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
    }
  ));
</script>

<div class="bytes" class:hidden>
  {value}
  <span class="bytes__size">{size}</span>
</div>

<style>
  .bytes {
    grid-area: bytes;
    color: var(--color);
    font-size: 12px;
    transition: opacity 0.25s;
    white-space: nowrap;
  }

  .bytes__size {
    font-size: 10px;
  }

  .hidden {
    opacity: 0;
  }
</style>
