<script>
  import { run, createBubbler, stopPropagation } from 'svelte/legacy';

  const bubble = createBubbler();
  import Icon from '~components/Icon';
  import Dropdown from '~components/Dropdown';
  import Switch from '~components/Switch';
  import { Settings } from '~components/Modal';
  import { getSize } from '~helpers/sizeHelper';
  import { session, modals } from '~helpers/stores';
  import {
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SPEED,
    SESSION_COLUMN_ALT_SPEED_ENABLED,
  } from '~helpers/constants/columns';

  const LIST_NAMES = ['download', 'upload'];
  const downloadSpeedLimit = session.speedLimit('download');
  const uploadSpeedLimit = session.speedLimit('upload');
  let altSpeedEnabled;
  run(() => {
    altSpeedEnabled = $session[SESSION_COLUMN_ALT_SPEED_ENABLED] || false;
  });

  let speedLimitLists = $derived(
    LIST_NAMES.reduce((acc, listName) => {
      const currentLimit =
        listName === 'upload' ? $uploadSpeedLimit : $downloadSpeedLimit;
      const perSize =
        $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED];
      const speedLimits = [
        1,
        10,
        100,
        500,
        1 * perSize,
        2 * perSize,
        5 * perSize,
        10 * perSize,
      ];

      acc[listName] = [];

      speedLimits.forEach((speedLimit) => {
        const { value, size } = getSize(speedLimit, {
          isSpeed: true,
          startSize: 'kB',
          perSize,
        });

        acc[listName].push({
          name: `${value}${size}`,
          value: speedLimit,
          list: listName,
          selected: currentLimit === speedLimit,
        });
      });

      acc[listName].push({
        name: 'Unlimited',
        value: null,
        list: listName,
        selected: currentLimit === null,
      });

      return acc;
    }, {})
  );

  const openSettings = () => {
    modals.open({ component: Settings, large: true });
  };

  const handleSelect = ({ detail: option }) => {
    const enabled = !!option.value;
    session.updateSpeedLimit(
      option.list,
      enabled,
      option.value,
      altSpeedEnabled
    );
  };

  const toggleAltSpeedEnabled = ({ detail: newAltSpeedEnabled }) => {
    session.toggleAltSpeeds(newAltSpeedEnabled);
  };
</script>

<div class="actions">
  <Dropdown
    header="Speed Limits"
    on:select={handleSelect}
    lists={speedLimitLists}
  >
    {#snippet trigger()}
      <div class="trigger">
        <Icon name="Limits" />
      </div>
    {/snippet}
    {#snippet bottom()}
      <div class="alt-speed-row" onclick={stopPropagation(bubble('click'))}>
        Alternative speeds
        <Switch
          bind:checked={altSpeedEnabled}
          on:change={toggleAltSpeedEnabled}
        />
      </div>
    {/snippet}
  </Dropdown>
  <Icon name="SettingsIcon" onclick={openSettings} />
</div>

<style>
  .actions {
    fill: var(--color-text);
    display: flex;
    padding: 5px;
    margin-bottom: 5px;
  }

  .trigger {
    display: flex;
  }

  .actions :global(.icon) {
    padding: 10px;
    height: 13px;
    width: 13px;
    box-sizing: initial;
    transition: fill 0.25s;
  }

  .actions :global(.icon):hover {
    fill: var(--color-active);
  }

  .alt-speed-row {
    border-top: solid 1px rgba(41, 51, 65, 0.05);
    padding: 10px 15px;
    font-size: 13px;
    display: flex;
    justify-content: space-between;
  }
</style>
