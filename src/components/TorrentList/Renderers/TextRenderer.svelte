<script>
  export let value;
  export let torrentStatusClass = null;
  export let size = 'normal';
</script>

<span class:big={size === 'big'} class={torrentStatusClass}>{value}</span>

<style>
  .big {
    font-size: 14px;
  }

  .active.big,
  .seeding.big {
    font-weight: 500;
  }
</style>
