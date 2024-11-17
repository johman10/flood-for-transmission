<script>
  import { preventDefault } from 'svelte/legacy';

  import Icon from '~components/Icon';
  import Header from '~components/Modal/TorrentDetail/Header';
  import Details from '~components/Modal/TorrentDetail/Details';
  import Files from '~components/Modal/TorrentDetail/Files';
  import Peers from '~components/Modal/TorrentDetail/Peers';
  import Trackers from '~components/Modal/TorrentDetail/Trackers';
  import { torrentDetails } from '~helpers/stores';
  import { onMount, onDestroy } from 'svelte';

  let { torrentId } = $props();

  const pages = [
    {
      name: 'Details',
      component: Details,
    },
    {
      name: 'Files',
      component: Files,
    },
    {
      name: 'Peers',
      component: Peers,
    },
    {
      name: 'Trackers',
      component: Trackers,
    },
  ];
  let page = $state(pages[0]);

  onMount(() => {
    torrentDetails.setTorrentId(torrentId);
  });

  onDestroy(() => {
    torrentDetails.clearTorrentId();
  });

  let loadingInitial = $derived(!Object.keys($torrentDetails).length);
</script>

<div class="container" class:loading-initial={loadingInitial}>
  <Icon name="SpinnerIcon" />
  <Header torrentId={torrentId} />
  <div class="content">
    <nav>
      {#each pages as { name, component }}
        <a
          href="/{name.toLowerCase()}"
          class:active={page.name === name}
          onclick={preventDefault(() => (page = { name, component }))}
        >
          {name}
        </a>
      {/each}
    </nav>
    <div class="page-content">
      <page.component />
    </div>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .container.loading-initial {
    align-items: center;
    justify-content: center;
    fill: var(--color-modal-loading);
    height: 100%;
  }

  .container > :global(.icon) {
    position: absolute;
    height: 30px;
    width: 30px;
    display: none;
  }

  .container.loading-initial > :global(.icon) {
    display: inherit;
  }

  .container.loading-initial > :global(.header) {
    display: none;
  }

  .container.loading-initial > .content {
    display: none;
  }

  .content {
    display: flex;
    height: 100%;
    overflow: hidden;
  }

  nav {
    display: flex;
    flex-shrink: 0;
    flex-grow: 0;
    flex-direction: column;
    padding: 20px 0 0 0;
    flex-basis: 135px;
    box-shadow: inset -1px 0 var(--color-modal-torrent-details-shadow);
  }

  a {
    padding: 5px 10px 5px 25px;
    font-size: 13px;
    line-height: 1.25;
    font-weight: 500;
    color: var(--color-modal-tab-label);
    text-decoration: none;
    border-right: solid 1px transparent;
  }

  a.active {
    border-color: var(--color-modal-tab-label-active);
    color: var(--color-modal-tab-label-active);
    font-weight: 700;
  }

  .page-content {
    flex-shrink: 1;
    flex-grow: 1;
    min-width: 0;
    min-height: 0;
  }

  @media (max-width: 700px) {
    .content {
      flex-direction: column;
    }

    nav {
      flex-direction: row;
      flex-basis: auto;
      padding: 0 20px;
      box-shadow: inset 0 -1px 0 var(--color-modal-torrent-details-shadow);
    }

    a {
      border-right: 0;
      border-bottom: solid 1px transparent;
      padding: 5px;
    }
  }
</style>
