<script>
  import Header from '~components/Header';
  import Panel from '~components/Panel';
  import TorrentList from '~components/TorrentList';
  import Modal from '~components/Modal';
  import Alerts from '~components/Alerts';
  import { panel } from '~helpers/stores';
</script>

<main class:panel={$panel}>
  <Panel />
  <div class="content">
    <Header />
    <TorrentList />
    <Modal />
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
    height: 100vh;
    grid-template:
      'header' auto
      'torrentlist' 1fr / 1fr;
  }
</style>
