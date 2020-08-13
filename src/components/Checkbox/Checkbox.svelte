<script context="module">
  let num = 0;
</script>

<script>
  import Icon from '~components/Icon';

  export let label = null;
  export let checked = false;
  export let group = null;
  export let value = null;

  num += 1;
  const id = `input-checkbox-${num}`;
</script>

<label for="{id}" tabindex="0" class="checkbox label">
  {#if group && value}
    <input type="checkbox" bind:group value="{value}" id="{id}" on:change />
    <div class="indicator" class:checked="{group.includes(value)}">
      <Icon name="CheckboxCheckmark" viewBox="0 0 18 18" />
    </div>
  {:else}
    <input type="checkbox" bind:checked id="{id}" on:change />
    <div class="indicator" class:checked>
      <Icon name="CheckboxCheckmark" viewBox="0 0 18 18" />
    </div>
  {/if}
  {#if label}{label}{/if}
</label>

<style>
  label {
    align-items: center;
    cursor: pointer;
    display: flex;
    align-items: center;
    outline: none;
    position: relative;
    font-size: 14px;
    transition: color 0.25s ease-in-out;
  }

  input {
    visibility: hidden;
    position: absolute;
  }

  .indicator {
    border-radius: 4px;
    background: #293341;
    border: 1px solid #202d3c;
    height: 18px;
    width: 18px;
    margin-right: 6px;
    fill: #8899a8;
    transition-property: color, background-color, border-color, border-width,
      fill;
    transition-duration: 0.25s;
    transition-timing-function: ease-in-out;
  }

  .indicator > :global(.icon) {
    opacity: 0;
    transition: opacity 0.25s ease-in-out;
  }

  label:active .indicator > :global(.icon) {
    opacity: 0.25;
  }

  label .indicator.checked > :global(.icon) {
    opacity: 1;
  }

  label:focus,
  label:active {
    color: #349cf4;
  }

  label:active .indicator,
  label:focus .indicator {
    background-color: rgba(52, 156, 244, 0.1);
    color: rgba(52, 156, 244, 0.8);
    border-color: #349cf4;
    border-width: 2px;
    fill: #349cf4;
  }
</style>
