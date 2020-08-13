<script context="module">
  let num = 0;
</script>

<script>
  export let label = null;
  export let value;
  export let type = 'text';
  export let hint = null;

  num += 1;
  const id = `input-text-${num}`;
</script>

<div class="container">
  {#if label}<label class="label" for="{id}">{label}</label>{/if}
  {#if type === 'text'}
    <input class="input" id="{id}" type="text" bind:value {...$$restProps} />
  {:else if type === 'number'}
    <input class="input" id="{id}" type="number" bind:value {...$$restProps} />
  {:else if type === 'time'}
    <input class="input" id="{id}" type="time" bind:value {...$$restProps} />
  {:else if type === 'url'}
    <input class="input" id="{id}" type="url" bind:value {...$$restProps} />
  {/if}
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

  input {
    background: #293341;
    border: 1px solid #202d3c;
    color: #8899a8;
    width: 100%;
    font-size: 14px;
    height: 34px;
    outline: none;
    padding: 0 12px;
    border-radius: 4px;
    transition-property: background-color, border-color, color;
    transition-duration: 0.25s;
    transition-timing-function: ease-in-out;
  }

  input::placeholder {
    color: rgba(171, 186, 199, 0.25);
  }

  input:hover {
    border-color: #17212b;
    color: #d2d8de;
  }

  input:active,
  input:focus {
    background-color: rgba(52, 156, 244, 0.15);
    color: #f6fafe;
    border-color: #349cf4;
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
