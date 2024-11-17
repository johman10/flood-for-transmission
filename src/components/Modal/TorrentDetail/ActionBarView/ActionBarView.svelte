<script>
  import { slide } from 'svelte/transition';

  let { items, itemName, itemNamePlural, form, children, actions } = $props();
</script>

<div class="content" class:selected={!!items.length || form}>
  {@render children?.()}
</div>

<div class="bar-spacing">
  {@render form?.()}
</div>

{#if items.length}
  <div class="action-bar bar-spacing" transition:slide={{ duration: 250 }}>
    <div class="text">
      <span class="focus">{items.length}</span>
      {items.length === 1 ? itemName : itemNamePlural}
      selected
    </div>

    {@render actions?.()}
  </div>
{/if}

<style>
  .content {
    flex-grow: 1;
    padding: 20px 25px;
    overflow-y: auto;
    transition: padding 0.25s;
  }

  .content.selected {
    padding: 20px 25px 5px;
  }

  .bar-spacing {
    padding: 9px 25px;
  }

  .action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .text {
    color: var(--color-modal-text);
    font-size: 14px;
    flex-grow: 1;
  }

  .focus {
    color: var(--color-active);
    font-weight: 700;
  }
</style>
