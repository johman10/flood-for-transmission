<script>
  import Icon from '~components/Icon';
  import {
    STATUS_STOPPED,
    STATUS_DOWNLOADING,
    STATUS_SEEDING,
  } from '~helpers/Transmission';

  const STATUS_ICON_MAP = {
    [STATUS_STOPPED]: 'StopIcon',
    [STATUS_DOWNLOADING]: 'StartIcon',
    [STATUS_SEEDING]: 'StartIcon',
  };

  export let value;
  export let torrentStatus;
  export let torrentStatusClass;
  export let metadataProgress;
  export let checkingProgress;
  export const column = null;

  let progress = 0;
  $: {
    if (!Object.keys(STATUS_ICON_MAP).includes(torrentStatus)) {
      progress = checkingProgress * 100;
    } else if (metadataProgress < 1) {
      progress = metadataProgress * 100;
    } else {
      progress = value * 100;
    }
  }
  $: iconName = STATUS_ICON_MAP[torrentStatus] || 'SpinnerIcon';
</script>

<div class="progress-bar {torrentStatusClass}">
  <Icon name="{iconName}" />
  <div class="fill-wrapper">
    <div class="fill" style="width: {progress}%"></div>
  </div>
</div>

<style>
  .progress-bar {
    --solid-color: #39ce83;
    --transparent-color: rgba(57, 206, 131, 0.15);

    align-items: center;
    display: flex;
    width: 100%;
    z-index: 1;
    fill: var(--solid-color);
  }

  .fill {
    background: var(--solid-color);
    display: block;
    height: 3px;
    width: 100%;
    transition: width 100ms;
  }

  .fill-wrapper {
    background: var(--transparent-color);
    flex: 1 1 auto;
    position: relative;
    height: 3px;
  }

  .progress-bar :global(.icon) {
    flex: 0 0 auto;
    box-sizing: initial;
    margin-right: 5px;
    display: block;
    height: 12px;
    width: 12px;
  }

  .selected {
    --solid-color: #fff;
    --transparent-color: rgba(255, 255, 255, 0.15);
  }

  .stopped {
    --solid-color: #e7ebee;
    --transparent-color: rgba(231, 235, 238, 0.15);
  }

  .selected.stopped {
    --solid-color: #5daaeb;
    --transparent-color: rgba(255, 255, 255, 0.15);
  }

  .completed {
    --solid-color: #258de5;
    --transparent-color: rgba(37, 141, 229, 0.15);
  }

  .selected.completed {
    --solid-color: #fff;
    --transparent-color: rgba(255, 255, 255, 0.15);
  }

  .checking,
  .metadata {
    --solid-color: #8899a8;
    --transparent-color: rgba(136, 153, 168, 0.15);
  }

  .error {
    --solid-color: #f2acbc;
    --transparent-color: rgba(242, 172, 188, 0.15);
  }
</style>
