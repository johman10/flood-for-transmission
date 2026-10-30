<script context="module">
  let num = 0;
</script>

<script>
  import { createEventDispatcher } from 'svelte';
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import CheckIcon from '@lucide/svelte/icons/check';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

  export let options;
  export let placeholder = '';
  export let direction = 'above';
  export let value = null;
  export let label = null;

  num += 1;
  const id = `select-${num}`;
  const dispatch = createEventDispatcher();

  $: selectedLabel = options.find((option) => option.value === value)?.label;
</script>

<div class="select mb-3 flex flex-col gap-1.5">
  {#if label}
    <label class="truncate text-xs font-medium text-muted-foreground" for={id}>
      {label}
    </label>
  {/if}
  <DropdownMenu.Root>
    <DropdownMenu.Trigger
      id={id}
      class="flex h-8 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-[state=open]:border-ring dark:bg-input/30"
    >
      <span class="truncate {selectedLabel ? '' : 'text-muted-foreground'}">
        {selectedLabel || placeholder}
      </span>
      <ChevronDownIcon class="size-4 shrink-0 text-muted-foreground" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content
      side={direction === 'above' ? 'top' : 'bottom'}
      align="start"
      class="w-(--bits-dropdown-menu-anchor-width) min-w-32"
    >
      {#each options as option (option.label)}
        <DropdownMenu.Item onSelect={() => dispatch('change', option.value)}>
          <span class="flex-1">{option.label}</span>
          {#if option.value === value}<CheckIcon />{/if}
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
