<script>
  import Badge from '~components/Badge';

  /**
   * @typedef {Object} Props
   * @property {any} value
   * @property {any} [torrentStatusClass]
   */

  /** @type {Props} */
  let { value, torrentStatusClass = null } = $props();
</script>

<div class="labels {torrentStatusClass}">
  {#each value as label}
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
