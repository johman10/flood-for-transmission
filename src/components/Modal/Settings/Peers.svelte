<script>
  import Header from './Header.svelte';
  import Checkbox from '~components/Checkbox';
  import Input from '~components/Input';
  import Icon from '~components/Icon';
  import Button from '~components/Button';
  import { session, modals, alerts } from '~helpers/stores';
  import {
    SESSION_COLUMN_PEER_LIMIT_PER_TORRENT,
    SESSION_COLUMN_PEER_LIMIT_GLOBAL,
    SESSION_COLUMN_PEX_ENABLED,
    SESSION_COLUMN_DHT_ENABLED,
    SESSION_COLUMN_LPD_ENABLED,
    SESSION_COLUMN_BLOCKLIST_URL,
    SESSION_COLUMN_BLOCKLIST_ENABLED,
    SESSION_COLUMN_BLOCKLIST_SIZE,
  } from '~helpers/constants/columns';

  let loadingInitial = true;
  let submitLoading = false;
  let blocklistUpdateLoading = false;

  let maxPeersPerTorrent = null;
  let maxPeersOverall = null;
  let pexEnabled = null;
  let dhtEnabled = null;
  let lpdEnabled = null;
  let blocklistUrl = null;
  let blocklistEnabled = null;
  let blocklistSize = 0;

  const numberFormatter = new Intl.NumberFormat();

  session
    .addColumns([
      SESSION_COLUMN_PEER_LIMIT_PER_TORRENT,
      SESSION_COLUMN_PEER_LIMIT_GLOBAL,
      SESSION_COLUMN_PEX_ENABLED,
      SESSION_COLUMN_DHT_ENABLED,
      SESSION_COLUMN_LPD_ENABLED,
      SESSION_COLUMN_BLOCKLIST_URL,
      SESSION_COLUMN_BLOCKLIST_ENABLED,
      SESSION_COLUMN_BLOCKLIST_SIZE,
    ])
    .then(($session) => {
      maxPeersPerTorrent = $session[SESSION_COLUMN_PEER_LIMIT_PER_TORRENT];
      maxPeersOverall = $session[SESSION_COLUMN_PEER_LIMIT_GLOBAL];
      pexEnabled = $session[SESSION_COLUMN_PEX_ENABLED];
      dhtEnabled = $session[SESSION_COLUMN_DHT_ENABLED];
      lpdEnabled = $session[SESSION_COLUMN_LPD_ENABLED];
      blocklistUrl = $session[SESSION_COLUMN_BLOCKLIST_URL];
      blocklistEnabled = $session[SESSION_COLUMN_BLOCKLIST_ENABLED];
      blocklistSize = $session[SESSION_COLUMN_BLOCKLIST_SIZE];
      loadingInitial = false;
    })
    .catch(() => {
      alerts.add(
        'Unable to fetch the data for that action right now. Try again later.',
        'negative'
      );
    });

  const updateBlocklist = () => {
    blocklistUpdateLoading = true;

    session
      .update({
        'blocklist-url': blocklistUrl,
      })
      .then(session.updateBlocklist)
      .then((newBlocklistSize) => {
        blocklistSize = newBlocklistSize;
        alerts.add('Succesfully updated your blocklist');
      })
      .catch(() => {
        alerts.add(
          'Failed updating your blocklist, please try again',
          'negative'
        );
      })
      .finally(() => {
        blocklistUpdateLoading = false;
      });
  };

  const handleSubmit = () => {
    submitLoading = true;

    session
      .update({
        'peer-limit-per-torrent': maxPeersPerTorrent,
        'peer-limit-global': maxPeersOverall,
        'pex-enabled': pexEnabled,
        'dht-enabled': dhtEnabled,
        'lpd-enabled': lpdEnabled,
        'blocklist-url': blocklistUrl,
        'blocklist-enabled': blocklistEnabled,
      })
      .then(() => {
        alerts.add('Succesfully saved peers settings');
      })
      .catch(() => {
        alerts.add(
          'Failed saving peers settings, please try again',
          'negative'
        );
      })
      .finally(() => {
        submitLoading = false;
      });
  };
</script>

<div class="wrapper" class:loading-initial="{loadingInitial}">
  <Icon name="SpinnerIcon" />
  <form on:submit|preventDefault="{handleSubmit}">
    <Header text="Connections" />
    <Input
      bind:value="{maxPeersPerTorrent}"
      label="Max peers per torrent"
      type="number"
    />
    <Input
      bind:value="{maxPeersOverall}"
      label="Max peers overall"
      type="number"
    />

    <Header text="Options" />
    <Checkbox bind:checked="{pexEnabled}" label="Use PEX to find more peers" />
    <Checkbox bind:checked="{dhtEnabled}" label="Use DHT to find more peers" />
    <Checkbox bind:checked="{lpdEnabled}" label="Use LPD to find more peers" />

    <Header text="Blocklist" />
    <Checkbox bind:checked="{blocklistEnabled}" label="Enable blocklist" />
    <Input
      bind:value="{blocklistUrl}"
      type="url"
      hint="Blocklist has {numberFormatter.format(blocklistSize)} rules"
    />
    <div class="update-wrapper">
      <Button
        type="button"
        priority="tertiary"
        on:click="{updateBlocklist}"
        loading="{blocklistUpdateLoading}"
      >
        Update blocklist
      </Button>
    </div>

    <div class="buttons">
      <Button type="button" priority="tertiary" on:click="{modals.close}">
        Cancel
      </Button>
      <Button type="submit" priority="primary" loading="{submitLoading}">
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
    fill: #3ea7ff;
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
    color: #7d8d9f;
  }

  form :global(.checkbox) {
    margin-bottom: 15px;
  }

  .update-wrapper {
    margin-bottom: 15px;
  }

  .buttons {
    flex-grow: 1;
    align-items: flex-end;
    display: flex;
    justify-content: flex-end;
  }

  .buttons > :global(* + *) {
    margin-left: 10px;
  }
</style>
