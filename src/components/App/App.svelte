<script>
  import TopBar from '~components/TopBar';
  import Panel from '~components/Panel';
  import TorrentList from '~components/TorrentList';
  import Modal from '~components/Modal';
  import ContextMenu from '~components/ContextMenu';
  import Alerts from '~components/Alerts';
  import { panel, darkMode, switchSpeedColors } from '~helpers/stores';
</script>

<main
  class:panel={$panel}
  class:dark-mode={$darkMode}
  class:switch-speed-colors={$switchSpeedColors}
>
  <Panel />
  <div class="content">
    <TopBar />
    <TorrentList />
    <Modal />
    <ContextMenu />
    <Alerts />
  </div>
</main>

<style>
  main {
    display: grid;
    grid-template: 'panel content' 1fr / 0 1fr;
  }

  main.panel {
    grid-template: 'panel content' 1fr / 240px 1fr;
  }

  .content {
    grid-area: content;
    display: grid;
    height: 100dvh;
    grid-template:
      'header' auto
      'torrentlist' 1fr / 1fr;
  }

  @media (max-width: 550px) {
    main,
    main.panel {
      grid-template: 'content' 1fr / 100vw;
    }

    main.panel > :global(.panel) {
      position: absolute;
      left: 0;
      top: 0;
      width: 240px;
      z-index: 2;
    }
  }
</style>
