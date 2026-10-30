<script>
  import Graph from '~components/Graph';
  import Filters from '~components/Filters';
  import DiskUsage from '~components/DiskUsage';
  import clickOutside from '~helpers/actions/clickOutside';
  import { panel } from '~helpers/stores';

  const hidePanelOnMobile = () => {
    if (window.outerWidth > 550) return;

    panel.close();
  };
</script>

<div class="panel" use:clickOutside={hidePanelOnMobile}>
  <header
    class="flex h-11 items-center gap-2 border-b px-4 text-sm font-semibold text-sidebar-foreground"
  >
    <img src="images/drought.svg" alt="" class="size-5" />
    Drought
  </header>
  <Graph />
  <Filters />
  <DiskUsage />
</div>

<style>
  .panel {
    flex: 0 0 240px;
    width: 240px;
    border-right: 1px solid var(--color-panel-border);
    background: var(--color-app-background);
    overflow-y: auto;
    height: 100dvh;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .panel::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 550px) {
    .panel {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
    }
  }
</style>
