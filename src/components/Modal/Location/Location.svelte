<script>
  import { preventDefault } from 'svelte/legacy';

  import InputPath from '~components/InputPath';
  import Checkbox from '~components/Checkbox';
  import Button from '~components/Button';
  import Icon from '~components/Icon';
  import {
    modals,
    torrents,
    alerts,
    selectedTorrents,
    session,
  } from '~helpers/stores';
  import { PATH_VALIDATION_REGEX } from '~helpers/constants/paths';
  import { SESSION_COLUMN_DOWNLOAD_DIR } from '~helpers/constants/columns';

  let loadingInitial = $state(true);
  let loadingSubmit = $state(false);
  let location = $state(null);
  let moveData = $state(true);

  session
    .addColumns([SESSION_COLUMN_DOWNLOAD_DIR])
    .then(($session) => {
      location = $session[SESSION_COLUMN_DOWNLOAD_DIR];
    })
    .finally(() => {
      loadingInitial = false;
    });

  const handleLocation = () => {
    if (loadingSubmit) return;

    loadingSubmit = true;
    if (!$selectedTorrents.length) {
      loadingSubmit = false;
      alerts.add('Select at least one torrent to continue', 'negative');
      return;
    }

    torrents
      .setLocation($selectedTorrents, location, moveData)
      .then(() => {
        alerts.add('Succesfully set location');
        modals.close();
      })
      .catch(() => {
        alerts.add('Failed to set location', 'negative');
        loadingSubmit = false;
      });
  };
</script>

<h1>Set torrent location</h1>

<div class="content" class:loading-initial={loadingInitial}>
  <Icon name="SpinnerIcon" />
  <form onsubmit={preventDefault(handleLocation)}>
    <InputPath
      type="text"
      bind:value={location}
      placeholder="Destination"
      label="Torrent location"
      pattern={PATH_VALIDATION_REGEX}
      validationMessage="Destination must be an absolute path."
      required
    />
    <div class="button-group">
      <Checkbox label="Move data" bind:checked={moveData} />
      <Button priority="tertiary" onclick={modals.close}>Cancel</Button>
      <Button priority="primary" loading={loadingSubmit} type="submit">
        Set torrent location
      </Button>
    </div>
  </form>
</div>

<style>
  h1 {
    color: var(--color-modal-header);
    font-size: 20px;
    font-weight: 500;
    padding: 20px 25px 0;
  }

  .content {
    overflow-y: auto;
    padding: 20px 25px 20px 25px;
    color: var(--color-modal-text);
  }

  .content.loading-initial {
    display: flex;
    align-items: center;
    justify-content: center;
    fill: var(--color-modal-loading);
  }

  .content > :global(.icon) {
    position: absolute;
    height: 30px;
    width: 30px;
    display: none;
  }

  .content.loading-initial > :global(.icon) {
    display: inherit;
  }

  .content.loading-initial form {
    visibility: hidden;
  }

  .button-group {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    margin-top: 25px;
    gap: 10px;
  }
</style>
