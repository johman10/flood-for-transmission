<script>
  export let activePage;
  export let pages;
</script>

<div class="menu">
  <h1>Settings</h1>

  <ul class="items">
    {#each pages as page}
      <li
        class:active="{page.id === activePage.id}"
        on:click="{() => {
          activePage = page;
        }}"
      >
        {page.name}
      </li>
    {/each}
  </ul>
</div>

<style>
  .menu {
    overflow: hidden;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    flex-basis: 175px;
    flex-shrink: 0;
    line-height: 1.25;
    border-right: solid 1px var(--color-modal-menu-border);
  }

  h1 {
    color: var(--color-modal-header);
    font-weight: 500;
    font-size: 20px;
    padding: 0 25px 5px;
  }

  ul {
    font-weight: 500;
    font-size: 13px;
    color: var(--color-modal-tab-label);
  }

  li {
    display: block;
    margin-right: 0;
    padding: 5px 10px 5px 25px;
    border-right: solid 1px transparent;
    transition: border-color 0.25s, color 0.25s;
    cursor: pointer;
  }

  li.active {
    color: var(--color-modal-tab-label-active);
    font-weight: 700;
    border-color: var(--color-modal-tab-label-active);
  }
</style>
