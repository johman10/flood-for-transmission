<script>
  import { session } from '~helpers/stores';
  import { getSize } from '~helpers/sizeHelper';
  import Icon from '~components/Icon';
  import {
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SPEED,
  } from '~helpers/constants/columns';

  export let direction;
  export let hidden = false;

  const speedLimit = session.speedLimit(direction);
  $: ({ value: limit, size: limitSize } = getSize($speedLimit, {
    isSpeed: true,
    startSize: 'kB',
    perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED],
  }));
</script>

<div class="limit" class:hidden>
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
    background-color: var(--color);
    color: #293341;
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

  .limit > :global(.icon) {
    flex-grow: 1;
    fill: currentColor;
    height: 12px;
  }

  .hidden {
    opacity: 0;
  }
</style>
