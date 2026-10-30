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
    padding: 4px 16px 16px;
    color: var(--sidebar-foreground);
  }

  h2 {
    margin: 12px 0 6px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--muted-foreground);
  }

  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .path-item {
    --progess-color: var(--primary);
    --background-color: color-mix(in oklch, var(--primary) 18%, transparent);

    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
  }

  .path-details {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
  }

  .path-details span:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .path-details span:last-child {
    color: var(--muted-foreground);
    font-variant-numeric: tabular-nums;
  }
</style>
