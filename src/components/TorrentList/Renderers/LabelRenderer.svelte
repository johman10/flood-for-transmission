<script>
  import Badge from '~components/Badge';

  export let value;
  export let torrentStatusClass = null;
</script>

<div class="labels {torrentStatusClass}">
  {#each value as label (label)}
    <Badge>{label}</Badge>
  {/each}
</div>

<style>
  .labels {
    display: flex;
  }

  .labels > :global(.badge) {
    background-color: var(--color-label-background);
    color: var(--color-label-text);
  }

  .labels.selected > :global(.badge) {
    background-color: var(--color-label-background-selected);
    color: var(--color-label-text-selected);
  }

  .labels.selected.error > :global(.badge) {
    background-color: var(--color-label-background-error);
    color: var(--color-label-text-error);
  }
</style>
