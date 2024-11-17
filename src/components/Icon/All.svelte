<script>
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  let { viewBox } = $props();
</script>

<svg onclick={bubble('click')} class="icon" viewBox={viewBox}>
  <polygon
    points="52,20.6 48.6,14.7 33.4,24 33.4,8.7 26.6,8.7 26.6,24 11.4,14.7 8,20.6
    23.4,30 8,39.4 11.4,45.3 26.6,36 26.6,51.3 33.4,51.3 33.4,36 48.6,45.3
    52,39.4 36.6,30 "
  ></polygon>
</svg>
