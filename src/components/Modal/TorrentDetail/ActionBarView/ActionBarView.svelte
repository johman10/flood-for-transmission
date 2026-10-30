<script>
  import { slide } from 'svelte/transition';

  export let items;
  export let itemName;
  export let itemNamePlural;
</script>

<div class="content" class:selected={!!items.length || $$slots.form}>
  <slot />
</div>

<div class="bar-spacing">
  <slot name="form" />
</div>

{#if items.length}
  <div class="action-bar bar-spacing" transition:slide={{ duration: 250 }}>
    <div class="text">
      <span class="focus">{items.length}</span>
      {items.length === 1 ? itemName : itemNamePlural}
      selected
    </div>

    <slot name="actions" />
  </div>
{/if}

<style>
  .content {
    flex-grow: 1;
    padding: 8px 16px;
    overflow-y: auto;
    transition: padding 0.25s;
  }

  .content.selected {
    padding: 8px 16px 4px;
  }

  .bar-spacing {
    padding: 10px 16px;
    border-top: 1px solid var(--border);
  }

  .action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .text {
    color: var(--muted-foreground);
    font-size: 13px;
    flex-grow: 1;
  }

  .focus {
    color: var(--color-active);
    font-weight: 700;
  }
</style>
