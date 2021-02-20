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
    --progess-color: var(--color-progress-bar-download);
    --background-color: var(--color-progress-bar-download-background);

    align-items: center;
    display: flex;
    width: 100%;
    z-index: 1;
    fill: var(--progess-color);
  }

  .fill {
    background: var(--progess-color);
    display: block;
    height: 3px;
    width: 100%;
    transition: width 100ms;
  }

  .fill-wrapper {
    background: var(--background-color);
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
    --progess-color: var(--color-progress-bar-selected-download);
    --background-color: var(--color-progress-bar-selected-download-background);
  }

  .stopped,
  .completed.stopped {
    --progess-color: var(--color-progress-bar-stopped);
    --background-color: var(--color-progress-bar-stopped-background);
  }

  .selected.stopped {
    --progess-color: var(--color-progress-bar-selected-stopped);
    --background-color: var(--color-progress-bar-selected-stopped-background);
  }

  .completed {
    --progess-color: var(--color-progress-bar-upload);
    --background-color: var(--color-progress-bar-upload-background);
  }

  .selected.completed {
    --progess-color: var(--color-progress-bar-selected-completed);
    --background-color: var(--color-progress-bar-selected-completed-background);
  }

  .checking,
  .metadata {
    --progess-color: var(--color-progress-bar-metadata);
    --background-color: var(--color-progress-bar-metadata-background);
  }

  .error {
    --progess-color: var(--color-progress-bar-error);
    --background-color: var(--color-progress-bar-error-background);
  }
</style>
