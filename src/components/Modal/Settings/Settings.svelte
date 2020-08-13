<script>
  import Menu from './Menu.svelte';

  let torrentsComponent;
  let speedComponent;
  let peersComponent;
  let networkComponent;
  let userInterfaceComponent;
  let aboutComponent;

  // Not taken care of
  // "cache-size-mb"                  | number     | maximum size of the disk cache (MB)
  // "download-queue-size"            | number     | max number of torrents to download at once (see download-queue-enabled)
  // "download-queue-enabled"         | boolean    | if true, limit how many torrents can be downloaded at once
  // "incomplete-dir"                 | string     | path for incomplete torrents, when enabled
  // "incomplete-dir-enabled"         | boolean    | true means keep torrents in incomplete-dir until done
  // "queue-stalled-enabled"          | boolean    | whether or not to consider idle torrents as stalled
  // "queue-stalled-minutes"          | number     | torrents that are idle for N minuets aren't counted toward seed-queue-size or download-queue-size
  // "script-torrent-done-filename"   | string     | filename of the script to run
  // "script-torrent-done-enabled"    | boolean    | whether or not to call the "done" script
  // "seed-queue-size"                | number     | max number of torrents to uploaded at once (see seed-queue-enabled)
  // "seed-queue-enabled"             | boolean    | if true, limit how many torrents can be uploaded at once
  // "trash-original-torrent-files"   | boolean    | true means the .torrent file of added torrents will be deleted
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

  let activePage = pages[0];
</script>

<div class="wrapper">
  <Menu bind:activePage pages="{pages}" />
  <div class="content">
    {#await activePage.component() then component}
      <svelte:component this="{component}" />
    {/await}
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    overflow: hidden;
    height: 100%;
  }

  .content {
    padding: 20px 25px;
    overflow-y: auto;
    flex-grow: 1;
    position: relative;
  }
</style>
