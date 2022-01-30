<script>
  import {
    uiColumns,
    selectedTorrents,
    torrents,
    modals,
    contextMenu,
  } from '~helpers/stores';
  import ColumnHeader from '~components/TorrentList/ColumnHeader.svelte';
  import Torrent from '~components/TorrentList/Torrent.svelte';
  import { Torrent as TorrentContextMenu } from '~components/ContextMenu';
  import { Location, Remove, Labels } from '~components/Modal';
  import {
    TRANSMISSION_COLUMN_PRIORITY,
    TRANSMISSION_COLUMN_ID,
  } from '~helpers/constants/columns';

  const sortedTorrents = torrents.sorted;
  const activeColumns = uiColumns.active;
  const { totalSize } = uiColumns;

  let prio = 0;
  $: {
    if ($selectedTorrents.length === 0) {
      prio = 0;
    } else {
      const prios = $selectedTorrents.map((torrentId) => {
        const torrent = $torrents.find((torrent) => torrent.id === torrentId);
        if (!torrent) return;
        return torrent[TRANSMISSION_COLUMN_PRIORITY];
      });
      const uniquePrios = prios.filter((v, i, a) => a.indexOf(v) === i);
      if (uniquePrios.length === 1) {
        prio = uniquePrios[0];
      } else {
        prio = 0;
      }
    }
  }
  // If the prio changes while the contextMenu is open, update the prio in the context menu
  $: contextMenu.updateProps({ prio });

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

  const handleTorrentRightClick = (event) => {
    const torrent = event.detail.torrent;
    if (!$selectedTorrents.includes(torrent.id)) {
      const modifierKey = event.detail.modifierKey;
      handleTorrentClick({ detail: { torrent, modifierKey }, deselect: false });
    }

    contextMenu.open({
      coordinates: {
        y: event.detail.pageY,
        x: event.detail.pageX,
      },
      component: TorrentContextMenu,
      props: {
        prio,
        onStart: torrents.start.bind(this, $selectedTorrents),
        onStartNow: torrents.startNow.bind(this, $selectedTorrents),
        onStop: torrents.stop.bind(this, $selectedTorrents),
        onRemove: modals.open.bind(this, { component: Remove }),
        onVerify: torrents.verify.bind(this, $selectedTorrents),
        onCopyMagnetLink: torrents.copyMagnetLinks.bind(
          this,
          $selectedTorrents
        ),
        onAsk: torrents.reannounce.bind(this, $selectedTorrents),
        onLabels: modals.open.bind(this, { component: Labels }),
        onLocation: modals.open.bind(this, { component: Location }),
        onPrio: changePrio,
      },
    });
  };

  const changePrio = (event) => {
    const newPrio = event.detail;
    torrents.setTorrents($selectedTorrents, {
      [TRANSMISSION_COLUMN_PRIORITY]: newPrio,
    });
    prio = newPrio;
  };
</script>

<div class="wrapper">
  <table class="table" style="width: {$totalSize}px">
    <thead class="table-header">
      {#each $activeColumns as column}
        <ColumnHeader id="{column.id}" />
      {/each}
    </thead>
    <tbody>
      {#each $sortedTorrents as torrent (torrent[TRANSMISSION_COLUMN_ID])}
        <Torrent
          torrent="{torrent}"
          on:click="{handleTorrentClick}"
          on:contextmenu="{handleTorrentRightClick}"
          selected="{$selectedTorrents.includes(torrent.id)}"
        />
      {/each}
    </tbody>
  </table>
</div>

<style>
  .wrapper {
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
