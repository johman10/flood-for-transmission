<script>
  import { fly } from 'svelte/transition';
  import { contextMenu } from '~helpers/stores';
  import clickOutside from '~helpers/actions/clickOutside';

  const SPACE_AROUND = 10;
  const VERTICAL_OFFSET = 5;

  let windowHeight = 0;
  let windowWidth = 0;
  let menuHeight = 0;
  let menuWidth = 0;
  let bottom = 'auto';
  let top = 'auto';
  let maxHeight = 'auto';
  let width = 'auto';
  let left = 'auto';
  let right = 'auto';

  $: {
    bottom = 'auto';
    top = 'auto';
    maxHeight = 'auto';
    width = 'auto';
    left = 'auto';
    right = 'auto';

    if ($contextMenu?.element) {
      const buttonBoundingRect = $contextMenu.element.getBoundingClientRect();
      const spaceAbove = buttonBoundingRect.top;
      const spaceBelow = windowHeight - buttonBoundingRect.bottom;

      if (shouldRenderAbove(spaceBelow, spaceAbove)) {
        bottom = spaceBelow + buttonBoundingRect.height + VERTICAL_OFFSET;
        maxHeight = buttonBoundingRect.top - SPACE_AROUND;
      } else {
        top = buttonBoundingRect.bottom + VERTICAL_OFFSET;
        maxHeight = spaceBelow - SPACE_AROUND;
      }

      if ($contextMenu.matchElementWidth) {
        width = buttonBoundingRect.width;
        left = buttonBoundingRect.left;
        right = windowWidth - left - width;
      } else if ($contextMenu.align === 'right') {
        right =
          windowWidth - buttonBoundingRect.left - buttonBoundingRect.width;
      } else {
        left = buttonBoundingRect.left;
      }
    } else if ($contextMenu?.coordinates) {
      const spaceAbove = $contextMenu.coordinates.y;
      const spaceBelow = windowHeight - spaceAbove;

      if (shouldRenderAbove(spaceBelow, spaceAbove)) {
        bottom = spaceBelow;
        maxHeight = spaceAbove - SPACE_AROUND;
      } else {
        top = spaceAbove;
        maxHeight = spaceBelow - SPACE_AROUND;
      }

      if (
        $contextMenu.align === 'right' ||
        windowWidth - $contextMenu.coordinates.x < menuWidth
      ) {
        right = windowWidth - $contextMenu.coordinates.x;
      } else {
        left = $contextMenu.coordinates.x;
      }
    }
  }

  function getStyleDeclaration(property, value) {
    if (typeof value === 'string') return `${property}: ${value};`;
    return `${property}: ${value}px;`;
  }

  function shouldRenderAbove(spaceBelow, spaceAbove) {
    return spaceBelow < menuHeight && spaceAbove > spaceBelow;
  }

  function handleKeydown(event) {
    if (event.keyCode !== 27) return;
    contextMenu.close();
  }

  function onItemClick(callback, args, { shouldClose = true } = {}) {
    if (shouldClose) {
      contextMenu.close();
    }
    callback(...args);
  }
</script>

<svelte:window
  on:keydown="{handleKeydown}"
  bind:innerHeight="{windowHeight}"
  bind:innerWidth="{windowWidth}"
/>

{#if $contextMenu?.component}
  <ul
    style="{[
      getStyleDeclaration('top', top),
      getStyleDeclaration('bottom', bottom),
      getStyleDeclaration('max-height', maxHeight),
      getStyleDeclaration('width', width),
      getStyleDeclaration('left', left),
      getStyleDeclaration('right', right),
    ].join(' ')}"
    bind:offsetHeight="{menuHeight}"
    bind:offsetWidth="{menuWidth}"
    use:clickOutside="{contextMenu.close}"
    transition:fly="{{ duration: 125, y: -20 }}"
  >
    <svelte:component
      this="{$contextMenu.component}"
      {...$contextMenu.props}
      onItemClick="{onItemClick}"
    />
  </ul>
{/if}

<style>
  ul {
    position: absolute;
    padding: 0;
    margin: 0;
    background-color: var(--color-context-menu-background);
    white-space: nowrap;
    padding: 9px 0;
    font-size: 12px;
    border-radius: 4px;
    box-shadow:
      0 1px 1px var(--color-context-menu-shadow-1),
      0 1px 3px 1px var(--color-context-menu-shadow-2),
      0 0 0 1px var(--color-context-menu-shadow-3);
    color: var(--color-context-menu-text);
    z-index: 15;
    overflow-y: auto;
  }

  ul > :global(li) {
    cursor: pointer;
    padding: 5px 15px;
    transition:
      background-color 250ms,
      color 250ms;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  ul > :global(li:hover) {
    background-color: var(--color-context-menu-background-hover);
    color: var(--color-context-menu-text-hover);
  }

  ul > :global(hr) {
    border: 0;
    border-top: solid 1px var(--color-context-menu-separator);
    margin: 5px 0;
  }
</style>
