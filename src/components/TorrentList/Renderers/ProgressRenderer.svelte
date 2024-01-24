<script>
  import Icon from '~components/Icon';
  import {
    STATUS_STOPPED,
    STATUS_DOWNLOADING,
    STATUS_SEEDING,
  } from '~helpers/constants/statuses';
  import ProgressBar from '../../ProgressBar/ProgressBar.svelte';

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

<div class="progress-renderer {torrentStatusClass}">
  <Icon name="{iconName}" />
  <ProgressBar progress="{progress}" />
</div>

<style>
  .progress-renderer {
    --progess-color: var(--color-progress-bar-download);
    --background-color: var(--color-progress-bar-download-background);

    align-items: center;
    display: flex;
    width: 100%;
    z-index: 1;
    fill: var(--progess-color);
  }

  .progress-renderer :global(.icon) {
    flex: 0 0 auto;
    box-sizing: initial;
    margin-right: 5px;
    display: block;
    height: 12px;
    width: 12px;
  }

  /*
  1: unselected downloading - green - default
  2: unselected uploading - blue
  3: unselected stopped - grey
  4: unselected error - red
  5: unselected checking/metadata - dark grey
  6: selected active - white
  7: selected inactive - opacite white
  */

  .completed {
    --progess-color: var(--color-progress-bar-upload);
    --background-color: var(--color-progress-bar-upload-background);
  }

  .stopped {
    --progess-color: var(--color-progress-bar-stopped);
    --background-color: var(--color-progress-bar-stopped-background);
  }

  .error {
    --progess-color: var(--color-progress-bar-error);
    --background-color: var(--color-progress-bar-error-background);
  }

  .checking,
  .metadata {
    --progess-color: var(--color-progress-bar-metadata);
    --background-color: var(--color-progress-bar-metadata-background);
  }

  .selected.active,
  .selected.metadata,
  .selected.checking {
    --progess-color: var(--color-progress-bar-selected-active);
    --background-color: var(--color-progress-bar-selected-active-background);
  }

  .selected.error,
  .selected.stopped {
    --progess-color: var(--color-progress-bar-selected-inactive);
    --background-color: var(--color-progress-bar-selected-inactive-background);
  }
</style>
