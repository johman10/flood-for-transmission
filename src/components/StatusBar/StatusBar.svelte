<script>
  import TurtleIcon from '@lucide/svelte/icons/turtle';
  import HardDriveIcon from '@lucide/svelte/icons/hard-drive';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import SpeedMenu from './SpeedMenu.svelte';
  import { torrents, selectedTorrents, session } from '~helpers/stores';
  import Transmission from '~helpers/Transmission';
  import { scheduleWhenVisible } from '~helpers/pollHelper';
  import { getSize } from '~helpers/sizeHelper';
  import {
    SESSION_COLUMN_ALT_SPEED_ENABLED,
    SESSION_COLUMN_DOWNLOAD_DIR,
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SIZE,
  } from '~helpers/constants/columns';

  const FREE_SPACE_INTERVAL = 60000;
  const transmission = new Transmission();
  const sortedTorrents = torrents.sorted;
  const totalRate = torrents.totalRate;

  let freeSpace = $state(null);

  const altSpeedEnabled = $derived(
    !!$session[SESSION_COLUMN_ALT_SPEED_ENABLED]
  );
  const perSize = $derived(
    $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE]
  );

  const formatSize = (bytes) => {
    const { value, size } = getSize(bytes, { perSize });
    return `${value} ${size}`;
  };

  $effect(() => {
    let cancel = null;
    const update = async () => {
      try {
        const settings = await transmission.getSession([
          SESSION_COLUMN_DOWNLOAD_DIR,
        ]);
        const path = settings?.[SESSION_COLUMN_DOWNLOAD_DIR];
        if (path) {
          freeSpace = (await transmission.getFreeSpace(path))?.arguments;
        }
      } catch (e) {
        console.error(e);
      }
      cancel = scheduleWhenVisible(update, FREE_SPACE_INTERVAL);
    };
    update();
    return () => cancel?.();
  });
</script>

<footer
  class="flex h-7 shrink-0 items-center gap-2 border-t bg-sidebar px-2 text-xs text-muted-foreground"
>
  <span class="tabular-nums">
    {#if $sortedTorrents.length !== $torrents.length}
      {$sortedTorrents.length} of {$torrents.length} torrents
    {:else}
      {$torrents.length} torrents
    {/if}
    {#if $selectedTorrents.length}
      · <span class="text-foreground">{$selectedTorrents.length} selected</span>
    {/if}
  </span>

  <div class="flex-1"></div>

  {#if freeSpace?.['size-bytes'] >= 0}
    <span
      class="flex items-center gap-1 tabular-nums max-sm:hidden"
      title="Free space in {freeSpace.path}"
    >
      <HardDriveIcon class="size-3.5" />
      {formatSize(freeSpace['size-bytes'])} free
    </span>
    <Separator orientation="vertical" class="h-3.5!" />
  {/if}

  <button
    class="flex h-full items-center gap-1 rounded px-1.5 hover:bg-accent hover:text-accent-foreground {altSpeedEnabled
      ? 'text-primary'
      : ''}"
    title={altSpeedEnabled
      ? 'Alternative speed limits on'
      : 'Alternative speed limits off'}
    aria-pressed={altSpeedEnabled}
    onclick={() => session.toggleAltSpeeds(!altSpeedEnabled)}
  >
    <TurtleIcon class="size-3.5" />
  </button>
  <SpeedMenu direction="download" rate={$totalRate.download} />
  <SpeedMenu direction="upload" rate={$totalRate.upload} />
</footer>
