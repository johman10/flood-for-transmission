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
  <!-- TODO: Add free space for download directories based on configuration (how expensive will it be to make that request every x seconds?) -->
</div>

<style>
  div {
    grid-area: panel;
    background: #293341;
    color: #526780;
    overflow-y: auto;
    height: 100vh;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  div::-webkit-scrollbar {
    display: none;
  }
</style>
