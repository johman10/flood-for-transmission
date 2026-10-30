<script>
  import { createEventDispatcher } from 'svelte';
  import LoaderIcon from '@lucide/svelte/icons/loader-circle';
  import { buttonVariants } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils.js';

  const dispatch = createEventDispatcher();

  // primary/secondary are filled, tertiary/quaternary are outlined,
  // destructive is for irreversible actions
  export let priority = 'primary';
  export let type = 'button';
  export let loading = false;

  const VARIANTS = {
    primary: 'default',
    secondary: 'default',
    tertiary: 'outline',
    quaternary: 'outline',
    destructive: 'destructive',
  };

  const handleClick = (event) => {
    if (loading) return;
    dispatch('click', event);
  };
</script>

<button
  type={type}
  class={cn(
    'button',
    buttonVariants({ variant: VARIANTS[priority] ?? 'default' }),
    $$props.class
  )}
  aria-busy={loading}
  on:click={handleClick}
>
  {#if loading}
    <LoaderIcon class="animate-spin" />
  {:else}
    <slot />
  {/if}
</button>
