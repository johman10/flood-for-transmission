<script>
  import Input from '~components/Input';
  import Icon from '~components/Icon';
  import { filters } from '~helpers/stores';

  let currentValue = $filters.search;

  let timer;
  const debounce = (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      filters.update((currentFilters) => ({
        ...currentFilters,
        search: e.target.value,
      }));
    }, 500);
  };
</script>

<div class="wrapper" class:active="{$filters.search}">
  <Icon name="Search" />
  <Input
    placeholder="Search torrents"
    bind:value="{currentValue}"
    on:input="{debounce}"
  />
</div>

<style>
  .wrapper {
    position: relative;
  }

  .wrapper > :global(.icon) {
    fill: var(--color-search-icon);
    height: 22px;
    left: 17px;
    pointer-events: none;
    position: absolute;
    top: 50%;
    transition: fill 0.25s;
    transform: translateY(-50%);
    width: 22px;
  }

  .wrapper :global(.input) {
    border: 1px solid var(--color-search-border);
    border-left: none;
    border-right: none;
    border-radius: 0;
    background-color: var(--color-search-background);
    display: block;
    font-size: 16px;
    outline: none;
    padding: 12px 0 12px 45px;
    transition: background-color 0.25s, border 0.25s;
    width: 100%;
    height: auto;
  }

  .wrapper :global(.input::placeholder) {
    color: var(--color-search-placeholder);
    font-style: italic;
    transition: color 0.25s;
  }

  .wrapper.active :global(.input),
  .wrapper:focus-within :global(.input) {
    color: var(--color-search-text);
    background: var(--color-search-background-active);
    border-bottom: 1px solid var(--color-search-border-active);
    border-top: 1px solid var(--color-search-border-active);
    padding-right: 45px;
  }

  .wrapper.active > :global(.icon),
  .wrapper:focus-within > :global(.icon) {
    fill: var(--color-search-icon-active);
    opacity: 1;
  }
</style>
