<script>
  import { resizeableTable } from '~helpers/actions';
  import { uiColumns, sorting } from '~helpers/stores';

  export let name;

  const columnSizes = uiColumns.sizes;

  const handleResize = (newWidth) => {
    const columnIndex = $uiColumns.findIndex((column) => column.name === name);
    const column = { ...$uiColumns[columnIndex], width: newWidth };
    const newColumns = [...$uiColumns];
    newColumns.splice(columnIndex, 1, column);
    uiColumns.set(newColumns);
  };

  const handleClick = () => {
    sorting.updateToColumn(name);
  };
</script>

{#if name}
  <th
    class="header"
    class:sorting="{name === $sorting.column}"
    class:asc="{$sorting.column === name && $sorting.direction === 'asc'}"
    class:desc="{$sorting.column === name && $sorting.direction === 'desc'}"
    style="width: {$columnSizes[name]}px"
    on:click="{handleClick}"
  >
    {name}
    <span class="handle" use:resizeableTable="{handleResize}"></span>
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
    transition: opacity 200ms, transform 200ms;
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
