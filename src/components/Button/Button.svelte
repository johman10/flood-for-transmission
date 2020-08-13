<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from '~components/Icon';

  const dispatch = createEventDispatcher();

  export let priority = 'primary';
  export let type = 'button';
  export let loading = false;

  const handleClick = (event) => {
    if (loading) return;
    dispatch('click', event);
  };
</script>

<button type="{type}" class="button {priority}" on:click="{handleClick}">
  {#if loading}
    <Icon name="SpinnerIcon" />
  {:else}
    <slot />
  {/if}
</button>

<style>
  button {
    border-radius: 4px;
    border: solid 1px currentColor;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    height: 34px;
    outline: none;
    padding: 0 12px;
    position: relative;
    user-select: none;
    fill: #fff;
  }

  button :global(.icon) {
    width: 12px;
    height: 12px;
  }

  button.primary {
    background: #349cf4;
    border-color: #349cf4;
    text-shadow: 0 1px 0 #0c79d5, 0 1px 2px rgba(10, 107, 189, 0.8);
  }

  button.secondary {
    background: #39ce83;
    border-color: #39ce83;
    text-shadow: 0 1px 0 #279e62, 0 1px 2px rgba(34, 138, 86, 0.8);
  }

  button.tertiary {
    background: #8899a8;
    border-color: #8899a8;
    text-shadow: 0 1px 0 #5f7282, 0 1px 2px rgba(84, 101, 115, 0.8);
  }

  button.quaternary {
    background: #293341;
    border-color: #202d3c;
    color: #8899a8;
  }
</style>
