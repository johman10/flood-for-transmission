<script>
  import {
    uiColumns,
    selectedTorrents,
    torrents,
    modals,
  } from '~helpers/stores';
  import ColumnHeader from '~components/TorrentList/ColumnHeader.svelte';
  import Torrent from '~components/TorrentList/Torrent.svelte';
  import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
  import TorrentContextMenu from './TorrentContextMenu.svelte';
  import { Remove } from '~components/Modal';
  import { openTorrentDetails } from '~helpers/torrentDetailHelper';
  import { TRANSMISSION_COLUMN_ID } from '~helpers/constants/columns';
  import TorrentDropzone from './TorrentDropzone.svelte';

  const sortedTorrents = torrents.sorted;
  const activeColumns = uiColumns.active;
  const { totalSize } = uiColumns;

  $: selectedIds = new Set($selectedTorrents);

  const handleTorrentClick = ({
    detail: { torrent, modifierKey },
    deselect = true,
  }) => {
    if (modifierKey === 'shift') {
      // Unselect all text to prevent long selection because of shift click
      document.getSelection().removeAllRanges();
    }

    if (deselect && $selectedTorrents.includes(torrent.id)) {
      if (!modifierKey && $selectedTorrents.length === 1) {
        selectedTorrents.clear();
      } else if (!modifierKey) {
        selectedTorrents.set([torrent.id]);
      } else if (modifierKey === 'ctrl') {
        selectedTorrents.remove(torrent.id);
      }
      return;
    }

    if (
      !modifierKey ||
      (modifierKey === 'shift' && !$selectedTorrents.length)
    ) {
      selectedTorrents.set([torrent.id]);
    } else if (modifierKey === 'ctrl') {
      selectedTorrents.add([torrent.id]);
    } else if (modifierKey === 'shift') {
      const selectedIndex = $sortedTorrents.findIndex(
        (t) => t.id === $selectedTorrents.slice(-1)[0]
      );
      const clickedIndex = $sortedTorrents.findIndex(
        (t) => t.id === torrent.id
      );
      const startIndex = Math.min(selectedIndex, clickedIndex);
      const endIndex = Math.max(selectedIndex, clickedIndex);
      const addTorrents = $sortedTorrents
        .slice(startIndex, endIndex + 1)
        .map((t) => t.id);
      selectedTorrents.add(addTorrents);
    }
  };

  let menuOpen = false;
  let pressed = null;

  // Remember which row a right-click or long-press started on, so the menu
  // acts on it even when it wasn't selected yet.
  const rememberPressedRow = (event) => {
    const row = event.target.closest('tr[data-torrent-id]');
    pressed = row
      ? {
          id: Number(row.dataset.torrentId),
          modifierKey: event.shiftKey ? 'shift' : event.ctrlKey ? 'ctrl' : null,
        }
      : null;
  };

  const handleMenuOpenChange = (open) => {
    if (!open) return;
    if (pressed && !$selectedTorrents.includes(pressed.id)) {
      handleTorrentClick({
        detail: {
          torrent: { id: pressed.id },
          modifierKey: pressed.modifierKey,
        },
        deselect: false,
      });
    }
    if (!$selectedTorrents.length) menuOpen = false;
  };

  let tbody;

  // Moves the selection up or down the list, extending it while shift is held
  const moveSelection = (offset, extend) => {
    if (!$sortedTorrents.length) return;
    const currentIndex = $sortedTorrents.findIndex(
      (t) => t.id === $selectedTorrents.at(-1)
    );
    let index = currentIndex === -1 ? 0 : currentIndex + offset;
    index = Math.max(0, Math.min($sortedTorrents.length - 1, index));
    const torrentId = $sortedTorrents[index].id;

    if (extend) {
      selectedTorrents.update((ids) => [
        ...ids.filter((id) => id !== torrentId),
        torrentId,
      ]);
    } else {
      selectedTorrents.set([torrentId]);
    }
    tbody?.children[index]?.scrollIntoView({ block: 'nearest' });
  };

  const focusSearch = () => {
    document.querySelector('[data-search-torrents] input')?.focus();
  };

  const handleKeydown = (event) => {
    const target = document.activeElement;
    // Keys meant for an open menu, dialog or form field aren't list shortcuts
    if (
      event.defaultPrevented ||
      target?.closest('[role="menu"], [role="dialog"]') ||
      $modals ||
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName) ||
      target?.isContentEditable
    ) {
      return;
    }

    const hasSelection = $selectedTorrents.length > 0;

    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault();
      selectedTorrents.set($sortedTorrents.map((t) => t.id));
    } else if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveSelection(event.key === 'ArrowDown' ? 1 : -1, event.shiftKey);
    } else if (
      event.key === 'Enter' &&
      hasSelection &&
      target?.tagName !== 'BUTTON'
    ) {
      event.preventDefault();
      openTorrentDetails($selectedTorrents.at(-1));
    } else if (
      (event.key === 'Delete' || event.key === 'Backspace') &&
      hasSelection
    ) {
      event.preventDefault();
      modals.open({ component: Remove });
    } else if (event.key === 'Escape' && hasSelection) {
      selectedTorrents.clear();
    } else if (event.key === '/') {
      event.preventDefault();
      focusSearch();
    }
  };
</script>

<svelte:window on:keydown={handleKeydown} />

<ContextMenu.Root bind:open={menuOpen} onOpenChange={handleMenuOpenChange}>
  <ContextMenu.Trigger class="block h-full">
    <div class="wrapper" on:pointerdown|capture={rememberPressedRow}>
      <table class="table" style="width: {$totalSize}px">
        <thead class="table-header">
          {#each $activeColumns as column (column.id)}
            <ColumnHeader id={column.id} />
          {/each}
        </thead>
        <tbody bind:this={tbody}>
          {#each $sortedTorrents as torrent (torrent[TRANSMISSION_COLUMN_ID])}
            <Torrent
              torrent={torrent}
              on:click={handleTorrentClick}
              selected={selectedIds.has(torrent.id)}
            />
          {/each}
        </tbody>
      </table>
      {#if !$modals}
        <TorrentDropzone />
      {/if}
    </div>
  </ContextMenu.Trigger>
  <TorrentContextMenu />
</ContextMenu.Root>

<style>
  .wrapper {
    height: 100%;
    overflow: auto;
    position: relative;
    background-color: var(--color-torrent-list-background);
  }

  .table {
    border-spacing: 0;
    table-layout: fixed;
    user-select: none;
  }
</style>
