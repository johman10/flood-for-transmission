<script>
  import Header from './Header.svelte';
  import Input from '~components/Input';
  import Checkbox from '~components/Checkbox';
  import Button from '~components/Button';
  import Icon from '~components/Icon';
  import { session, modals, alerts } from '~helpers/stores';
  import {
    SESSION_COLUMN_PEER_PORT,
    SESSION_COLUMN_PEER_PORT_RANDOM_ON_START,
    SESSION_COLUMN_PORT_FORWARDING_ENABLED,
    SESSION_COLUMN_UTP_ENABLED,
  } from '~helpers/constants/columns';

  let loadingInitial = true;
  let submitLoading = false;

  let peerPort = null;
  let randomizePeerPort = null;
  let portForwardingEnabled = null;
  let utpEnabled = null;

  let portOpen = false;

  session.getPortTest().then((isPortOpen) => {
    portOpen = isPortOpen;
  });

  session
    .addColumns([
      SESSION_COLUMN_PEER_PORT,
      SESSION_COLUMN_PEER_PORT_RANDOM_ON_START,
      SESSION_COLUMN_PORT_FORWARDING_ENABLED,
      SESSION_COLUMN_UTP_ENABLED,
    ])
    .then(($session) => {
      peerPort = $session[SESSION_COLUMN_PEER_PORT];
      randomizePeerPort = $session[SESSION_COLUMN_PEER_PORT_RANDOM_ON_START];
      portForwardingEnabled = $session[SESSION_COLUMN_PORT_FORWARDING_ENABLED];
      utpEnabled = $session[SESSION_COLUMN_UTP_ENABLED];
      loadingInitial = false;
    })
    .catch(() => {
      alerts.add(
        'Unable to fetch the data for that action right now. Try again later.',
        'negative'
      );
    });

  const handleSubmit = () => {
    submitLoading = true;

    session
      .update({
        'peer-port': peerPort,
        'peer-port-random-on-start': randomizePeerPort,
        'port-forwarding-enabled': portForwardingEnabled,
        'utp-enabled': utpEnabled,
      })
      .then(() => {
        alerts.add('Succesfully saved torrent settings');
      })
      .catch(() => {
        alerts.add(
          'Failed saving torrent settings, please try again',
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
    <Header text="Listening port" />
    <Input
      label="Peer listening port"
      bind:value="{peerPort}"
      type="number"
      hint="Port is {portOpen ? 'open' : 'closed'}"
    />
    <Checkbox
      label="Randomize port on launch"
      bind:checked="{randomizePeerPort}"
    />
    <Checkbox
      label="Use port forwarding from my router"
      bind:checked="{portForwardingEnabled}"
    />

    <Header text="Options" />
    <Checkbox
      label="Enable uTP for peer communication"
      bind:checked="{utpEnabled}"
    />

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
