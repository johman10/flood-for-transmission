<script>
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  let { viewBox } = $props();
</script>

<svg onclick={bubble('click')} class="icon" viewBox={viewBox}>
  <path
    d="M34.3,51.3h-8.5v-9h8.5V51.3z M34.3,36.4h-8.5L23.6,8.7h12.7L34.3,36.4z"
  ></path>
</svg>
