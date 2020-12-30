<script>
  import Icon from '~components/Icon';
  import { torrentDetails, session, torrents } from '~helpers/stores';
  import { STATUSSES } from '~helpers/Transmission';
  import {
    TRANSMISSION_COLUMN,
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SPEED,
    SESSION_COLUMN_UNITS_SIZE,
  } from '~helpers/constants/columns';
  import { getSize } from '~helpers/sizeHelper';
  import ArrivalRenderer from '~components/TorrentList/Renderers/ArrivalRenderer.svelte';
  import PriorityIndicator from '~components/PriorityIndicator/PriorityIndicator.svelte';
  import ProgressRenderer from '~components/TorrentList/Renderers/ProgressRenderer';
  import { generateTorrentStatusClass } from '~helpers/classHelper';

  export let torrentId;

  $: downloadSpeed = getSize(
    $torrentDetails[TRANSMISSION_COLUMN.DOWNLOAD_RATE] || 0,
    {
      isSpeed: true,
      perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED],
    }
  );
  $: uploadSpeed = getSize(
    $torrentDetails[TRANSMISSION_COLUMN.UPLOAD_RATE] || 0,
    {
      isSpeed: true,
      perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED],
    }
  );
  $: downloadSize = getSize(
    $torrentDetails[TRANSMISSION_COLUMN.DOWNLOADED] || 0,
    {
      perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
    }
  );
  $: uploadSize = getSize($torrentDetails[TRANSMISSION_COLUMN.UPLOADED] || 0, {
    perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
  });

  const updatePriority = (event) => {
    const newPrio = event.detail;
    torrents.setTorrents([torrentId], {
      [TRANSMISSION_COLUMN.PRIORITY]: newPrio,
    });
    torrentDetails.update((torrent) => {
      torrent[TRANSMISSION_COLUMN.PRIORITY] = newPrio;
      return torrent;
    });
  };

  const startTorrent = () => {
    if ($torrentDetails[TRANSMISSION_COLUMN.STATUS] > 0) {
      return;
    }

    torrents.start([torrentId]);
    torrentDetails.update((torrent) => {
      torrent[TRANSMISSION_COLUMN.STATUS] = STATUSSES.indexOf('downloading');
      return torrent;
    });
  };

  const stopTorrent = () => {
    if ($torrentDetails[TRANSMISSION_COLUMN.STATUS] === 0) {
      return;
    }

    torrents.stop([torrentId]);
    torrentDetails.update((torrent) => {
      torrent[TRANSMISSION_COLUMN.STATUS] = STATUSSES.indexOf('stopped');
      return torrent;
    });
  };
</script>

<div class="header">
  <h1>{$torrentDetails[TRANSMISSION_COLUMN.NAME]}</h1>
  <div class="subheading">
    <ul>
      <li class:active="{!!downloadSpeed.value}" title="Download speed">
        <Icon name="Download" />
        <span>
          {downloadSpeed.value}<em>{downloadSpeed.size}</em>
          —
          {downloadSize.value}<em>{downloadSize.size}</em>
        </span>
      </li>
      <li class:active="{!!uploadSpeed.value}" class="uploading" title="Upload speed">
        <Icon name="Upload" />
        <span>
          {uploadSpeed.value}<em>{uploadSpeed.size}</em>
          —
          {uploadSize.value}<em>{uploadSize.size}</em>
        </span>
      </li>
      <li title="Ratio">
        <Icon name="RatioIcon" />
        {($torrentDetails[TRANSMISSION_COLUMN.RATIO] || 0).toFixed(2)}
      </li>
      <li title="ETA">
        <Icon name="ETA" />
        <ArrivalRenderer value="{$torrentDetails[TRANSMISSION_COLUMN.ETA]}" />
      </li>
    </ul>

    <ul class="right">
      <li class="button">
        <PriorityIndicator
          value="{$torrentDetails[TRANSMISSION_COLUMN.PRIORITY]}"
          text
          on:click="{updatePriority}"
        />
      </li>
      <li
        class:active="{$torrentDetails[TRANSMISSION_COLUMN.STATUS] > 0}"
        on:click="{startTorrent}"
        class="button"
      >
        <Icon name="StartIcon" />
        Start
      </li>
      <li
        class:active="{$torrentDetails[TRANSMISSION_COLUMN.STATUS] === 0}"
        on:click="{stopTorrent}"
        class="button"
      >
        <Icon name="StopIcon" />
        Stop
      </li>
    </ul>
  </div>
  <ProgressRenderer
    value="{$torrentDetails[TRANSMISSION_COLUMN.DOWNLOAD_PROGRESS]}"
    torrentStatus="{STATUSSES[$torrentDetails[TRANSMISSION_COLUMN.STATUS]]}"
    torrentStatusClass="{generateTorrentStatusClass($torrentDetails)}"
    metadataProgress="{$torrentDetails[TRANSMISSION_COLUMN.METADATA_PROGRESS]}"
    checkingProgress="{$torrentDetails[TRANSMISSION_COLUMN.RECHECK_PROGRESS]}"
  />
</div>

<style>
  .header {
    color: #e6f0ff;
    box-shadow: inset 0 -1px 0 #363e48;
    flex: 0 0 auto;
    overflow: hidden;
    padding: 20px 25px;
    gap: 4px;
    display: flex;
    flex-direction: column;
  }

  h1 {
    font-size: 20px;
    color: #ffffff;
    font-weight: 500;
    line-height: 1.25;
    word-break: break-word;
  }

  .subheading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #7d8d9f;
    fill: rgba(77, 111, 135, 0.5);
  }

  ul {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  li {
    display: flex;
    align-items: center;
    font-size: 13.6px;
  }

  li.active {
    color: #3ea7ff;
    fill: #3ea7ff;
  }

  li.active.uploading {
    color: #39ce83;
    fill: #39ce83;
  }

  li > :global(.icon) {
    min-width: 12px;
    margin-right: 3px;
  }

  em {
    font-size: 11px;
    font-style: normal;
    opacity: 0.8;
  }

  .right {
    justify-content: flex-end;
  }

  li.button {
    cursor: pointer;
  }
</style>
