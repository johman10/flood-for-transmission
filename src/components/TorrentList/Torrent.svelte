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
    [UI_COLUMN.NAME]: {
      component: TextRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.NAME], size: 'big' }),
    },
    [UI_COLUMN.PERCENT_COMPLETE]: {
      component: ProgressRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.DOWNLOAD_PROGRESS],
        metadataProgress: torrent[TRANSMISSION_COLUMN.METADATA_PROGRESS],
        checkingProgress: torrent[TRANSMISSION_COLUMN.RECHECK_PROGRESS],
        torrentStatus: STATUSES[torrent[TRANSMISSION_COLUMN.STATUS]],
      }),
    },
    [UI_COLUMN.DOWNLOADED]: {
      component: SizeRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.DOWNLOADED],
        perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
      }),
    },
    [UI_COLUMN.DOWNLOAD_SPEED]: {
      component: SizeRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.DOWNLOAD_RATE],
        isSpeed: true,
        perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED],
      }),
    },
    [UI_COLUMN.UPLOADED]: {
      component: SizeRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.UPLOADED],
        perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
      }),
    },
    [UI_COLUMN.UPLOAD_SPEED]: {
      component: SizeRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.UPLOAD_RATE],
        isSpeed: true,
        isUpload: true,
        perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED],
      }),
    },
    [UI_COLUMN.ETA]: {
      component: ArrivalRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.ETA] }),
    },
    [UI_COLUMN.RATIO]: {
      component: TextRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.RATIO]?.toFixed(2) }),
    },
    [UI_COLUMN.FILE_SIZE]: {
      component: SizeRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.SIZE],
        perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
      }),
    },
    [UI_COLUMN.ADDED]: {
      component: DateRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.ADDED] }),
    },
    [UI_COLUMN.CREATION_DATE]: {
      component: DateRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.CREATED] }),
    },
    [UI_COLUMN.SEEDS]: {
      component: ConnectionRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.SEEDING_TO],
        connected: torrent[TRANSMISSION_COLUMN.PEERS_CONNECTED],
      }),
    },
    [UI_COLUMN.PEERS]: {
      component: ConnectionRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.DOWNLOADING_FROM],
        connected: torrent[TRANSMISSION_COLUMN.PEERS_CONNECTED],
      }),
    },
    [UI_COLUMN.BASE_PATH]: {
      component: TextRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.DOWNLOAD_DIR] }),
    },
    [UI_COLUMN.HASH]: {
      component: TextRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.HASH] }),
    },
    [UI_COLUMN.COMMENT]: {
      component: TextRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.COMMENT] }),
    },
    [UI_COLUMN.LABELS]: {
      component: LabelRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.LABELS] }),
    },
    [UI_COLUMN.ERROR]: {
      component: TextRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.ERROR_STRING] }),
    },
    [UI_COLUMN.PRIVATE]: {
      component: BooleanRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.PRIVATE] }),
    },
    [UI_COLUMN.TRACKERS]: {
      component: TextRenderer,
      props: () => {
        const value = torrent[TRANSMISSION_COLUMN.TRACKERS]
          .map((tracker) => trackerStripper(tracker.announce))
          .sort()
          .join(', ');
        return { value };
      },
    },
    [UI_COLUMN.DONE]: {
      component: DateRenderer,
      props: () => ({ value: torrent[TRANSMISSION_COLUMN.DONE] }),
    },
    [UI_COLUMN.STATUS]: {
      component: TextRenderer,
      props: () => ({ value: STATUSES[torrent[TRANSMISSION_COLUMN.STATUS]] }),
    },
    [UI_COLUMN.QUEUE_POSITION]: {
      component: TextRenderer,
      props: () => ({
        value: torrent[TRANSMISSION_COLUMN.QUEUE_POSITION],
      }),
    },
  };
</script>

<tr
  class="{generateTorrentStatusClass(torrent, selected)}"
  on:click="{dispatchClick}"
  on:contextmenu="{dispatchContextmenu}"
  on:click="{handleClick}"
>
  {#each $activeColumns
    .map((column) => rendererMap[column.name])
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
