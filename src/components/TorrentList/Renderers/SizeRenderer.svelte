<script>
  import { getSize } from '~helpers/sizeHelper';

  export let value;
  export let torrentStatusClass = null;
  export let isSpeed = false;
  export let isUpload = false;
  export let perSize = 1024;

  let size = 'B';
  $: ({ size, value } = getSize(value, { isSpeed, perSize }));
</script>

<span
  class:speed="{isSpeed}"
  class:active="{value > 0}"
  class:upload="{isUpload}"
  class="{torrentStatusClass}"
>
  {value}
  <em>{size}</em>
</span>

<style>
  em {
    font-size: 10px;
    font-style: normal;
    margin-bottom: 0.1em;
    opacity: 0.8;
  }

  .speed.active {
    font-weight: 500;
    color: var(--color-download);
  }

  .speed.active.upload {
    color: var(--color-upload);
  }

  .selected.speed.active {
    color: var(--color-size-text-selected);
  }
</style>
