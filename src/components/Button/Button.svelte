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
    fill: currentColor;
  }

  button :global(.icon) {
    width: 12px;
    height: 12px;
  }

  button.primary {
    background: var(--color-button-primary-background);
    border-color: var(--color-button-primary-border);
    text-shadow: 0 1px 0 var(--color-button-primary-shadow-1),
      0 1px 2px var(--color-button-primary-shadow-2);
  }

  button.secondary {
    background: var(--color-button-secondary-background);
    border-color: var(--color-button-secondary-border);
    text-shadow: 0 1px 0 var(--color-button-secondary-shadow-1),
      0 1px 2px var(--color-button-secondary-shadow-2);
  }

  button.tertiary {
    background: var(--color-button-tertiary-background);
    border-color: var(--color-button-tertiary-border);
    text-shadow: 0 1px 0 var(--color-button-tertiary-shadow-1),
      0 1px 2px var(--color-button-tertiary-shadow-2);
  }

  /* TODO: consider removing this, only used in select can be put there instead? */
  button.quaternary {
    background: var(--color-button-quaternary-background);
    border-color: var(--color-button-quaternary-border);
    color: var(--color-button-quaternary-text);
  }
</style>
