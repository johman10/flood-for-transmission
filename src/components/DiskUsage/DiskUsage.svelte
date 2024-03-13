<script>
  import { onMount } from 'svelte';
  import { paths, diskUsage, session } from '~helpers/stores';
  import Transmission from '~helpers/Transmission';
  import ProgressBar from '../ProgressBar/ProgressBar.svelte';
  import { SESSION_COLUMN_RPC_VERSION } from '~helpers/constants/columns';

  const transmission = new Transmission();

  $: diskSpace = [];
  onMount(() => {
    const promises = $paths.map((local_path) =>
      transmission.getFreeSpace(local_path).then((result) => {
        return result.arguments;
      })
    );

    Promise.all(promises).then((results) => {
      diskSpace = results;
    });
  });

  $: getProgress = (path) => {
    const pathSpace = diskSpace.find((x) => x.path === path);
    const freeSpace = pathSpace?.['size-bytes'];
    const totalSpace = pathSpace?.total_size;
    const usedSpace = totalSpace - freeSpace;
    return Math.round((usedSpace / totalSpace) * 100);
  };
</script>

{#if $diskUsage && $session[SESSION_COLUMN_RPC_VERSION] >= 15}
  <div class="wrapper">
    <h2>Disk usage</h2>
    <ul>
      {#each $paths as path}
        <li class="path-item">
          <div class="path-details">
            <span>
              {path}
            </span>
            <span>
              {getProgress(path)}%
            </span>
          </div>
          <ProgressBar progress="{getProgress(path)}" />
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  .wrapper {
    margin: 30px 20px 0;
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

  .path-item {
    --progess-color: var(--color-progress-bar-stopped);
    --background-color: var(--color-progress-bar-stopped-background);

    font-weight: 400;
    padding: 3px 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    transition: fill 0.25s, color 0.25s;
    font-size: 13px;
  }

  .path-details {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%
  }
</style>
