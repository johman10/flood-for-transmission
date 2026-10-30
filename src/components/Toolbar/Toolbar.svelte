<script>
  import { onMount } from 'svelte';
  import PanelLeftIcon from '@lucide/svelte/icons/panel-left';
  import PlusIcon from '@lucide/svelte/icons/plus';
  import PlayIcon from '@lucide/svelte/icons/play';
  import PauseIcon from '@lucide/svelte/icons/pause';
  import Trash2Icon from '@lucide/svelte/icons/trash-2';
  import InfoIcon from '@lucide/svelte/icons/info';
  import SearchIcon from '@lucide/svelte/icons/search';
  import XIcon from '@lucide/svelte/icons/x';
  import SettingsIcon from '@lucide/svelte/icons/settings';
  import SunIcon from '@lucide/svelte/icons/sun';
  import MoonIcon from '@lucide/svelte/icons/moon';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import { Kbd } from '$lib/components/ui/kbd/index.js';
  import ToolbarButton from './ToolbarButton.svelte';
  import { Add, Remove, Settings } from '~components/Modal';
  import {
    torrents,
    modals,
    selectedTorrents,
    panel,
    filters,
    darkMode,
    isMobile,
  } from '~helpers/stores';
  import { openTorrentDetails } from '~helpers/torrentDetailHelper';

  const hasSelection = $derived($selectedTorrents.length > 0);

  onMount(() => {
    const url = new URL(window.location.href);
    const magnet = url.searchParams.get('addtorrent');

    if (magnet) {
      modals.open({
        component: Add,
        props: { fileNames: [decodeURIComponent(magnet)] },
      });

      url.searchParams.delete('addtorrent');
      history.replaceState(null, '', url.toString());
    }
  });

  const handleSearchKeydown = (event) => {
    if (event.key === 'Escape') {
      $filters.search = null;
      event.currentTarget.blur();
    }
  };
</script>

<header
  class="flex h-11 shrink-0 items-center gap-1 border-b bg-background px-2"
>
  <ToolbarButton label="Toggle sidebar" onclick={panel.toggle}>
    <PanelLeftIcon />
  </ToolbarButton>
  <Separator orientation="vertical" class="mx-1 h-5!" />

  <Button
    size="sm"
    class="mr-1"
    onclick={() => modals.open({ component: Add })}
  >
    <PlusIcon />
    <span class="max-sm:hidden">Add</span>
  </Button>
  <ToolbarButton
    label="Start"
    disabled={!hasSelection}
    onclick={() => torrents.start($selectedTorrents)}
  >
    <PlayIcon />
  </ToolbarButton>
  <ToolbarButton
    label="Stop"
    disabled={!hasSelection}
    onclick={() => torrents.stop($selectedTorrents)}
  >
    <PauseIcon />
  </ToolbarButton>
  <ToolbarButton
    label="Remove"
    shortcut="Del"
    disabled={!hasSelection}
    onclick={() => modals.open({ component: Remove })}
  >
    <Trash2Icon />
  </ToolbarButton>
  {#if $isMobile}
    <ToolbarButton
      label="Details"
      disabled={!hasSelection}
      onclick={() => openTorrentDetails($selectedTorrents.at(-1))}
    >
      <InfoIcon />
    </ToolbarButton>
  {/if}

  <div class="flex-1 max-md:hidden"></div>

  <label
    class="relative flex h-7 w-64 items-center rounded-md border border-input bg-muted/40 text-sm transition-colors focus-within:border-ring focus-within:bg-background focus-within:ring-3 focus-within:ring-ring/30 max-md:w-auto max-md:min-w-0 max-md:flex-1"
    data-search-torrents
  >
    <SearchIcon
      class="pointer-events-none ml-2 size-3.5 text-muted-foreground"
    />
    <input
      class="h-full min-w-0 flex-1 bg-transparent px-2 outline-none placeholder:text-muted-foreground"
      placeholder="Search torrents"
      bind:value={$filters.search}
      onkeydown={handleSearchKeydown}
    />
    {#if $filters.search}
      <button
        class="mr-1 rounded p-0.5 text-muted-foreground hover:text-foreground"
        aria-label="Clear search"
        onclick={() => ($filters.search = null)}
      >
        <XIcon class="size-3.5" />
      </button>
    {:else}
      <Kbd class="mr-1.5 max-md:hidden">/</Kbd>
    {/if}
  </label>

  {#if !$isMobile}
    <Separator orientation="vertical" class="mx-1 h-5!" />
    <ToolbarButton
      label={$darkMode ? 'Light mode' : 'Dark mode'}
      onclick={() => darkMode.set($darkMode ? 'disabled' : 'enabled')}
    >
      {#if $darkMode}<SunIcon />{:else}<MoonIcon />{/if}
    </ToolbarButton>
  {/if}
  <ToolbarButton
    label="Settings"
    onclick={() => modals.open({ component: Settings, large: true })}
  >
    <SettingsIcon />
  </ToolbarButton>
</header>
