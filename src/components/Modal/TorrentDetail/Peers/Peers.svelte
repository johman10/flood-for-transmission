<script>
  import { torrentDetails, ipAddress, session } from '~helpers/stores';
  import {
    TRANSMISSION_COLUMN_PEERS,
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SPEED,
  } from '~helpers/constants/columns';
  import { getSize } from '~helpers/sizeHelper';
  import Badge from '~components/Badge';
  import Icon from '~components/Icon';

  $: peers = $torrentDetails[TRANSMISSION_COLUMN_PEERS];
  $: ipAddress.add(peers.map((peer) => peer.address));

  const getDownloadSpeed = (peer) => {
    return getSize(peer.rateToClient, {
      perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED],
      isSpeed: true,
    });
  };

  const getUploadSpeed = (peer) => {
    return getSize(peer.rateToPeer, {
      perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED],
      isSpeed: true,
    });
  };
</script>

<div class="container">
  <table>
    <thead>
      <tr>
        <th class="main">
          <span>Peers</span>
          <Badge>{peers.length}</Badge>
        </th>
        <th>DL</th>
        <th>UL</th>
        <th>%</th>
        <th>CLIENT</th>
        <th>ENC</th>
      </tr>
    </thead>
    <tbody>
      {#each peers as peer}
        <tr>
          <td>
            {#if $ipAddress[peer.address]}
              <img
                class="flag"
                src="images/flags/{$ipAddress[
                  peer.address
                ].country_code.toLowerCase()}.png"
                alt="{$ipAddress[peer.address].country_code}"
                title="{$ipAddress[peer.address].country_name}"
              />
            {:else}
              <img class="flag" src="images/flags/_unknown.png" alt="Unknown" />
            {/if}
            {peer.address}
          </td>
          <td>
            {getDownloadSpeed(peer).value}<em class="unit"
              >{getDownloadSpeed(peer).size}</em
            >
          </td>
          <td>
            {getUploadSpeed(peer).value}<em class="unit"
              >{getUploadSpeed(peer).size}</em
            >
          </td>
          <td>{Math.round(peer.progress * 100)}%</td>
          <td>{peer.clientName}</td>
          <td>
            {#if peer.isEncrypted}
              <Icon name="Checkmark" />
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .container {
    padding: 20px 25px;
    max-height: 100%;
    overflow-y: auto;
  }

  table {
    color: var(--color-modal-text);
    font-size: 13px;
    width: 100%;
  }

  th {
    color: var(--color-modal-text-light);
    font-size: 9px;
    text-align: left;
    font-weight: inherit;
    padding: 0;
  }

  th.main {
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  th > :global(.badge) {
    background: var(--color-modal-badge-background);
    color: var(--color-modal-text);
  }

  td {
    padding: 0;
    line-height: 14px;
  }

  td > :global(.icon) {
    height: 12px;
    fill: var(--color-positive);
  }

  .flag {
    width: 16px;
    vertical-align: middle;
    display: inline-block;
    margin-right: 5px;
  }

  .unit {
    font-size: 11px;
    font-style: normal;
    opacity: 0.8;
  }
</style>
