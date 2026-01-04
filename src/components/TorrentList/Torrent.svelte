<script>
  import { createEventDispatcher } from 'svelte';
  import {
    TextRenderer,
    ProgressRenderer,
    DateRenderer,
    SizeRenderer,
    ConnectionRenderer,
    ArrivalRenderer,
    BooleanRenderer,
    LabelRenderer,
  } from '~components/TorrentList/Renderers';
  import { TorrentDetail } from '~components/Modal';
  import { session, uiColumns, modals, mobileView } from '~helpers/stores';
  import { STATUSES } from '~helpers/constants/statuses';
  import {
    UI_COLUMN,
    TRANSMISSION_COLUMN,
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SIZE,
    SESSION_COLUMN_UNITS_SPEED,
  } from '~helpers/constants/columns';
  import { generateTorrentStatusClass } from '~helpers/classHelper';
  import { trackerStripper } from '~helpers/trackerHelper';
  import { contextmenu } from '~helpers/actions';
  import { MediaQuery } from 'svelte/reactivity';

  const dispatch = createEventDispatcher();

  export let torrent = {};
  export let selected = false;

  const isSmallScreen = new MediaQuery('max-width: 600px');

  const activeColumns = uiColumns.active;

  const getModifierKey = (event) => {
    if (event.shiftKey) {
      return 'shift';
    }

    if (event.ctrlKey) {
      return 'ctrl';
    }
  };

  const dispatchClick = (event) => {
    dispatch('click', { torrent, modifierKey: getModifierKey(event) });
  };

  const dispatchContextmenu = (event) => {
    event.preventDefault();
    dispatch('contextmenu', {
      torrent,
      pageX: event.pageX,
      pageY: event.pageY,
      element: event.target,
      modifierKey: getModifierKey(event),
    });
  };

  let lastClick = 0;
  const handleClick = () => {
    const currentTime = new Date().getTime();
    const clickLength = currentTime - lastClick;
    if (clickLength > 0 && clickLength < 500) {
      modals.open({
        component: TorrentDetail,
        large: true,
        props: { torrentId: torrent.id },
      });
    }
    lastClick = currentTime;
  };

  // TODO: Move to constants/columns, pass torrent and session as arg to props;
  $: rendererMap = {
    [UI_COLUMN.NAME.id]: {
      id: UI_COLUMN.NAME.id,
      classname: UI_COLUMN.NAME.class,
      component: TextRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.NAME], size: 'big' }),
    },
    [UI_COLUMN.PROGRESS_BAR.id]: {
      id: UI_COLUMN.PROGRESS_BAR.id,
      classname: UI_COLUMN.PROGRESS_BAR.class,
      component: ProgressRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.DOWNLOAD_PROGRESS],
        metadataProgress: torrent[TRANSMISSION_COLUMN.METADATA_PROGRESS],
        checkingProgress: torrent[TRANSMISSION_COLUMN.RECHECK_PROGRESS],
        torrentStatus: STATUSES[torrent[TRANSMISSION_COLUMN.STATUS]],
      }),
    },
    [UI_COLUMN.DOWNLOADED.id]: {
      id: UI_COLUMN.DOWNLOADED.id,
      classname: UI_COLUMN.DOWNLOADED.class,
      component: SizeRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.DOWNLOADED],
        perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
      }),
    },
    [UI_COLUMN.DOWNLOAD_SPEED.id]: {
      id: UI_COLUMN.DOWNLOAD_SPEED.id,
      classname: UI_COLUMN.DOWNLOAD_SPEED.class,
      component: SizeRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.DOWNLOAD_RATE],
        isSpeed: true,
        perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED],
      }),
    },
    [UI_COLUMN.UPLOADED.id]: {
      id: UI_COLUMN.UPLOADED.id,
      classname: UI_COLUMN.UPLOADED.class,
      component: SizeRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.UPLOADED],
        perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
      }),
    },
    [UI_COLUMN.UPLOAD_SPEED.id]: {
      id: UI_COLUMN.UPLOAD_SPEED.id,
      classname: UI_COLUMN.UPLOAD_SPEED.class,
      component: SizeRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.UPLOAD_RATE],
        isSpeed: true,
        isUpload: true,
        perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED],
      }),
    },
    [UI_COLUMN.ETA.id]: {
      id: UI_COLUMN.ETA.id,
      classname: UI_COLUMN.ETA.class,
      component: ArrivalRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.ETA] }),
    },
    [UI_COLUMN.RATIO.id]: {
      id: UI_COLUMN.RATIO.id,
      classname: UI_COLUMN.RATIO.class,
      component: TextRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.RATIO]?.toFixed(2) }),
    },
    [UI_COLUMN.FILE_SIZE.id]: {
      id: UI_COLUMN.FILE_SIZE.id,
      classname: UI_COLUMN.FILE_SIZE.class,
      component: SizeRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.SIZE],
        perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
      }),
    },
    [UI_COLUMN.ADDED.id]: {
      id: UI_COLUMN.ADDED.id,
      classname: UI_COLUMN.ADDED.class,
      component: DateRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.ADDED] }),
    },
    [UI_COLUMN.CREATION_DATE.id]: {
      id: UI_COLUMN.CREATION_DATE.id,
      classname: UI_COLUMN.CREATION_DATE.class,
      component: DateRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.CREATED] }),
    },
    [UI_COLUMN.SEEDS.id]: {
      id: UI_COLUMN.SEEDS.id,
      classname: UI_COLUMN.SEEDS.class,
      component: ConnectionRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.SEEDING_TO],
        connected: torrent[TRANSMISSION_COLUMN.PEERS_CONNECTED],
      }),
    },
    [UI_COLUMN.PEERS.id]: {
      id: UI_COLUMN.PEERS.id,
      classname: UI_COLUMN.PEERS.class,
      component: ConnectionRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.DOWNLOADING_FROM],
        connected: torrent[TRANSMISSION_COLUMN.PEERS_CONNECTED],
      }),
    },
    [UI_COLUMN.BASE_PATH.id]: {
      id: UI_COLUMN.BASE_PATH.id,
      classname: UI_COLUMN.BASE_PATH.class,
      component: TextRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.DOWNLOAD_DIR] }),
    },
    [UI_COLUMN.HASH.id]: {
      id: UI_COLUMN.HASH.id,
      classname: UI_COLUMN.HASH.class,
      component: TextRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.HASH] }),
    },
    [UI_COLUMN.COMMENT.id]: {
      id: UI_COLUMN.COMMENT.id,
      classname: UI_COLUMN.COMMENT.class,
      component: TextRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.COMMENT] }),
    },
    [UI_COLUMN.LABELS.id]: {
      id: UI_COLUMN.LABELS.id,
      classname: UI_COLUMN.LABELS.class,
      component: LabelRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.LABELS] }),
    },
    [UI_COLUMN.ERROR.id]: {
      id: UI_COLUMN.ERROR.id,
      classname: UI_COLUMN.ERROR.class,
      component: TextRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.ERROR_STRING] }),
    },
    [UI_COLUMN.PRIVATE.id]: {
      id: UI_COLUMN.PRIVATE.id,
      classname: UI_COLUMN.PRIVATE.class,
      component: BooleanRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.PRIVATE] }),
    },
    [UI_COLUMN.TRACKERS.id]: {
      id: UI_COLUMN.TRACKERS.id,
      classname: UI_COLUMN.TRACKERS.class,
      component: TextRenderer,
      props: () => {
        const value = torrent[TRANSMISSION_COLUMN.TRACKERS]
          .map((tracker) => trackerStripper(tracker.announce))
          .sort()
          .join(', ');
        return { value };
      },
    },
    [UI_COLUMN.DONE.id]: {
      id: UI_COLUMN.DONE.id,
      classname: UI_COLUMN.DONE.class,
      component: DateRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.DONE] }),
    },
    [UI_COLUMN.STATUS.id]: {
      id: UI_COLUMN.STATUS.id,
      classname: UI_COLUMN.STATUS.class,
      component: TextRenderer,
      props: () => ({ value: STATUSES[torrent[TRANSMISSION_COLUMN.STATUS]] }),
    },
    [UI_COLUMN.QUEUE_POSITION.id]: {
      id: UI_COLUMN.QUEUE_POSITION.id,
      classname: UI_COLUMN.QUEUE_POSITION.class,
      component: TextRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.QUEUE_POSITION],
      }),
    },
    [UI_COLUMN.TOTAL_LEECHERS.id]: {
      id: UI_COLUMN.TOTAL_LEECHERS.id,
      classname: UI_COLUMN.TOTAL_LEECHERS.class,
      component: TextRenderer,
      props: () => {
        const trackerStats = torrent[TRANSMISSION_COLUMN.TRACKER_STATS] || [];
        const leecherCounts = trackerStats.map(
          ({ leecherCount }) => leecherCount
        );
        const filteredLeecherCounts = leecherCounts.filter(
          (count) => count !== -1
        );
        const value = filteredLeecherCounts.length
          ? Math.max(...filteredLeecherCounts)
          : '-';

        return { value };
      },
    },
    [UI_COLUMN.TOTAL_SEEDERS.id]: {
      id: UI_COLUMN.TOTAL_SEEDERS.id,
      classname: UI_COLUMN.TOTAL_SEEDERS.class,
      component: TextRenderer,
      props: () => {
        const trackerStats = torrent[TRANSMISSION_COLUMN.TRACKER_STATS] || [];
        const seederCounts = trackerStats.map(({ seederCount }) => seederCount);
        const filteredSeederCounts = seederCounts.filter(
          (count) => count !== -1
        );
        const value = filteredSeederCounts.length
          ? Math.max(...filteredSeederCounts)
          : '-';

        return { value };
      },
    },
    [UI_COLUMN.ACTIVITY.id]: {
      id: UI_COLUMN.ACTIVITY.id,
      classname: UI_COLUMN.ACTIVITY.class,
      component: DateRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.ACTIVITY_DATE] }),
    },
    [UI_COLUMN.PERCENT_COMPLETE.id]: {
      id: UI_COLUMN.PERCENT_COMPLETE.id,
      classname: UI_COLUMN.PERCENT_COMPLETE.class,
      component: TextRenderer,
      props: () => {
        let number = torrent[TRANSMISSION_COLUMN.DOWNLOAD_PROGRESS];

        if (
          torrent[TRANSMISSION_COLUMN.RECHECK_PROGRESS] > 0 &&
          torrent[TRANSMISSION_COLUMN.RECHECK_PROGRESS] < 1
        ) {
          number = torrent[TRANSMISSION_COLUMN.RECHECK_PROGRESS];
        }

        if (
          torrent[TRANSMISSION_COLUMN.METADATA_PROGRESS] > 0 &&
          torrent[TRANSMISSION_COLUMN.METADATA_PROGRESS] < 1
        ) {
          number = torrent[TRANSMISSION_COLUMN.METADATA_PROGRESS];
        }

        return { value: `${Math.round(number * 10_000) / 100}%` };
      },
    },
  };
</script>

<tr
  class={generateTorrentStatusClass(torrent, selected)}
  class:mobile-grid-view={$mobileView.grid && isSmallScreen.current}
  use:contextmenu
  on:contextmenu={dispatchContextmenu}
  on:click={dispatchClick}
  on:click={handleClick}
>
  {#each $activeColumns
    .map((column) => rendererMap[column.id])
    .filter(Boolean) as { id, classname, component, props } (id)}
    <td
      class={`${classname} grid-span-${$uiColumns.find((x) => x.id === id).gridColSpan ?? 1}`}
    >
      <svelte:component
        this={component}
        torrentStatusClass={generateTorrentStatusClass(torrent, selected)}
        {...props()}
      />
    </td>
  {/each}
</tr>

<style>
  tr {
    color: var(--color-torrent-text);
    font-size: 13px;
    height: 30px;
    cursor: pointer;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }

  @media (max-width: 600px) {
    .mobile-grid-view {
      display: grid;
      width: 100vw;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 2px;
      height: auto;
      border-bottom: 3px solid var(--color-column-header-border);
      padding-block: 3px;

      & td {
        padding-block: 2px;
      }
    }

    .grid-span-2 {
      grid-column-end: span 2;
    }

    .grid-span-3 {
      grid-column-end: span 3;
    }

    .name.grid-span-3 {
      grid-row: 1;
    }
  }

  tr.stopped,
  tr.error {
    color: var(--color-torrent-text-inactive);
  }

  tr.selected {
    background-color: var(--color-torrent-background-selected);
    color: var(--color-torrent-text-selected);
  }

  tr.selected.error {
    background-color: var(--color-torrent-background-selected-error);
  }

  td {
    padding: 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
