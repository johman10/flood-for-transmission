<script>
  import Icon from '~components/Icon';

  /**
   * @typedef {Object} Props
   * @property {boolean} [value]
   * @property {any} [torrentStatusClass]
   */

  /** @type {Props} */
  let { value = false, torrentStatusClass = null } = $props();
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
