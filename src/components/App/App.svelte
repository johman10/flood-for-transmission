<script>
  import * as Resizable from '$lib/components/ui/resizable/index.js';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import Toolbar from '~components/Toolbar/Toolbar.svelte';
  import StatusBar from '~components/StatusBar/StatusBar.svelte';
  import DetailsPane from '~components/DetailsPane/DetailsPane.svelte';
  import Panel from '~components/Panel';
  import TorrentList from '~components/TorrentList';
  import Modal from '~components/Modal';
  import Alerts from '~components/Alerts';
  import {
    panel,
    darkMode,
    switchSpeedColors,
    isMobile,
    detailsPaneRequest,
  } from '~helpers/stores';

  const DEFAULT_DETAILS_SIZE = 40;

  let detailsPane = $state(null);

  $effect(() => {
    document.documentElement.classList.toggle('dark', $darkMode);
  });

  // Something asked to show details (double-click, Enter), so un-collapse
  $effect(() => {
    if ($detailsPaneRequest && detailsPane?.isCollapsed()) {
      detailsPane.resize(DEFAULT_DETAILS_SIZE);
    }
  });
</script>

<Tooltip.Provider delayDuration={500}>
  <main
    class="flex h-dvh overflow-hidden"
    class:switch-speed-colors={$switchSpeedColors}
  >
    {#if $panel}
      <Panel />
    {/if}
    <div class="flex min-w-0 flex-1 flex-col">
      <Toolbar />
      {#if $isMobile}
        <div class="min-h-0 flex-1"><TorrentList /></div>
      {:else}
        <Resizable.PaneGroup
          direction="vertical"
          autoSaveId="drought-main-split"
          class="min-h-0 flex-1"
        >
          <Resizable.Pane defaultSize={60} minSize={20}>
            <TorrentList />
          </Resizable.Pane>
          <Resizable.Handle />
          <Resizable.Pane
            bind:this={detailsPane}
            defaultSize={DEFAULT_DETAILS_SIZE}
            minSize={15}
            collapsible
            collapsedSize={0}
          >
            <DetailsPane />
          </Resizable.Pane>
        </Resizable.PaneGroup>
      {/if}
      <StatusBar />
    </div>
    <Modal />
    <Alerts />
  </main>
</Tooltip.Provider>
