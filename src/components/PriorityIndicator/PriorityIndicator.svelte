<script>
  let { value, onclick, showLabel = false, allowDisabled = false } = $props();

  let element = $state();
  let label = $derived.by(() => {
    switch (value) {
      case 0:
        return 'Normal';
      case 1:
        return 'High';
      case -1:
        return 'Low';
      case -2:
        return "Don't download";
      default:
        return 'Invalid';
    }
  });

  $effect(() => {
    element
      ? element.style.setProperty('--levels', allowDisabled ? 4 : 3)
      : undefined;
  });

  const handleClick = () => {
    let newPriority = value + 1;
    if (newPriority > 1 && allowDisabled) {
      newPriority = -2;
    } else if (newPriority > 1) {
      newPriority = -1;
    }
    onclick(newPriority);
  };
</script>

<div
  class="priority-indicator"
  onclick={handleClick}
  bind:this={element}
  title={showLabel ? undefined : label}
>
  <div class="slider level-{value}"></div>
  {#if showLabel}<span class="label">{label}</span>{/if}
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
    background-color: var(--color);
    opacity: 0.2;
    position: absolute;
  }

  .slider::after {
    content: '';
    height: 100%;
    top: 0;
    transition:
      background-color 0.25s,
      left 0.25s,
      transform 0.25s;
    transform: translateX(-50%);
    width: 2px;
    background-color: var(--color);
    position: absolute;
    left: 50%;
  }

  .slider.level-1 {
    --color: var(--color-priority-high);
  }

  .slider.level-0 {
    --color: var(--color-priority-normal);
  }

  .slider.level--1 {
    --color: var(--color-priority-low);
  }

  .slider.level--2 {
    --color: var(--color-priority-off);
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
