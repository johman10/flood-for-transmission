<script>
  import PlayIcon from '@lucide/svelte/icons/play';
  import ZapIcon from '@lucide/svelte/icons/zap';
  import PauseIcon from '@lucide/svelte/icons/pause';
  import InfoIcon from '@lucide/svelte/icons/info';
  import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';
  import RadioTowerIcon from '@lucide/svelte/icons/radio-tower';
  import LinkIcon from '@lucide/svelte/icons/link';
  import TagIcon from '@lucide/svelte/icons/tag';
  import FolderInputIcon from '@lucide/svelte/icons/folder-input';
  import GaugeIcon from '@lucide/svelte/icons/gauge';
  import Trash2Icon from '@lucide/svelte/icons/trash-2';
  import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
  import { Location, Remove, Labels } from '~components/Modal';
  import { torrents, modals, selectedTorrents } from '~helpers/stores';
  import { openTorrentDetails } from '~helpers/torrentDetailHelper';
  import { TRANSMISSION_COLUMN_PRIORITY } from '~helpers/constants/columns';

  const PRIORITIES = [
    { value: '1', label: 'High' },
    { value: '0', label: 'Normal' },
    { value: '-1', label: 'Low' },
  ];

  const ids = $derived($selectedTorrents);
  const count = $derived(ids.length);

  // Shared priority of the selection, or nothing when it's mixed
  const priority = $derived.by(() => {
    const selected = new Set(ids);
    const priorities = new Set(
      $torrents
        .filter((torrent) => selected.has(torrent.id))
        .map((torrent) => torrent[TRANSMISSION_COLUMN_PRIORITY])
    );
    return priorities.size === 1 ? String([...priorities][0]) : undefined;
  });

  const setPriority = (value) => {
    torrents.setTorrents(ids, {
      [TRANSMISSION_COLUMN_PRIORITY]: Number(value),
    });
  };
</script>

<ContextMenu.Content class="w-56">
  <ContextMenu.Label class="truncate text-xs text-muted-foreground">
    {count === 1 ? '1 torrent' : `${count} torrents`}
  </ContextMenu.Label>
  {#if count === 1}
    <ContextMenu.Item onSelect={() => openTorrentDetails(ids[0])}>
      <InfoIcon /> Show details
      <ContextMenu.Shortcut>↵</ContextMenu.Shortcut>
    </ContextMenu.Item>
  {/if}
  <ContextMenu.Separator />
  <ContextMenu.Item onSelect={() => torrents.start(ids)}>
    <PlayIcon /> Start
  </ContextMenu.Item>
  <ContextMenu.Item onSelect={() => torrents.startNow(ids)}>
    <ZapIcon /> Start now
  </ContextMenu.Item>
  <ContextMenu.Item onSelect={() => torrents.stop(ids)}>
    <PauseIcon /> Stop
  </ContextMenu.Item>
  <ContextMenu.Separator />
  <ContextMenu.Item onSelect={() => torrents.verify(ids)}>
    <ShieldCheckIcon /> Verify local data
  </ContextMenu.Item>
  <ContextMenu.Item onSelect={() => torrents.reannounce(ids)}>
    <RadioTowerIcon /> Ask trackers for more peers
  </ContextMenu.Item>
  <ContextMenu.Item onSelect={() => torrents.copyMagnetLinks(ids)}>
    <LinkIcon /> Copy magnet {count === 1 ? 'link' : 'links'}
  </ContextMenu.Item>
  <ContextMenu.Separator />
  <ContextMenu.Item onSelect={() => modals.open({ component: Labels })}>
    <TagIcon /> Set labels…
  </ContextMenu.Item>
  <ContextMenu.Item onSelect={() => modals.open({ component: Location })}>
    <FolderInputIcon /> Set location…
  </ContextMenu.Item>
  <ContextMenu.Sub>
    <ContextMenu.SubTrigger>
      <GaugeIcon /> Priority
    </ContextMenu.SubTrigger>
    <ContextMenu.SubContent class="w-36">
      <ContextMenu.RadioGroup value={priority} onValueChange={setPriority}>
        {#each PRIORITIES as { value, label } (value)}
          <ContextMenu.RadioItem value={value}>{label}</ContextMenu.RadioItem>
        {/each}
      </ContextMenu.RadioGroup>
    </ContextMenu.SubContent>
  </ContextMenu.Sub>
  <ContextMenu.Separator />
  <ContextMenu.Item
    variant="destructive"
    onSelect={() => modals.open({ component: Remove })}
  >
    <Trash2Icon /> Remove…
    <ContextMenu.Shortcut>Del</ContextMenu.Shortcut>
  </ContextMenu.Item>
</ContextMenu.Content>
