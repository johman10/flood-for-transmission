<script>
  export let progress = 0;
</script>

<div class="fill-wrapper">
  <div class="fill" style="width: {progress}%"></div>
</div>

<style>
  .fill {
    background: var(--progess-color);
    border-radius: 999px;
    display: block;
    height: 4px;
    width: 100%;
    transition: width 100ms;
  }

  .fill-wrapper {
    background: var(--background-color);
    flex: 1 1 auto;
    position: relative;
    height: 4px;
    border-radius: 999px;
    overflow: hidden;
  }
</style>
