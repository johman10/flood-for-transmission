<script>
  import { fly } from 'svelte/transition';
  import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
  import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
  import XIcon from '@lucide/svelte/icons/x';
  import { alerts } from '~helpers/stores';
</script>

<ul
  class="pointer-events-none fixed right-3 bottom-10 z-50 flex w-80 flex-col gap-2"
>
  {#each $alerts as alert (alert.id)}
    <li
      class="pointer-events-auto flex items-start gap-2.5 rounded-lg border bg-popover p-3 text-sm text-popover-foreground shadow-lg"
      role="status"
      transition:fly={{ y: 12, duration: 200 }}
    >
      {#if alert.type === 'positive'}
        <CircleCheckIcon class="mt-px size-4 shrink-0 text-positive" />
      {:else}
        <CircleAlertIcon class="mt-px size-4 shrink-0 text-destructive" />
      {/if}
      <span class="flex-1">{alert.message}</span>
      <button
        class="text-muted-foreground hover:text-foreground"
        aria-label="Dismiss"
        on:click={() => alerts.remove(alert.id)}
      >
        <XIcon class="size-3.5" />
      </button>
    </li>
  {/each}
</ul>
