<script>
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  let { viewBox } = $props();
</script>

<svg onclick={bubble('click')} class="icon" viewBox={viewBox}>
  <path d="M11.9 11.9H48v36.2H11.9V11.9z"></path>
</svg>
