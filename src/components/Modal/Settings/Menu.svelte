<script>
  let { activePageId = $bindable(), pages } = $props();
</script>

<div class="menu">
  <h1>Settings</h1>

  <ul class="items">
    {#each pages as page}
      <li
        class:active={page.id === activePageId}
        onclick={() => {
          activePageId = page.id;
        }}
      >
        {page.name}
      </li>
    {/each}
  </ul>
</div>

<style>
  .menu {
    overflow: hidden;
    padding: 20px 0 0 20px;
    display: flex;
    flex-direction: column;
    line-height: 1.25;
    border-right: solid 1px var(--color-modal-menu-border);
    grid-area: menu;
  }

  h1 {
    color: var(--color-modal-header);
    font-weight: 500;
    font-size: 20px;
    padding: 0 5px 5px;
  }

  ul {
    font-weight: 500;
    font-size: 13px;
    color: var(--color-modal-tab-label);
  }

  li {
    display: block;
    margin-right: 0;
    padding: 5px;
    border-right: solid 1px transparent;
    transition:
      border-color 0.25s,
      color 0.25s;
    cursor: pointer;
  }

  li.active {
    color: var(--color-modal-tab-label-active);
    font-weight: 700;
    border-color: var(--color-modal-tab-label-active);
  }

  @media (max-width: 700px) {
    .menu {
      padding: 20px 20px 0 20px;
    }

    ul {
      display: flex;
      flex-wrap: wrap;
    }

    li {
      border-right: 0;
      border-bottom: solid 1px transparent;
    }
  }
</style>
