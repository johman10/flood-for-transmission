<script>
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  let { viewBox } = $props();
</script>

<svg onclick={bubble('click')} class="icon" viewBox={viewBox}>
  <path d="M53.7 25.3h-19v-19h-9.4v19h-19v9.4h19v19h9.4v-19h19"></path>
</svg>
