<script>
  export let value;
  export let torrentStatusClass = null;
  export const column = null;

  let year;
  let month;
  let day;
  $: {
    const date = new Date(value * 1000);
    year = date.getFullYear();
    month = date.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    day = date.getDate();
    day = day < 10 ? `0${day}` : day;
  }
</script>

{#if value > 0}{year}-{month}-{day}{:else}-{/if}
