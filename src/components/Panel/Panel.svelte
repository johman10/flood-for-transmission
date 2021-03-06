<script>
  import Graph from '~components/Graph';
  import Actions from '~components/Panel/Actions.svelte';
  import Search from '~components/Search';
  import Filters from '~components/Filters';
</script>

<div>
  <Actions />
  <Graph />
  <Search />
  <Filters />
</div>

<style>
  div {
    grid-area: panel;
    background: var(--color-background);
    overflow-y: auto;
    height: 100vh;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  div::-webkit-scrollbar {
    display: none;
  }
</style>
