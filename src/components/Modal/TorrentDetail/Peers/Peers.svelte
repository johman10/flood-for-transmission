<script>
  import { torrentDetails, ipAddress, session } from '~helpers/stores';
  import {
    TRANSMISSION_COLUMN_PEERS,
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SPEED,
  } from '~helpers/constants/columns';
  import { getSize } from '~helpers/sizeHelper';
  import Badge from '~components/Badge';
  import CheckIcon from '@lucide/svelte/icons/check';

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
      {#each peers as peer (peer.address)}
        <tr>
          <td class="address-cell">
            {#if $ipAddress[peer.address]?.country_code}
              <img
                class="flag"
                src="images/flags/{$ipAddress[
                  peer.address
                ].country_code.toLowerCase()}.png"
                alt={$ipAddress[peer.address].country_code}
                title={$ipAddress[peer.address].country_name}
              />
            {:else}
              <img class="flag" src="images/flags/_unknown.png" alt="Unknown" />
            {/if}
            <span class="address">{peer.address}</span>
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
              <CheckIcon class="icon" />
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .container {
    padding: 8px 16px 16px;
    height: 100%;
    overflow-y: auto;
  }

  table {
    color: var(--foreground);
    font-size: 13px;
    width: 100%;
    border-collapse: collapse;
  }

  th {
    height: 30px;
    padding: 0 8px;
    color: var(--muted-foreground);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-align: left;
    text-transform: uppercase;
    border-bottom: 1px solid var(--border);
  }

  th.main {
    display: flex;
    align-items: center;
    text-transform: none;
    letter-spacing: 0;
    font-size: 13px;
    color: var(--foreground);
  }

  td {
    height: 28px;
    padding: 0 8px;
    white-space: nowrap;
    border-bottom: 1px solid color-mix(in oklch, var(--border) 50%, transparent);
  }

  tbody tr:hover {
    background: var(--accent);
  }

  td > :global(.icon) {
    height: 12px;
    color: var(--color-positive);
  }

  .address-cell {
    position: relative;
  }

  .address {
    margin-left: 24px;
  }

  .flag {
    width: 16px;
    vertical-align: middle;
    display: inline-block;
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
  }

  .unit {
    font-size: 11px;
    font-style: normal;
    color: var(--muted-foreground);
  }
</style>
