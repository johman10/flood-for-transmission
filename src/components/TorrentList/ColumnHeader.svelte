<script>
  import { resizeableTable } from '~helpers/actions';
  import { uiColumns, sorting, tableHeaderConfig } from '~helpers/stores';

  let { id } = $props();

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
    onclick={handleClick}
  >
    {uiColumns.getColumnLabel(id)}
    <span class="handle" use:resizeableTable={handleResize}></span>
  </th>
{/if}

<style>
  .header {
    font-size: 13px;
    white-space: nowrap;
    border-right: 1px solid var(--color-column-header-border);
    cursor: pointer;
    flex: 0 0 auto;
    transition: color 0.15s;
    font-weight: 400;
    text-align: left;
    height: 24px;
    background-color: var(--color-column-header-background);
    box-shadow: 0 1px 0 var(--color-column-header-shadow);
    color: var(--color-column-header-text);
    position: sticky;
    top: 0;
    z-index: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 8px;
    transition: padding 200ms;
  }

  .header.sorting {
    color: var(--color-column-header-text-active);
    font-weight: 700;
    padding: 0 16px 0 8px;
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
    opacity: 0.5;
  }

  .header.asc:after {
    transform: rotate(180deg);
  }

  .handle {
    top: 0;
    right: 0;
    width: 5px;
    position: absolute;
    cursor: col-resize;
    user-select: none;
    height: 100%;
  }
</style>
