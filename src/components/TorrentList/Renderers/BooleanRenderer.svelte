<script>
  import CheckIcon from '@lucide/svelte/icons/check';

  export let value = false;
  export let torrentStatusClass = null;
</script>

<div>
  {#if value}
    <CheckIcon class="icon" />
  {/if}
</div>

<style>
  div > :global(.icon) {
    color: currentColor;
    height: 12px;
    margin-right: 5px;
    width: 12px;
  }
</style>
