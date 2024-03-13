<script>
  export let progress = 0;
</script>

<div class="fill-wrapper">
  <div class="fill" style="width: {progress}%"></div>
</div>

<style>
  .fill {
    background: var(--progess-color);
    display: block;
    height: 3px;
    width: 100%;
    transition: width 100ms;
  }

  .fill-wrapper {
    background: var(--background-color);
    flex: 1 1 auto;
    position: relative;
    height: 3px;
  }
</style>
