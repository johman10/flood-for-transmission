<script>
  import { session } from '~helpers/stores';
  import { getSize } from '~helpers/sizeHelper';
  import Icon from '~components/Icon';
  import {
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SPEED,
  } from '~helpers/constants/columns';

  /**
   * @typedef {Object} Props
   * @property {any} direction
   * @property {boolean} [hidden]
   */

  /** @type {Props} */
  let { direction, hidden = false } = $props();

  const speedLimit = session.speedLimit(direction);
  let { value: limit, size: limitSize } = $derived(
    getSize($speedLimit, {
      isSpeed: true,
      startSize: 'kB',
      perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED],
    })
  );
</script>

<div
  class="limit"
  class:upload={direction === 'upload'}
  class:download={direction === 'download'}
  class:hidden={hidden}
>
  {#if limit}
    {limit}
    <span class="speed__size">{limitSize}</span>
  {:else}
    <Icon name="InfinityIcon" />
  {/if}
</div>

<style>
  .limit {
    grid-area: limit;
    color: var(--color-background);
    border-radius: 2px;
    font-size: 10px;
    font-style: normal;
    font-weight: 600;
    padding: 0 4px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    transition: opacity 0.25s;
  }

  .limit.upload {
    background-color: var(--color-upload);
  }

  .limit.download {
    background-color: var(--color-download);
  }

  .limit > :global(.icon) {
    flex-grow: 1;
    fill: currentColor;
    height: 12px;
  }

  .speed__size {
    white-space: nowrap;
  }

  .hidden {
    opacity: 0;
  }
</style>
