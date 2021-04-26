<script>
  import { freeSpace } from '~helpers/stores';
  import Icon from '~components/Icon';
  import { getSize } from '~helpers/sizeHelper';

  const configStore = freeSpace.configStore;
</script>

{#if $configStore}
  <div class="wrapper">
    <h2>Available space</h2>
    <ul>
      {#each $freeSpace as pathSpace}
        <li class="item">
          <Icon name="Disk" />
          <span class="path" title="{pathSpace.path}">{pathSpace.path}</span>
          <span>
            {getSize(pathSpace['size-bytes'], {}).value}
            {getSize(pathSpace['size-bytes'], {}).size}
          </span>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  .wrapper {
    margin: 0 20px 0;
    color: var(--color-panel-text);
    fill: currentColor;
  }

  h2 {
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    color: var(--color-panel-header);
  }

  ul {
    list-style: none;
    margin-bottom: 30px;
  }

  li {
    font-weight: 400;
    padding: 3px 0;
    align-items: center;
    font-size: 13px;
    display: flex;
  }

  li > :global(.icon) {
    width: 14px;
    margin-right: 7px;
  }

  .path {
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
