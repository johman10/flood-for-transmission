<script>
  import Badge from '~components/Badge';

  export let value;
  export let torrentStatusClass = null;
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
    background-color: #dce2e6;
    color: #6f7d87;
  }

  .labels.selected > :global(.badge) {
    background-color: #4ea3ea;
    color: #ffffff;
  }

  .labels.selected.error > :global(.badge) {
    background-color: #ed7994;
    color: #fbe8ec;
  }
</style>
