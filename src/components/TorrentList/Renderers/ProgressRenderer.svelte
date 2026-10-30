<script>
  import PlayIcon from '@lucide/svelte/icons/play';
  import SquareIcon from '@lucide/svelte/icons/square';
  import LoaderIcon from '@lucide/svelte/icons/loader-circle';
  import {
    STATUS_STOPPED,
    STATUS_DOWNLOADING,
    STATUS_SEEDING,
  } from '~helpers/constants/statuses';
  import ProgressBar from '../../ProgressBar/ProgressBar.svelte';

  const STATUS_ICON_MAP = {
    [STATUS_STOPPED]: SquareIcon,
    [STATUS_DOWNLOADING]: PlayIcon,
    [STATUS_SEEDING]: PlayIcon,
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
  // Checking and other transitional states get a spinner
  $: statusIcon = STATUS_ICON_MAP[torrentStatus] || LoaderIcon;
</script>

<div class="progress-renderer {torrentStatusClass}">
  <svelte:component
    this={statusIcon}
    class="icon {statusIcon === LoaderIcon ? 'animate-spin' : ''}"
    fill={statusIcon === LoaderIcon ? 'none' : 'currentColor'}
    strokeWidth={statusIcon === LoaderIcon ? 2.5 : 0}
  />
  <ProgressBar progress={progress} />
</div>

<style>
  .progress-renderer {
    --progess-color: var(--color-progress-bar-download);
    --background-color: var(--color-progress-bar-download-background);

    align-items: center;
    display: flex;
    width: 100%;
    z-index: 1;
    color: var(--progess-color);
  }

  .progress-renderer :global(.icon) {
    flex: 0 0 auto;
    box-sizing: initial;
    margin-right: 6px;
    display: block;
    height: 10px;
    width: 10px;
  }

  /*
  1: unselected downloading - green - default
  2: unselected uploading - blue
  3: unselected stopped - grey
  4: unselected error - red
  5: unselected checking/metadata - dark grey
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
</style>
