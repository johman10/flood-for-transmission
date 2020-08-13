<script>
  import { createEventDispatcher } from 'svelte';

  export let value;
  export let text = false;
  export let allowDisabled = false;

  let element;
  const dispatch = createEventDispatcher();

  $: {
    element
      ? element.style.setProperty('--levels', allowDisabled ? 4 : 3)
      : undefined;
  }

  const handleClick = () => {
    let newPriority = value + 1;
    if (newPriority > 1 && allowDisabled) {
      newPriority = -2;
    } else if (newPriority > 1) {
      newPriority = -1;
    }
    dispatch('click', newPriority);
  };
</script>

<div class="priority-indicator" on:click="{handleClick}" bind:this="{element}">
  <div class="slider level-{value}"></div>
  {#if text}
    <span class="label">
      {#if value === 0}
        Normal
      {:else if value > 0}
        High
      {:else if value === -1}Low{:else if value === -2}Don't download{/if}
    </span>
  {/if}
</div>

<style>
  .priority-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .slider {
    position: relative;
    height: 8px;
    min-width: 36px;
    transition: opacity 0.25s;
  }

  .slider::before {
    content: '';
    height: 2px;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    transition: background-color 0.25s;
    width: 100%;
    background-color: var(--color, rgb(37, 141, 229));
    opacity: 0.2;
    position: absolute;
  }

  .slider::after {
    content: '';
    height: 100%;
    top: 0;
    transition: background-color 0.25s, left 0.25s, transform 0.25s;
    transform: translateX(-50%);
    width: 2px;
    background-color: var(--color, rgb(37, 141, 229));
    position: absolute;
    left: 50%;
  }

  .slider.level-1 {
    --color: rgb(57, 206, 131);
  }

  .slider.level-0 {
    --color: rgb(57, 206, 131);
  }

  .slider.level--1 {
    --color: rgb(37, 141, 229);
  }

  .slider.level--2 {
    --color: rgb(67, 96, 118);
  }

  .slider.level-1::after {
    left: calc(100% / (var(--levels) - 1) * (var(--levels) - 1));
    transform: translateX(-100%);
  }

  .slider.level-0::after {
    left: calc(100% / (var(--levels) - 1) * (var(--levels) - 2));
    transform: translateX(-50%);
  }

  .slider.level--1::after {
    left: calc(100% / (var(--levels) - 1) * (var(--levels) - 3));
    transform: translateX(0%);
  }

  .slider.level--2::after {
    left: calc(100% / (var(--levels) - 1) * (var(--levels) - 4));
    transform: translateX(0%);
  }
</style>
