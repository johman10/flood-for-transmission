<script>
  import { resizeableTable } from '~helpers/actions';
  import { uiColumns, sorting, tableHeaderConfig } from '~helpers/stores';

  export let id;

  const columnSizes = uiColumns.sizes;

  const handleResize = (newWidth) => {
    const columnIndex = $uiColumns.findIndex((column) => column.id === id);
    const column = { ...$uiColumns[columnIndex], width: newWidth };
    const newColumns = [...$uiColumns];
    newColumns.splice(columnIndex, 1, column);
    uiColumns.set(newColumns);
  };

  const handleClick = () => {
    sorting.updateToColumn(id);
  };
</script>

{#if id}
  <th
    class="header"
    class:sorting={id === $sorting.id}
    class:asc={$sorting.id === id && $sorting.direction === 'asc'}
    class:desc={$sorting.id === id && $sorting.direction === 'desc'}
    class:wrap={$tableHeaderConfig}
    style="width: {$columnSizes[id]}px"
    on:click={handleClick}
  >
    {uiColumns.getColumnLabel(id)}
    <span class="handle" use:resizeableTable={handleResize}></span>
  </th>
{/if}

<style>
  .header {
    font-size: 12px;
    white-space: nowrap;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    flex: 0 0 auto;
    font-weight: 500;
    text-align: left;
    height: 30px;
    background-color: var(--background);
    color: var(--muted-foreground);
    position: sticky;
    top: 0;
    z-index: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 10px;
    transition:
      color 0.15s,
      padding 200ms;
  }

  .header:hover {
    color: var(--foreground);
  }

  .header.sorting {
    color: var(--foreground);
    padding: 0 18px 0 10px;
  }

  .header.wrap {
    white-space: normal;
  }

  .header:after {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid;
    content: '';
    margin-top: -3px;
    opacity: 0;
    position: absolute;
    right: 8px;
    top: 50%;
    transition:
      opacity 200ms,
      transform 200ms;
  }

  .header.sorting:after {
    opacity: 0.6;
  }

  .header.asc:after {
    transform: rotate(180deg);
  }

  .handle {
    top: 6px;
    right: 0;
    width: 5px;
    position: absolute;
    cursor: col-resize;
    user-select: none;
    height: calc(100% - 12px);
    border-right: 1px solid var(--border);
  }
</style>
