<script>
  import { clickOutside } from '~helpers/actions';
  import Icon from '~components/Icon';
  import Button from '~components/Button';
  import { fly } from 'svelte/transition';

  let {
    options,
    onchange,
    placeholder = '',
    direction = 'above',
    value = null,
    label = null,
  } = $props();

  let open = $state(false);
  let optionsStyle = $state();
  let optionsElement = $state();
  let selectElement = $state();

  const handleChange = (newValue) => {
    open = false;
    onchange(newValue);
  };

  $effect(() => {
    if (open && selectElement) {
      const { x, y, width, height } = selectElement.getBoundingClientRect();
      if (direction === 'above') {
        optionsStyle = `left: ${x}px; top: ${y}px; width: ${width}px; transform: translateY(calc(-100% - 5px));`;
      } else if (direction === 'below') {
        optionsStyle = `left: ${x}px; top: ${y + height}px; width: ${width}px;`;
      }
    }
  });

  $effect(() => {
    if (optionsElement) {
      document.body.appendChild(optionsElement);
    }
  });
</script>

<div
  class="select"
  bind:this={selectElement}
  use:clickOutside={() => {
    open = false;
  }}
>
  {#if label}
    <div class="label" onclick={() => (open = !open)}>{label}</div>
  {/if}

  <Button onclick={() => (open = !open)} priority="quaternary">
    <div class="content">
      {options.find((option) => option.value === value)?.label || placeholder}
    </div>
    <div class="arrow" class:open={open}>
      <Icon name="Chevron" />
    </div>
  </Button>

  {#if open}
    <div
      bind:this={optionsElement}
      class="options"
      class:above={direction === 'above'}
      class:below={direction === 'below'}
      style={optionsStyle}
      transition:fly={{ duration: 125, y: -20 }}
    >
      {#each options as option}
        <div class="option" onclick={handleChange.bind(this, option.value)}>
          {option.label}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .select {
    position: relative;
  }

  .select > :global(.button) {
    fill: var(--color-select-icon);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    width: 100%;
  }

  .label {
    display: block;
    font-size: 13px;
    margin-bottom: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }

  .content {
    padding: 5px 12px;
  }

  .arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 100%;
    border-left: solid 1px var(--color-select-border);
    transition: transform 250ms;
  }

  .arrow.open {
    transform: rotate(180deg);
  }

  .options {
    position: absolute;
    z-index: 10;
    background-color: var(--color-select-option-background);
    color: #fff;
    padding: 9px 0;
    border-radius: 5px;
  }

  .options.above {
    transform: translateY(calc(-100% - 5px));
  }

  .options.below {
    transform: translateY(5px);
  }

  .option {
    cursor: pointer;
    padding: 6px 12px;
    transition: background-color 0.125s;
    font-size: 14px;
  }

  .option:hover {
    background-color: var(--color-select-option-background-hover);
  }
</style>
