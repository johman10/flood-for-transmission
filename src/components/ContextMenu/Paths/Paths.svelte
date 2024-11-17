<script>
  import { paths, modals, contextMenu } from '~helpers/stores';
  import { Settings } from '~components/Modal';

  let { onPathSelect, onItemClick } = $props();

  function onFallbackClick() {
    modals.open({
      component: Settings,
      large: true,
      props: { activePageId: 'user-interface' },
    });
    contextMenu.close();
  }
</script>

{#if $paths.length}
  {#each $paths as path}
    <li onclick={onItemClick(onPathSelect, [path])}>{path}</li>
  {/each}
{:else}
  <li onclick={onFallbackClick}>
    No common paths configured yet, click here to add some.
  </li>
{/if}
