<script>
  import { createEventDispatcher } from 'svelte';
  import { clickOutside } from '~helpers/actions';
  import Icon from '~components/Icon';
  import Button from '~components/Button';
  import { fly } from 'svelte/transition';

  export let options;
  export let placeholder = '';

  let open = false;
  let optionsStyle;
  let optionsElement;
  let selectElement;

  const dispatch = createEventDispatcher();

  const handleChange = (newValue) => {
    open = false;
    dispatch('change', newValue);
  };

  $: {
    if (open && selectElement) {
      const { x, y, width } = selectElement.getBoundingClientRect();
      optionsStyle = `left: ${x}px; top: ${y - 5}px; width: ${width}px;`;
    }
  }

  $: {
    if (optionsElement) {
      document.body.appendChild(optionsElement);
    }
  }
</script>

<div
  class="select"
  bind:this="{selectElement}"
  use:clickOutside="{() => {
    open = false;
  }}"
>
  <Button on:click="{() => (open = !open)}" priority="quaternary">
    <div class="content">{placeholder}</div>
    <div class="arrow" class:open>
      <Icon name="Chevron" />
    </div>
  </Button>

  {#if open}
    <div
      bind:this="{optionsElement}"
      class="options"
      style="{optionsStyle}"
      transition:fly="{{ duration: 125, y: -20 }}"
    >
      {#each options as option}
        <div class="option" on:click="{handleChange(option.value)}">
          {option.label}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .select > :global(.button) {
    fill: #8899a8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    width: 100%;
  }

  .content {
    padding: 5px;
  }

  .arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 100%;
    border-left: solid 1px #202d3c;
    transition: transform 250ms;
  }

  .arrow.open {
    transform: rotate(180deg);
  }

  .options {
    position: absolute;
    transform: translateY(-100%);
    z-index: 10;
    background-color: #293341;
    color: #fff;
    padding: 9px 0;
    border-radius: 5px;
  }

  .option {
    cursor: pointer;
    padding: 6px 9px;
    transition: background-color 0.125s;
    font-size: 14px;
  }

  .option:hover {
    background-color: #242e3c;
  }
</style>
