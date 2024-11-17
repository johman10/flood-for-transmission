<script>
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  let { viewBox } = $props();
</script>

<svg onclick={bubble('click')} class="icon" viewBox={viewBox}>
  <path d="M53.7,25.3H6.3v9.4h47.4"></path>
</svg>
