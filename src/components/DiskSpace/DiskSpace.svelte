<script>
  import { onMount } from 'svelte';
  import { paths } from '~helpers/stores';
  import Transmission from '~helpers/Transmission';
  import { ProgressRenderer } from '~components/TorrentList/Renderers';

  const transmission = new Transmission();

  $: diskSpace = [];
  onMount(() => {
    // TODO: Fetch every 15 minutes?
    paths.init().then((local_paths) => {
      const promises = local_paths.map((local_path) =>
        transmission.getFreeSpace(local_path).then((result) => {
          return result.arguments;
        })
      );

      Promise.all(promises).then((results) => {
        diskSpace = results;
      });
    });
  });

  $: getProgress = (path) => {
    const pathSpace = diskSpace.find((x) => x.path === path);
    const freeSpace = pathSpace?.['size-bytes'];
    const totalSpace = pathSpace?.total_size;
    const usedSpace = totalSpace - freeSpace;
    return usedSpace / totalSpace;
  };
</script>

<!-- TODO: Only render based on configuration -->
{#if $paths.length}
  <div class="wrapper">
    <h2>Disk space</h2>
    <ul>
      {#each $paths as path}
        <li>
          {path}
          <!-- TODO: Create seperate progress bar component -->
          <ProgressRenderer
            value="{getProgress(path)}"
            torrentStatus="Downloading"
          />
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

  li {
    font-weight: 400;
    padding: 3px 0;
    display: flex;
    align-items: center;
    transition: fill 0.25s, color 0.25s;
    font-size: 13px;
  }
</style>
