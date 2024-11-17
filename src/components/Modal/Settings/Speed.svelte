<script>
  import { preventDefault } from 'svelte/legacy';

  import Header from './Header.svelte';
  import Checkbox from '~components/Checkbox';
  import Input from '~components/Input';
  import Button from '~components/Button';
  import Icon from '~components/Icon';
  import { session, modals, alerts } from '~helpers/stores';
  import { minutesToTime, timeToMinutes } from '~helpers/timeHelper';
  import {
    SESSION_COLUMN_SPEED_LIMIT_UP_ENABLED,
    SESSION_COLUMN_SPEED_LIMIT_UP,
    SESSION_COLUMN_SPEED_LIMIT_DOWN_ENABLED,
    SESSION_COLUMN_SPEED_LIMIT_DOWN,
    SESSION_COLUMN_ALT_SPEED_ENABLED,
    SESSION_COLUMN_ALT_SPEED_UP,
    SESSION_COLUMN_ALT_SPEED_DOWN,
    SESSION_COLUMN_ALT_SPEED_TIME_ENABLED,
    SESSION_COLUMN_ALT_SPEED_TIME_BEGIN,
    SESSION_COLUMN_ALT_SPEED_TIME_END,
  } from '~helpers/constants/columns';

  let loadingInitial = $state(true);
  let loadingSubmit = $state(false);

  let uploadLimitEnabled = $state(null);
  let uploadLimit = $state(null);
  let downloadLimitEnabled = $state(null);
  let downloadLimit = $state(null);
  let altLimitsEnabled = $state(null);
  let altUploadLimit = $state(null);
  let altDownloadLimit = $state(null);
  let altSpeedTimeEnabled = $state(null);
  let altSpeedTimeBegin = $state(null);
  let altSpeedTimeEnd = $state(null);

  session
    .addColumns([
      SESSION_COLUMN_SPEED_LIMIT_UP_ENABLED,
      SESSION_COLUMN_SPEED_LIMIT_UP,
      SESSION_COLUMN_SPEED_LIMIT_DOWN_ENABLED,
      SESSION_COLUMN_SPEED_LIMIT_DOWN,
      SESSION_COLUMN_ALT_SPEED_ENABLED,
      SESSION_COLUMN_ALT_SPEED_UP,
      SESSION_COLUMN_ALT_SPEED_DOWN,
      SESSION_COLUMN_ALT_SPEED_TIME_ENABLED,
      SESSION_COLUMN_ALT_SPEED_TIME_BEGIN,
      SESSION_COLUMN_ALT_SPEED_TIME_END,
    ])
    .then(($session) => {
      uploadLimitEnabled = $session[SESSION_COLUMN_SPEED_LIMIT_UP_ENABLED];
      uploadLimit = $session[SESSION_COLUMN_SPEED_LIMIT_UP];
      downloadLimitEnabled = $session[SESSION_COLUMN_SPEED_LIMIT_DOWN_ENABLED];
      downloadLimit = $session[SESSION_COLUMN_SPEED_LIMIT_DOWN];
      altLimitsEnabled = $session[SESSION_COLUMN_ALT_SPEED_ENABLED];
      altUploadLimit = $session[SESSION_COLUMN_ALT_SPEED_UP];
      altDownloadLimit = $session[SESSION_COLUMN_ALT_SPEED_DOWN];
      altSpeedTimeEnabled = $session[SESSION_COLUMN_ALT_SPEED_TIME_ENABLED];
      altSpeedTimeBegin = minutesToTime(
        $session[SESSION_COLUMN_ALT_SPEED_TIME_BEGIN]
      );
      altSpeedTimeEnd = minutesToTime(
        $session[SESSION_COLUMN_ALT_SPEED_TIME_END]
      );

      loadingInitial = false;
    })
    .catch(() => {
      alerts.add(
        'Unable to fetch the data for that action right now. Try again later.',
        'negative'
      );
    });

  const handleSubmit = () => {
    loadingSubmit = true;

    session
      .update({
        'speed-limit-up-enabled': uploadLimitEnabled,
        'speed-limit-up': uploadLimit,
        'speed-limit-down-enabled': downloadLimitEnabled,
        'speed-limit-down': downloadLimit,
        'alt-speed-enabled': altLimitsEnabled,
        'alt-speed-up': altUploadLimit,
        'alt-speed-down': altDownloadLimit,
        'alt-speed-time-enabled': altSpeedTimeEnabled,
        'alt-speed-time-begin': timeToMinutes(altSpeedTimeBegin),
        'alt-speed-time-end': timeToMinutes(altSpeedTimeEnd),
      })
      .then(() => {
        alerts.add('Succesfully saved speed settings');
      })
      .catch(() => {
        alerts.add(
          'Failed saving speed settings, please try again',
          'negative'
        );
      })
      .finally(() => {
        loadingSubmit = false;
      });
  };
</script>

<div class="wrapper" class:loading-initial={loadingInitial}>
  <Icon name="SpinnerIcon" />
  <form onsubmit={preventDefault(handleSubmit)}>
    <Header text="Speed Limits" />
    <Checkbox bind:checked={uploadLimitEnabled} label="Upload (kB/s)" />
    <Input bind:value={uploadLimit} type="number" />

    <Checkbox bind:checked={downloadLimitEnabled} label="Download (kB/s)" />
    <Input bind:value={downloadLimit} type="number" />

    <Header text="Alternative Speed Limits" />
    <Checkbox
      bind:checked={altLimitsEnabled}
      label="Alternative speeds enabled"
    />

    <Input bind:value={altUploadLimit} label="Upload (kB/s)" type="number" />

    <Input
      bind:value={altDownloadLimit}
      label="Download (kB/s)"
      type="number"
    />

    <Checkbox bind:checked={altSpeedTimeEnabled} label="Scheduled Times" />

    <Input bind:value={altSpeedTimeBegin} label="From" type="time" />
    <Input bind:value={altSpeedTimeEnd} label="To" type="time" />

    <div class="buttons">
      <Button type="button" priority="tertiary" onclick={modals.close}>
        Cancel
      </Button>
      <Button type="submit" priority="primary" loading={loadingSubmit}>
        Save settings
      </Button>
    </div>
  </form>
</div>

<style>
  .wrapper {
    min-height: 100%;
    display: flex;
  }

  .wrapper.loading-initial {
    align-items: center;
    justify-content: center;
    fill: var(--color-modal-loading);
  }

  .wrapper > :global(.icon) {
    position: absolute;
    height: 30px;
    width: 30px;
    display: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .wrapper.loading-initial > :global(.icon) {
    display: inherit;
  }

  .wrapper.loading-initial form {
    visibility: hidden;
  }

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    line-height: 1;
    color: var(--color-modal-text);
  }

  form :global(.checkbox) {
    margin-bottom: 15px;
  }

  .buttons {
    flex-grow: 1;
    align-items: flex-end;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
</style>
