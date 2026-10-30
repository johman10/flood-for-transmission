<script>
  import FilesIcon from '@lucide/svelte/icons/files';
  import GaugeIcon from '@lucide/svelte/icons/gauge';
  import UsersIcon from '@lucide/svelte/icons/users';
  import NetworkIcon from '@lucide/svelte/icons/network';
  import PaletteIcon from '@lucide/svelte/icons/palette';
  import InfoIcon from '@lucide/svelte/icons/info';

  export let activePageId;
  export let pages;

  const ICONS = {
    'torrents': FilesIcon,
    'speed': GaugeIcon,
    'peers': UsersIcon,
    'network': NetworkIcon,
    'user-interface': PaletteIcon,
    'about': InfoIcon,
  };
</script>

<nav
  class="menu flex flex-col gap-3 border-r bg-sidebar p-3 max-md:border-r-0 max-md:border-b"
>
  <h1 class="px-2 pt-1 text-base font-semibold">Settings</h1>
  <ul class="flex flex-col gap-0.5 max-md:flex-row max-md:flex-wrap">
    {#each pages as page (page.id)}
      <li>
        <button
          class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground {page.id ===
          activePageId
            ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
            : ''}"
          aria-current={page.id === activePageId ? 'page' : undefined}
          on:click={() => (activePageId = page.id)}
        >
          <svelte:component
            this={ICONS[page.id]}
            class="size-4 shrink-0 {page.id === activePageId
              ? 'text-primary'
              : 'text-muted-foreground'}"
          />
          {page.name}
        </button>
      </li>
    {/each}
  </ul>
</nav>
