<script>
  import { torrentDetails } from '~helpers/stores';
  import { TRANSMISSION_COLUMN_TRACKERS } from '~helpers/constants/columns';
  import Badge from '~components/Badge';

  $: trackers = $torrentDetails[TRANSMISSION_COLUMN_TRACKERS];
</script>

<div class="container">
  <table>
    <thead>
      <tr>
        <th class="main">
          <span>Trackers</span>
          <Badge>{trackers.length}</Badge>
        </th>
        <th>TIER</th>
      </tr>
    </thead>
    <tbody>
      {#each trackers as tracker}
        <tr>
          <td>{tracker.announce}</td>
          <td>{tracker.tier}</td>
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
    line-height: 16px;
  }
</style>
