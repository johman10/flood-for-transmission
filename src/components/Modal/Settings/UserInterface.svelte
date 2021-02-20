<script>
  import Header from './Header.svelte';
  import Button from '~components/Button';
  import InputMultiple from '~components/InputMultiple';
  import Checkbox from '~components/Checkbox';
  import { modals, alerts, uiColumns, paths } from '~helpers/stores';
  import { orderable } from '~helpers/actions';

  const newColumns = JSON.parse(JSON.stringify($uiColumns));
  let newPaths = [...$paths];

  const handleSubmit = () => {
    try {
      uiColumns.set(newColumns);
      paths.set(newPaths);
      alerts.add('Succesfully saved user interface settings');
    } catch (e) {
      alerts.add(
        'Failed saving user interface settings, please try again',
        'negative'
      );
    }
  };

  const handleColumnDrop = (sorting) => {
    newColumns.sort(
      (a, b) => sorting.indexOf(a.name) - sorting.indexOf(b.name)
    );
  };
</script>

<form on:submit|preventDefault="{handleSubmit}">
  <Header text="Common paths" />
  <p class="hint">
    These paths will be shown behind the magnifier where you can select a path.
  </p>
  <div class="list">
    <InputMultiple
      bind:values="{newPaths}"
      pattern="^/.*"
      validationMessage="Path must be an absolute path."
    />
  </div>

  <Header text="Torrent Columns" />
  <div class="list">
    {#each Object.values(newColumns) as column}
      <div
        class="column"
        draggable="true"
        use:orderable="{handleColumnDrop}"
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
    color: var(--color-modal-text);
  }

  form :global(.checkbox) {
    font-size: 11px;
  }

  form :global(.checkbox) :global(.indicator) {
    background: var(--color-checkbox-background-dark);
    border-color: var(--color-checkbox-border-dark);
  }

  .buttons {
    flex-grow: 1;
    align-items: flex-end;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .list {
    margin-bottom: 15px;
    border-radius: 3px;
    overflow: hidden;
  }

  .column {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--color-modal-user-interface-column-background);
    border: 1px solid var(--color-modal-user-interface-column-border);
    cursor: move;
    height: 30px;
    padding: 0 5px;
    font-size: 13px;
  }

  .hint {
    font-size: 12px;
    line-height: 1.5;
    margin-bottom: 8px;
  }
</style>
