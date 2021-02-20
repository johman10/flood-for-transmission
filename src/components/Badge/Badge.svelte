<div class="badge">
  <slot />
</div>

<style>
  .badge {
    color: var(--color-badge-text);
    background-color: var(--color-badge-background);
    border-radius: 100px;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    margin-left: 10px;
    padding: 2px 5px;
    transition: background-color 0.25s;
  }
</style>
