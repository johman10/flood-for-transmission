<script>
  import { run } from 'svelte/legacy';

  import { getSize } from '~helpers/sizeHelper';

  /**
   * @typedef {Object} Props
   * @property {any} value
   * @property {any} [torrentStatusClass]
   * @property {boolean} [isSpeed]
   * @property {boolean} [isUpload]
   * @property {number} [perSize]
   */

  /** @type {Props} */
  let {
    value = $bindable(),
    torrentStatusClass = null,
    isSpeed = false,
    isUpload = false,
    perSize = 1024,
  } = $props();

  let size = $state('B');
  run(() => {
    ({ size, value } = getSize(value, { isSpeed, perSize }));
  });
</script>

<span
  class:speed={isSpeed}
  class:active={value > 0}
  class:upload={isUpload}
  class={torrentStatusClass}
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
