<script context="module">
  let num = 0;
</script>

<script>
  import Icon from '~components/Icon';

  num += 1;

  export let label = null;
  export let value;
  export let type = 'text';
  export let hint = null;
  export let validationMessage = '';
  export let addons = [];
  export let input = null;
  export let id = `input-text-${num}`;

  const handleInvalid = (e) => {
    if (!validationMessage) return;
    e.target.setCustomValidity(validationMessage);
  };
</script>

<div class="container">
  {#if label}<label class="label" for="{id}">{label}</label>{/if}
  <div class="input-wrapper" style="--addon-count: {addons.length};">
    {#if type === 'text'}
      <input
        class="input"
        id="{id}"
        type="text"
        bind:this="{input}"
        on:invalid="{handleInvalid}"
        on:input="{(e) => e.target.setCustomValidity('')}"
        bind:value
        {...$$restProps}
      />
    {:else if type === 'number'}
      <input
        class="input"
        id="{id}"
        type="number"
        bind:this="{input}"
        on:invalid="{handleInvalid}"
        on:input="{(e) => e.target.setCustomValidity('')}"
        bind:value
        {...$$restProps}
      />
    {:else if type === 'time'}
      <input
        class="input"
        id="{id}"
        type="time"
        bind:this="{input}"
        on:invalid="{handleInvalid}"
        on:input="{(e) => e.target.setCustomValidity('')}"
        bind:value
        {...$$restProps}
      />
    {:else if type === 'url'}
      <input
        class="input"
        id="{id}"
        type="url"
        bind:this="{input}"
        on:invalid="{handleInvalid}"
        on:input="{(e) => e.target.setCustomValidity('')}"
        bind:value
        {...$$restProps}
      />
    {:else}{console.error(`Invalid type received, ${type}`)}{/if}
    {#each addons as addon, index}
      <div
        class="addon"
        on:click="{addon.onClick}"
        style="--index: {index}; --icon-size: {addon.iconSize};"
      >
        <Icon name="{addon.iconName}" />
      </div>
    {/each}
  </div>
  {#if hint}<span class="hint">{hint}</span>{/if}
</div>

<style>
  .container {
    margin-bottom: 15px;
  }

  label {
    display: block;
    font-size: 13px;
    margin-bottom: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .input-wrapper {
    position: relative;
  }

  .input-wrapper:focus-within .addon {
    fill: var(--color-input-addon-icon-active);
    border-left-color: var(--color-input-addon-border-active);
  }

  .input-wrapper .addon {
    position: absolute;
    right: calc(var(--index) * 34px);
    top: 0;
    height: 34px;
    width: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: solid 1px var(--color-input-addon-border);
    transition: fill 125ms, border 125ms;
    cursor: pointer;
    fill: var(--color-input-addon-icon);
  }

  .input-wrapper .addon:hover {
    fill: var(--color-input-addon-icon-active);
  }

  .input-wrapper .addon > :global(.icon) {
    height: var(--icon-size);
  }

  input {
    background: var(--color-input-background);
    border: 1px solid var(--color-input-border);
    color: var(--color-input-text);
    width: 100%;
    font-size: 14px;
    height: 34px;
    outline: none;
    padding: 0 calc(var(--addon-count) * 32px + 12px) 0 12px;
    border-radius: 4px;
    transition-property: background-color, border-color, color;
    transition-duration: 0.25s;
    transition-timing-function: ease-in-out;
  }

  input::placeholder {
    color: var(--color-input-placeholder);
  }

  input:hover {
    border-color: var(--color-input-border-hover);
    color: var(--color-input-text-hover);
  }

  input:active,
  input:focus {
    background-color: var(--color-input-background-active);
    border-color: var(--color-input-border-active);
    color: var(--color-input-text-active);
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input::-webkit-calendar-picker-indicator {
    background: -webkit-image-set(
      url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjODg5OUE4IiBkPSJNMTEuOTkgMkM2LjQ3IDIgMiA2LjQ4IDIgMTJzNC40NyAxMCA5Ljk5IDEwQzE3LjUyIDIyIDIyIDE3LjUyIDIyIDEyUzE3LjUyIDIgMTEuOTkgMnpNMTIgMjBjLTQuNDIgMC04LTMuNTgtOC04czMuNTgtOCA4LTggOCAzLjU4IDggOC0zLjU4IDgtOCA4eiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTIuNSA3SDExdjZsNS4yNSAzLjE1Ljc1LTEuMjMtNC41LTIuNjd6IiBmaWxsPSIjODg5OUE4IiAvPjwvc3ZnPg==')
        1x
    );
    background-origin: content-box;
    background-size: contain;
    background-repeat: no-repeat;
    cursor: pointer;
  }

  input:hover::-webkit-calendar-picker-indicator {
    background: -webkit-image-set(
      url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZDJkOGRlIiBkPSJNMTEuOTkgMkM2LjQ3IDIgMiA2LjQ4IDIgMTJzNC40NyAxMCA5Ljk5IDEwQzE3LjUyIDIyIDIyIDE3LjUyIDIyIDEyUzE3LjUyIDIgMTEuOTkgMnpNMTIgMjBjLTQuNDIgMC04LTMuNTgtOC04czMuNTgtOCA4LTggOCAzLjU4IDggOC0zLjU4IDgtOCA4eiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTIuNSA3SDExdjZsNS4yNSAzLjE1Ljc1LTEuMjMtNC41LTIuNjd6IiBmaWxsPSIjZDJkOGRlIiAvPjwvc3ZnPg==')
        1x
    );
    background-origin: content-box;
    background-size: contain;
    background-repeat: no-repeat;
  }

  input:active::-webkit-calendar-picker-indicator,
  input:focus::-webkit-calendar-picker-indicator {
    background: -webkit-image-set(
      url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZjZmYWZlIiBkPSJNMTEuOTkgMkM2LjQ3IDIgMiA2LjQ4IDIgMTJzNC40NyAxMCA5Ljk5IDEwQzE3LjUyIDIyIDIyIDE3LjUyIDIyIDEyUzE3LjUyIDIgMTEuOTkgMnpNMTIgMjBjLTQuNDIgMC04LTMuNTgtOC04czMuNTgtOCA4LTggOCAzLjU4IDggOC0zLjU4IDgtOCA4eiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTIuNSA3SDExdjZsNS4yNSAzLjE1Ljc1LTEuMjMtNC41LTIuNjd6IiBmaWxsPSIjZjZmYWZlIiAvPjwvc3ZnPg==')
        1x
    );
    background-origin: content-box;
    background-size: contain;
    background-repeat: no-repeat;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  .hint {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    margin-top: 5px;
  }
</style>
