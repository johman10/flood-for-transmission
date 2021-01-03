<script>
  import { fly } from 'svelte/transition';
  import {
    uiColumns,
    selectedTorrents,
    torrents,
    modals,
  } from '~helpers/stores';
  import { clickOutside } from '~helpers/actions';
  import ColumnHeader from '~components/TorrentList/ColumnHeader.svelte';
  import Torrent from '~components/TorrentList/Torrent.svelte';
  import { TRANSMISSION_COLUMN_PRIORITY } from '~helpers/constants/columns';
  import PriorityIndicator from '~components/PriorityIndicator';

  const sortedTorrents = torrents.sorted;
  const activeColumns = uiColumns.active;
  const { totalSize } = uiColumns;

  let wrapper = null;
  let contextMenu = false;
  let contextMenuStyle = '';
  let contextMenuHeight = 236;
  let contextMenuBottomSpace = 0;
  let priorityIndicator;

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

  const buildActionClick = (callback, ...args) => {
    return () => {
      contextMenu = false;
      callback(...args);
    };
  };

  const handleTorrentRightClick = (event) => {
    const torrent = event.detail.torrent;
    const modifierKey = event.detail.modifierKey;
    if (!$selectedTorrents.includes(torrent.id)) {
      handleTorrentClick({ detail: { torrent, modifierKey }, deselect: false });
    }

    if (!wrapper) return;

    const { x, y } = wrapper.getBoundingClientRect();
    const top = event.detail.pageY - y + +wrapper.scrollTop;
    const left = event.detail.pageX - x + wrapper.scrollLeft;
    contextMenuBottomSpace = wrapper.scrollHeight - top;
    contextMenuStyle = `left: ${left}px; top: ${top}px;`;
    contextMenu = true;
  };

  const clickOnPriorityIndicator = () => {
    priorityIndicator.$capture_state().element.click();
  };

  const changePrio = (event) => {
    const newPrio = event.detail;
    torrents.setTorrents($selectedTorrents, {
      [TRANSMISSION_COLUMN_PRIORITY]: newPrio,
    });
    prio = newPrio;
  };
</script>

<div class="wrapper" bind:this="{wrapper}">
  <table class="table" style="width: {$totalSize}px">
    <thead class="table-header">
      {#each $activeColumns as column}
        <ColumnHeader name="{column.name}" />
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

  {#if contextMenu}
    <ul
      style="{contextMenuStyle}"
      class:is-up="{contextMenuBottomSpace < contextMenuHeight}"
      bind:offsetHeight="{contextMenuHeight}"
      use:clickOutside="{() => {
        contextMenu = false;
      }}"
      transition:fly="{{ duration: 125, y: -20 }}"
    >
      <li on:click="{buildActionClick(torrents.start, $selectedTorrents)}">
        Start
      </li>
      <li on:click="{buildActionClick(torrents.stop, $selectedTorrents)}">
        Stop
      </li>
      <li on:click="{buildActionClick(modals.open, 'remove')}">Remove</li>
      <li on:click="{buildActionClick(torrents.verify, $selectedTorrents)}">
        Verify local data
      </li>
      <li on:click="{buildActionClick(torrents.reannounce, $selectedTorrents)}">
        Ask tracker for more peers
      </li>
      <hr />
      <li on:click="{buildActionClick(modals.open, 'labels')}">Set labels</li>
      <li on:click="{buildActionClick(modals.open, 'location')}">
        Set location
      </li>
      <hr />
      <li on:click="{clickOnPriorityIndicator}">
        Priority
        <PriorityIndicator
          bind:this="{priorityIndicator}"
          value="{prio}"
          on:click="{changePrio}"
        />
      </li>
    </ul>
  {/if}
</div>

<style>
  .wrapper {
    overflow: auto;
    position: relative;
  }

  .table {
    border-spacing: 0;
    table-layout: fixed;
    user-select: none;
  }

  .table-header {
    color: #abbac7;
    font-size: 13px;
    white-space: nowrap;
    z-index: 1;
  }

  ul {
    position: absolute;
    padding: 0;
    margin: 0;
    background-color: white;
    white-space: nowrap;
    padding: 9px 0;
    font-size: 12px;
    border-radius: 4px;
    box-shadow: 0 1px 1px rgba(40, 48, 59, 0.05),
      0 1px 3px 1px rgba(40, 48, 59, 0.1), 0 0 0 1px rgba(40, 48, 59, 0.1);
    color: #53718a;
  }

  li {
    cursor: pointer;
    padding: 5px 15px;
    transition: background-color 250ms, color 250ms;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  li:hover {
    background-color: rgba(233, 238, 242, 0.4);
    color: #3e4e61;
  }

  hr {
    border: 0;
    border-top: solid 1px rgba(41, 51, 65, 0.075);
    margin: 5px 0;
  }

  ul.is-up {
    transform: translateY(-100%);
  }
</style>
