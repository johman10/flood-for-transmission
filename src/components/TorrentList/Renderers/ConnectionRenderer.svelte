<script>
  /**
   * @typedef {Object} Props
   * @property {number} [value]
   * @property {number} [connected]
   * @property {any} [torrentStatusClass]
   */

  /** @type {Props} */
  let { value = 0, connected = 0, torrentStatusClass = null } = $props();
</script>

{value}
<em>of</em>
{connected}

<style>
  em {
    font-size: 10px;
    font-style: normal;
  }
</style>
