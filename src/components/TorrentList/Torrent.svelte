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
  import { session, uiColumns, modals } from '~helpers/stores';
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

  const dispatch = createEventDispatcher();

  export let torrent = {};
  export let selected = false;

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
      component: TextRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.NAME], size: 'big' }),
    },
    [UI_COLUMN.PROGRESS_BAR.id]: {
      component: ProgressRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.DOWNLOAD_PROGRESS],
        metadataProgress: torrent[TRANSMISSION_COLUMN.METADATA_PROGRESS],
        checkingProgress: torrent[TRANSMISSION_COLUMN.RECHECK_PROGRESS],
        torrentStatus: STATUSES[torrent[TRANSMISSION_COLUMN.STATUS]],
      }),
    },
    [UI_COLUMN.DOWNLOADED.id]: {
      component: SizeRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.DOWNLOADED],
        perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
      }),
    },
    [UI_COLUMN.DOWNLOAD_SPEED.id]: {
      component: SizeRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.DOWNLOAD_RATE],
        isSpeed: true,
        perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED],
      }),
    },
    [UI_COLUMN.UPLOADED.id]: {
      component: SizeRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.UPLOADED],
        perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
      }),
    },
    [UI_COLUMN.UPLOAD_SPEED.id]: {
      component: SizeRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.UPLOAD_RATE],
        isSpeed: true,
        isUpload: true,
        perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED],
      }),
    },
    [UI_COLUMN.ETA.id]: {
      component: ArrivalRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.ETA] }),
    },
    [UI_COLUMN.RATIO.id]: {
      component: TextRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.RATIO]?.toFixed(2) }),
    },
    [UI_COLUMN.FILE_SIZE.id]: {
      component: SizeRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.SIZE],
        perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
      }),
    },
    [UI_COLUMN.ADDED.id]: {
      component: DateRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.ADDED] }),
    },
    [UI_COLUMN.CREATION_DATE.id]: {
      component: DateRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.CREATED] }),
    },
    [UI_COLUMN.SEEDS.id]: {
      component: ConnectionRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.SEEDING_TO],
        connected: torrent[TRANSMISSION_COLUMN.PEERS_CONNECTED],
      }),
    },
    [UI_COLUMN.PEERS.id]: {
      component: ConnectionRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.DOWNLOADING_FROM],
        connected: torrent[TRANSMISSION_COLUMN.PEERS_CONNECTED],
      }),
    },
    [UI_COLUMN.BASE_PATH.id]: {
      component: TextRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.DOWNLOAD_DIR] }),
    },
    [UI_COLUMN.HASH.id]: {
      component: TextRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.HASH] }),
    },
    [UI_COLUMN.COMMENT.id]: {
      component: TextRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.COMMENT] }),
    },
    [UI_COLUMN.LABELS.id]: {
      component: LabelRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.LABELS] }),
    },
    [UI_COLUMN.ERROR.id]: {
      component: TextRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.ERROR_STRING] }),
    },
    [UI_COLUMN.PRIVATE.id]: {
      component: BooleanRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.PRIVATE] }),
    },
    [UI_COLUMN.TRACKERS.id]: {
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
      component: DateRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.DONE] }),
    },
    [UI_COLUMN.STATUS.id]: {
      component: TextRenderer,
      props: () => ({ value: STATUSES[torrent[TRANSMISSION_COLUMN.STATUS]] }),
    },
    [UI_COLUMN.QUEUE_POSITION.id]: {
      component: TextRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.QUEUE_POSITION],
      }),
    },
    [UI_COLUMN.TOTAL_LEECHERS.id]: {
      component: TextRenderer,
      props: () => {
        const leecherCounts = torrent[TRANSMISSION_COLUMN.TRACKER_STATS].map(
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
      component: TextRenderer,
      props: () => {
        const seederCounts = torrent[TRANSMISSION_COLUMN.TRACKER_STATS].map(
          ({ seederCount }) => seederCount
        );
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
      component: DateRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.ACTIVITY_DATE] }),
    },
    [UI_COLUMN.PERCENT_COMPLETE.id]: {
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
  class="{generateTorrentStatusClass(torrent, selected)}"
  use:contextmenu
  on:contextmenu="{dispatchContextmenu}"
  on:click="{dispatchClick}"
  on:click="{handleClick}"
>
  {#each $activeColumns
    .map((column) => rendererMap[column.id])
    .filter(Boolean) as { component, props }}
    <td>
      <svelte:component
        this="{component}"
        torrentStatusClass="{generateTorrentStatusClass(torrent, selected)}"
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
