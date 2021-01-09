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
                src="images/flags/{$ipAddress[peer.address].toLowerCase()}.png"
                alt="{$ipAddress[peer.address]}"
              />
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
    color: rgb(125, 141, 159);
    font-size: 13px;
    width: 100%;
  }

  th {
    color: rgba(125, 141, 159, 0.5);
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
    background: rgba(125, 141, 159, 0.2);
    color: #7d8d9f;
  }

  td {
    padding: 0;
    line-height: 16px;
  }

  td > :global(.icon) {
    height: 12px;
    fill: #39ce83;
  }

  .flag {
    width: 16px;
    height: 10px;
    display: inline-block;
    margin-right: 5px;
  }

  .unit {
    font-size: 11px;
    font-style: normal;
    opacity: 0.8;
  }
</style>
