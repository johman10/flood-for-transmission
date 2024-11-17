<script>
  /**
   * @typedef {Object} Props
   * @property {any} value
   * @property {any} [torrentStatusClass]
   * @property {string} [size]
   */

  /** @type {Props} */
  let { value, torrentStatusClass = null, size = 'normal' } = $props();
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
