<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { clickOutside } from '~helpers/actions';

  const dispatch = createEventDispatcher();

  export let header;
  export let lists;

  let open = false;

  const toggleOpen = (onlyClose) => {
    if (onlyClose) {
      open = false;
      return;
    }

    open = !open;
  };

  const optionSelect = (option) => {
    if (option.selected) return;
    dispatch('select', option);
  };
</script>

<div
  class="wrapper"
  use:clickOutside="{toggleOpen.bind(null, true)}"
  on:click="{toggleOpen.bind(null, false)}"
>
  <slot name="trigger" />

  {#if open}
    <div class="menu" transition:fade="{{ duration: 250 }}">
      <div class="header">
        <slot name="trigger" />
        <span>{header}</span>
      </div>
      <div class="lists">
        {#each Object.entries(lists) as [listHeader, options]}
          <div class="list">
            <span class="list-header">{listHeader}</span>
            <ul>
              {#each options as option}
                <li
                  class:selected="{option.selected}"
                  on:click="{optionSelect(option)}"
                >
                  {option.name}
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
      <slot name="bottom" />
    </div>
  {/if}
</div>

<style>
  .wrapper {
    position: relative;
  }

  .menu {
    position: absolute;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 3px;
    color: var(--color-text);
    z-index: 1;
    min-width: 180px;
    top: 0;
    left: 0;
  }

  .header {
    display: flex;
    align-items: center;
    line-height: 1;
    opacity: 0.7;
    font-size: 13px;
    border-bottom: solid 1px rgba(41, 51, 65, 0.05);
    cursor: pointer;
    transition: color 250ms, fill 250ms;
  }

  .header:hover {
    color: var(--color-active);
  }

  .list-header {
    color: var(--color-header);
    font-size: 9px;
    font-weight: 500;
    text-transform: uppercase;
    display: block;
    letter-spacing: 1px;
    padding: 0 15px;
  }

  .lists {
    display: flex;
    padding: 10px 0;
  }

  ul {
    list-style: none;
  }

  li {
    padding: 5px 15px;
    font-size: 13px;
    cursor: pointer;
    transition: background-color 0.25s, color 0.25s;
  }

  li:hover {
    background-color: rgba(233, 238, 242, 0.4);
  }

  .selected {
    color: var(--color-active);
  }
</style>
