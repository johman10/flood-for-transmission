<script>
  import PlayIcon from '@lucide/svelte/icons/play';
  import PauseIcon from '@lucide/svelte/icons/pause';
  import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
  import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
  import MousePointerClickIcon from '@lucide/svelte/icons/mouse-pointer-click';
  import LoaderIcon from '@lucide/svelte/icons/loader-circle';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import Details from '~components/Modal/TorrentDetail/Details';
  import Files from '~components/Modal/TorrentDetail/Files';
  import Peers from '~components/Modal/TorrentDetail/Peers';
  import Trackers from '~components/Modal/TorrentDetail/Trackers';
  import ArrivalRenderer from '~components/TorrentList/Renderers/ArrivalRenderer.svelte';
  import {
    torrentDetails,
    torrents,
    selectedTorrents,
    session,
  } from '~helpers/stores';
  import {
    TRANSMISSION_COLUMN,
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SPEED,
  } from '~helpers/constants/columns';
  import {
    STATUSES,
    STATUS_DOWNLOADING,
    STATUS_STOPPED,
  } from '~helpers/constants/statuses';
  import { getSize } from '~helpers/sizeHelper';

  const TABS = [
    { value: 'general', label: 'General', component: Details },
    {
      value: 'files',
      label: 'Files',
      component: Files,
      columns: [TRANSMISSION_COLUMN.FILE_STATS],
    },
    {
      value: 'peers',
      label: 'Peers',
      component: Peers,
      columns: [TRANSMISSION_COLUMN.PEERS],
    },
    { value: 'trackers', label: 'Trackers', component: Trackers },
  ];
  const TAB_STORAGE_KEY = 'details-pane-tab';

  const readStoredTab = () => {
    try {
      const value = window.localStorage.getItem(TAB_STORAGE_KEY);
      return TABS.some((t) => t.value === value) ? value : 'general';
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return 'general';
    }
  };

  let tab = $state(readStoredTab());
  let renaming = $state(false);

  const torrentId = $derived($selectedTorrents.at(-1) ?? 0);
  const torrent = $derived($torrentDetails);
  const loaded = $derived(torrent.loaded && torrent.id === torrentId);
  const status = $derived(STATUSES[torrent[TRANSMISSION_COLUMN.STATUS]]);
  const isStopped = $derived(
    torrent[TRANSMISSION_COLUMN.STATUS] === STATUSES.indexOf(STATUS_STOPPED)
  );
  const progress = $derived(
    Math.floor((torrent[TRANSMISSION_COLUMN.DOWNLOAD_PROGRESS] || 0) * 1000) /
      10
  );

  $effect(() => {
    if (torrentId) {
      torrentDetails.setTorrentId(torrentId);
    } else {
      torrentDetails.clearTorrentId();
    }
  });

  $effect(() => {
    torrentDetails.setExtraColumns(
      TABS.find((t) => t.value === tab)?.columns || []
    );
    try {
      window.localStorage.setItem(TAB_STORAGE_KEY, tab);
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      // Remembering the tab is a nicety, ignore storage errors
    }
  });

  // Stop polling once the pane goes away
  $effect(() => () => torrentDetails.clearTorrentId());

  const formatSpeed = (value) => {
    const { value: amount, size } = getSize(value || 0, {
      isSpeed: true,
      perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED],
    });
    return `${amount} ${size}`;
  };

  const toggleRunning = () => {
    const nextStatus = isStopped ? STATUS_DOWNLOADING : STATUS_STOPPED;
    if (isStopped) {
      torrents.start([torrentId]);
    } else {
      torrents.stop([torrentId]);
    }
    torrentDetails.update((current) => ({
      ...current,
      [TRANSMISSION_COLUMN.STATUS]: STATUSES.indexOf(nextStatus),
    }));
  };

  const rename = (event) => {
    renaming = false;
    const oldName = torrent[TRANSMISSION_COLUMN.NAME];
    const newName = event.currentTarget.value.trim();
    if (!newName || newName === oldName) return;

    torrents.rename([torrentId], oldName, newName);
    torrentDetails.update((current) => ({
      ...current,
      [TRANSMISSION_COLUMN.NAME]: newName,
      [TRANSMISSION_COLUMN.FILES]: current[TRANSMISSION_COLUMN.FILES]?.map(
        (file) => {
          const parts = file.name.split('/');
          parts[0] = newName;
          return { ...file, name: parts.join('/') };
        }
      ),
    }));
  };

  const handleRenameKeydown = (event) => {
    if (event.key === 'Enter') event.currentTarget.blur();
    if (event.key === 'Escape') {
      event.stopPropagation();
      renaming = false;
    }
  };

  const focusOnMount = (node) => {
    node.focus();
    node.select();
  };
</script>

<section class="flex h-full flex-col bg-background">
  {#if !torrentId}
    <div
      class="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground"
    >
      <MousePointerClickIcon class="size-5 opacity-60" />
      Select a torrent to see its details
    </div>
  {:else}
    <Tabs.Root bind:value={tab} class="flex h-full flex-col gap-0">
      <div class="flex shrink-0 items-center gap-3 border-b px-3 py-1.5">
        <div class="flex min-w-0 flex-1 items-center gap-2">
          {#if renaming}
            <input
              class="h-7 min-w-0 flex-1 rounded-md border border-ring bg-background px-2 text-sm font-medium outline-none"
              value={torrent[TRANSMISSION_COLUMN.NAME]}
              onblur={rename}
              onkeydown={handleRenameKeydown}
              use:focusOnMount
            />
          {:else}
            <h2
              class="min-w-0 truncate text-sm font-semibold"
              title="{torrent[TRANSMISSION_COLUMN.NAME] ||
                ''} (double-click to rename)"
              ondblclick={() => loaded && (renaming = true)}
            >
              {torrent[TRANSMISSION_COLUMN.NAME] || ''}
            </h2>
          {/if}
          {#if loaded}
            <Badge variant="secondary" class="shrink-0">{status}</Badge>
          {:else}
            <LoaderIcon class="size-4 animate-spin text-muted-foreground" />
          {/if}
        </div>

        {#if loaded}
          <div
            class="flex shrink-0 items-center gap-3 text-xs text-muted-foreground tabular-nums max-lg:hidden"
          >
            <span class="flex items-center gap-2">
              <span class="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                <span
                  class="block h-full rounded-full bg-primary"
                  style="width: {progress}%"
                ></span>
              </span>
              {progress}%
            </span>
            <span class="flex items-center gap-0.5" title="Download speed">
              <ArrowDownIcon class="size-3 text-(--color-download)" />
              {formatSpeed(torrent[TRANSMISSION_COLUMN.DOWNLOAD_RATE])}
            </span>
            <span class="flex items-center gap-0.5" title="Upload speed">
              <ArrowUpIcon class="size-3 text-(--color-upload)" />
              {formatSpeed(torrent[TRANSMISSION_COLUMN.UPLOAD_RATE])}
            </span>
            <span title="Ratio">
              Ratio {(torrent[TRANSMISSION_COLUMN.RATIO] || 0).toFixed(2)}
            </span>
            <span class="flex items-center gap-1" title="Time remaining">
              ETA <ArrivalRenderer value={torrent[TRANSMISSION_COLUMN.ETA]} />
            </span>
          </div>
          <Button
            variant="outline"
            size="xs"
            onclick={toggleRunning}
            class="shrink-0"
          >
            {#if isStopped}<PlayIcon /> Start{:else}<PauseIcon /> Stop{/if}
          </Button>
        {/if}
      </div>

      <div class="flex shrink-0 items-center border-b px-2">
        <Tabs.List variant="line" class="h-8">
          {#each TABS as { value, label } (value)}
            <Tabs.Trigger value={value} class="px-2.5 text-xs"
              >{label}</Tabs.Trigger
            >
          {/each}
        </Tabs.List>
      </div>

      {#if loaded}
        {#each TABS as { value, component: Component } (value)}
          <Tabs.Content value={value} class="min-h-0 flex-1 overflow-auto">
            <!-- Only the visible tab is mounted, so hidden tabs don't poll or render -->
            {#if tab === value}
              {#key torrentId}
                <Component />
              {/key}
            {/if}
          </Tabs.Content>
        {/each}
      {/if}
    </Tabs.Root>
  {/if}
</section>
