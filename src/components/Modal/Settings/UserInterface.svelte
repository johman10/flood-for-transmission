<script>
  import Header from './Header.svelte';
  import Button from '~components/Button';
  import Checkbox from '~components/Checkbox';
  import { modals, alerts, uiColumns } from '~helpers/stores';
  import { orderable } from '~helpers/actions';

  const newColumns = JSON.parse(JSON.stringify($uiColumns));

  const handleSubmit = () => {
    try {
      uiColumns.set(newColumns);
      alerts.add('Succesfully saved user interface settings');
    } catch (e) {
      alerts.add(
        'Failed saving user interface settings, please try again',
        'negative'
      );
    }
  };

  const handleDrop = (sorting) => {
    newColumns.sort(
      (a, b) => sorting.indexOf(a.name) - sorting.indexOf(b.name)
    );
  };
</script>

<form on:submit|preventDefault="{handleSubmit}">
  <Header text="Torrent Detail Columns" />

  <div class="list">
    {#each Object.values(newColumns) as column}
      <div
        class="column"
        draggable="true"
        use:orderable="{handleDrop}"
        id="{column.name}"
      >
        <span>{column.name}</span>
        <Checkbox bind:checked="{column.enabled}" label="Enabled" />
      </div>
    {/each}
  </div>

  <div class="buttons">
    <Button type="button" priority="tertiary" on:click="{modals.close}">
      Cancel
    </Button>
    <Button type="submit" priority="primary">Save settings</Button>
  </div>
</form>

<style>
  form {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    line-height: 1;
    color: #7d8d9f;
  }

  form :global(.checkbox) {
    font-size: 11px;
  }

  form :global(.checkbox) :global(.indicator) {
    background: #1f2731;
    border-color: #191f28;
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

  .list {
    margin-bottom: 15px;
  }

  .column:first-child {
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }

  .column:last-child {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  .column {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #293341;
    border: 1px solid #1f2937;
    cursor: move;
    height: 30px;
    padding: 0 5px;
    font-size: 13px;
  }
</style>
