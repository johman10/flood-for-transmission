<script>
  import { resizeableTable } from '~helpers/actions';
  import { uiColumns } from '~helpers/stores';

  export let name;
  export let last = false;

  const columnSizes = uiColumns.sizes;

  const handleResize = (newWidth) => {
    const columnIndex = $uiColumns.findIndex((column) => column.name === name);
    const column = { ...$uiColumns[columnIndex], width: newWidth };
    const newColumns = [...$uiColumns];
    newColumns.splice(columnIndex, 1, column);
    uiColumns.set(newColumns);
  };
</script>

{#if name}
  <th class="header" style="width: {$columnSizes[name]}px">
    <span class="name">{name}</span>
    <span class="handle" class:last use:resizeableTable="{handleResize}"></span>
  </th>
{/if}

<style>
  .header {
    border-right: 1px solid rgba(29, 41, 56, 0.08);
    cursor: pointer;
    flex: 0 0 auto;
    transition: color 0.15s;
    font-weight: 400;
    text-align: left;
    height: 24px;
    background-color: #f9fbfc;
    box-shadow: 0 1px 0 rgba(29, 41, 56, 0.1);
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .header:before {
    content: '.';
    visibility: hidden;
  }

  .name {
    padding: 0 8px;
    position: absolute;
    left: 0;
    right: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .handle {
    top: 0;
    right: -5px;
    width: 10px;
    position: absolute;
    cursor: col-resize;
    user-select: none;
    height: 100%;
  }

  .handle.last {
    right: 0;
    width: 5px;
  }
</style>
