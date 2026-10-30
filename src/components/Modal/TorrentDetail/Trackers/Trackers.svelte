<script>
  import { torrentDetails } from '~helpers/stores';
  import { TRANSMISSION_COLUMN_TRACKERS } from '~helpers/constants/columns';
  import Badge from '~components/Badge';
  import Input from '~components/Input';
  import ActionBarView from '~components/Modal/TorrentDetail/ActionBarView';
  import Checkbox from '~components/Checkbox';
  import Button from '~components/Button';

  $: trackers = $torrentDetails[TRANSMISSION_COLUMN_TRACKERS];
  let selectedTrackers = [];
  let newTracker = null;

  const toggleSelectedTracker = (event) => {
    if (!selectedTrackers.includes(event.target.value)) {
      selectedTrackers = [...selectedTrackers, event.target.value];
      return;
    }

    selectedTrackers = selectedTrackers.filter((t) => t !== event.target.value);
  };

  const removeTrackers = () => {
    let newTrackers = structuredClone(
      $torrentDetails[TRANSMISSION_COLUMN_TRACKERS]
    );
    newTrackers = newTrackers.filter(
      (t) => !selectedTrackers.includes(t.id.toString())
    );
    newTrackers = newTrackers.map((tracker) => tracker.announce).join('\n\n');
    torrentDetails.setTrackers($torrentDetails, newTrackers);
    selectedTrackers = [];
  };

  const addTracker = (event) => {
    event.preventDefault();

    let newTrackers = structuredClone(
      $torrentDetails[TRANSMISSION_COLUMN_TRACKERS]
    );
    newTrackers = newTrackers.map((tracker) => tracker.announce);
    newTrackers = [...newTrackers, newTracker.trim()].join('\n\n');
    torrentDetails.setTrackers($torrentDetails, newTrackers);
    newTracker = null;
  };
</script>

<div class="container">
  <ActionBarView
    items={selectedTrackers}
    itemName="tracker"
    itemNamePlural="trackers"
  >
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
        {#each trackers as tracker (tracker.id)}
          <tr>
            <td class="tracker-name">
              <Checkbox
                on:change={toggleSelectedTracker}
                group={selectedTrackers}
                value={tracker.id.toString()}
              />
              {tracker.announce}
            </td>
            <td>{tracker.tier}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <form class="new-tracker-form" slot="form" on:submit={addTracker}>
      <Input
        bind:value={newTracker}
        class="new-tracker-input"
        name="tracker"
        type="url"
        placeholder="Tracker announce URL"
      />
      <Button type="submit">Add tracker</Button>
    </form>

    <div slot="actions">
      <Button priority="tertiary" on:click={removeTrackers}>
        Remove selected
      </Button>
    </div>
  </ActionBarView>
</div>

<style>
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
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

  td.tracker-name {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .new-tracker-form {
    display: flex;
    gap: 8px;
  }

  .new-tracker-form > :global(.input-container) {
    margin: 0;
    flex-grow: 1;
  }
</style>
