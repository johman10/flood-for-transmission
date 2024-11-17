<script>
  import Menu from './Menu.svelte';

  /**
   * @typedef {Object} Props
   * @property {string} [activePageId]
   */

  /** @type {Props} */
  let { activePageId = $bindable('torrents') } = $props();

  let torrentsComponent;
  let speedComponent;
  let peersComponent;
  let networkComponent;
  let userInterfaceComponent;
  let aboutComponent;

  // Not taken care of
  // "cache-size-mb"                  | number     | maximum size of the disk cache (MB)
  // "units"                          | object     | see below

  const pages = [
    {
      id: 'torrents',
      component: () =>
        torrentsComponent ||
        import('./Torrents.svelte').then((res) => {
          torrentsComponent = res.default;
          return res.default;
        }),
      name: 'Torrents',
    },
    {
      id: 'speed',
      component: () =>
        speedComponent ||
        import('./Speed.svelte').then((res) => {
          speedComponent = res.default;
          return res.default;
        }),
      name: 'Speed',
    },
    {
      id: 'peers',
      component: () =>
        peersComponent ||
        import('./Peers.svelte').then((res) => {
          peersComponent = res.default;
          return res.default;
        }),
      name: 'Peers',
    },
    {
      id: 'network',
      component: () =>
        networkComponent ||
        import('./Network.svelte').then((res) => {
          networkComponent = res.default;
          return res.default;
        }),
      name: 'Network',
    },
    {
      id: 'user-interface',
      component: () =>
        userInterfaceComponent ||
        import('./UserInterface.svelte').then((res) => {
          userInterfaceComponent = res.default;
          return res.default;
        }),
      name: 'User Interface',
    },
    {
      id: 'about',
      component: () =>
        aboutComponent ||
        import('./About.svelte').then((res) => {
          aboutComponent = res.default;
          return res.default;
        }),
      name: 'About',
    },
  ];
</script>

<div class="wrapper">
  <Menu bind:activePageId={activePageId} pages={pages} />
  <div class="content">
    {#await pages
      .find((page) => page.id === activePageId)
      .component() then component}
      {@const SvelteComponent = component}
      <SvelteComponent />
    {/await}
  </div>
</div>

<style>
  .wrapper {
    display: grid;
    grid-template: 'menu content' 100% / 175px 1fr;
    overflow: hidden;
    height: 100%;
  }

  .content {
    padding: 20px 25px;
    overflow-y: auto;
    flex-grow: 1;
    position: relative;
    grid-area: 'content';
  }

  @media (max-width: 700px) {
    .wrapper {
      grid-template: 'menu' auto 'content' 1fr / 1fr;
    }

    .content {
      padding: 10px 25px;
    }
  }
</style>
