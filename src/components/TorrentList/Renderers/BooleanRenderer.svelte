<script>
  import Icon from '~components/Icon';

  export let value = false;
  export let torrentStatusClass = null;
</script>

<div>
  {#if value}
    <Icon name="Checkmark" />
  {/if}
</div>

<style>
  div > :global(.icon) {
    fill: currentColor;
    height: 12px;
    margin-right: 5px;
    width: 12px;
  }
</style>
