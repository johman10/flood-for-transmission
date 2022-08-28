<script context="module">
  let num = 0;
</script>

<script>
  import Icon from '~components/Icon';

  export let label = null;
  export let checked = false;
  export let group = null;
  export let value = null;
  export let hint = null;

  num += 1;
  const id = `input-checkbox-${num}`;
</script>

<label for="{id}" tabindex="0" class="checkbox">
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
  {#if label}<div class="label">{label}</div>{/if}
</label>
{#if hint}<div class="hint">{hint}</div>{/if}

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
    background: var(--color-checkbox-background);
    border: 1px solid var(--color-checkbox-border);
    height: 18px;
    width: 18px;
    fill: var(--color-checkbox-mark);
    transition-property: color, background-color, border-color, fill;
    transition-duration: 0.25s;
    transition-timing-function: ease-in-out;
  }

  .indicator > :global(.icon) {
    opacity: 0;
    transition: opacity 0.25s ease-in-out;
  }

  .label {
    margin-left: 6px;
  }

  .checkbox:active .indicator > :global(.icon) {
    opacity: 0.25;
  }

  .checkbox .indicator.checked > :global(.icon) {
    opacity: 1;
  }

  .checkbox:focus,
  .checkbox:active {
    color: var(--color-checkbox-text-active);
  }

  .checkbox:active .indicator,
  .checkbox:focus .indicator {
    background-color: var(--color-checkbox-background-active);
    border-color: var(--color-checkbox-border-active);
    fill: var(--color-checkbox-mark-active);
  }

  .hint {
    font-size: 12px;
    display: block;
    margin-top: 5px;
  }
</style>
