<script>
  import Graph from '~components/Graph';
  import Actions from '~components/Panel/Actions.svelte';
  import Search from '~components/Search';
  import Filters from '~components/Filters';
  import DiskUsage from '~components/DiskUsage';
  import clickOutside from '~helpers/actions/clickOutside';
  import { panel } from '~helpers/stores';

  const hidePanelOnMobile = () => {
    if (window.outerWidth > 550) return;

    panel.close();
  };
</script>

<div class="panel" use:clickOutside="{hidePanelOnMobile}">
  <Actions />
  <Graph />
  <Search />
  <Filters />
  <DiskUsage />
</div>

<style>
  div {
    grid-area: panel;
    background: var(--color-background);
    overflow-y: auto;
    height: 100vh;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  div::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 550px) {
    div {
      border-right: 1px solid var(--color-panel-border);
    }
  }
</style>
