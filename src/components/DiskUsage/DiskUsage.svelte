<script>
  import { paths, diskUsage, session } from '~helpers/stores';
  import Transmission from '~helpers/Transmission';
  import ProgressBar from '../ProgressBar/ProgressBar.svelte';
  import { SESSION_COLUMN_RPC_VERSION } from '~helpers/constants/columns';

  const transmission = new Transmission();

  let data = $derived(
    Promise.all(
      $paths.map((path) => {
        return transmission.getFreeSpace(path).then((result) => {
          return result.arguments;
        });
      })
    ).then((results) => {
      return results.reduce((acc, curr) => {
        acc[curr.path] = getProgress(curr);
        return acc;
      }, {});
    })
  );

  const getProgress = (pathSpace) => {
    const freeSpace = pathSpace?.['size-bytes'];
    const totalSpace = pathSpace?.total_size;
    const usedSpace = totalSpace - freeSpace;
    return Math.round((usedSpace / totalSpace) * 100);
  };
</script>

{#if $diskUsage && $session[SESSION_COLUMN_RPC_VERSION] >= 15}
  {#await data then pathSpaces}
    <div class="wrapper">
      <h2>Disk usage</h2>
      <ul>
        {#each Object.entries(pathSpaces) as [path, progress] (path)}
          <li class="path-item">
            <div class="path-details">
              <span>
                {path}
              </span>
              <span>
                {progress}%
              </span>
            </div>
            <ProgressBar progress={progress} />
          </li>
        {/each}
      </ul>
    </div>
  {/await}
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
    transition:
      fill 0.25s,
      color 0.25s;
    font-size: 13px;
  }

  .path-details {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
</style>
