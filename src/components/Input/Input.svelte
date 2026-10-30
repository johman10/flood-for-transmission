<script context="module">
  let num = 0;
</script>

<script>
  import PlusIcon from '@lucide/svelte/icons/plus';
  import MinusIcon from '@lucide/svelte/icons/minus';
  import SearchIcon from '@lucide/svelte/icons/search';
  import { cn } from '$lib/utils.js';

  num += 1;

  export let label = null;
  export let value;
  export let type = 'text';
  export let hint = null;
  export let validationMessage = '';
  // [{ iconName: 'Add' | 'Remove' | 'Search', onClick, label? }]
  export let addons = [];
  export let input = null;
  export let id = `input-text-${num}`;
  export let disabled = false;

  const ADDON_ICONS = { Add: PlusIcon, Remove: MinusIcon, Search: SearchIcon };
  const ADDON_LABELS = { Add: 'Add', Remove: 'Remove', Search: 'Browse' };

  const SUPPORTED_TYPES = ['text', 'number', 'time', 'url'];
  $: if (!SUPPORTED_TYPES.includes(type)) {
    console.error(`Invalid type received, ${type}`);
  }

  $: addonCount = addons.length + ($$slots.addon ? 1 : 0);
  // A class passed by the parent is merged instead of replacing the styling
  $: ({ class: extraClass, ...inputProps } = $$restProps);

  const handleInvalid = (e) => {
    if (!validationMessage) return;
    e.target.setCustomValidity(validationMessage);
  };
</script>

<div class="input-container mb-3 flex flex-col gap-1.5">
  {#if label}
    <label class="truncate text-xs font-medium text-muted-foreground" for={id}>
      {label}
    </label>
  {/if}
  <div class="relative">
    <input
      class={cn(
        'input h-8 w-full min-w-0 rounded-md border border-input bg-background px-2.5 text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive dark:bg-input/30 [&:user-invalid]:border-destructive',
        extraClass
      )}
      style:padding-right={addonCount ? `${addonCount * 28 + 6}px` : null}
      id={id}
      {...{ type }}
      bind:this={input}
      on:invalid={handleInvalid}
      on:input={(e) => e.target.setCustomValidity('')}
      on:paste
      bind:value={value}
      disabled={disabled}
      {...inputProps}
    />
    {#if addonCount}
      <div class="absolute inset-y-0 right-1 flex items-center gap-0.5">
        {#each addons as addon (addon.iconName)}
          <button
            type="button"
            class="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
            aria-label={addon.label ?? ADDON_LABELS[addon.iconName]}
            title={addon.label ?? ADDON_LABELS[addon.iconName]}
            disabled={disabled}
            on:click={addon.onClick}
          >
            <svelte:component
              this={ADDON_ICONS[addon.iconName]}
              class="size-3.5"
            />
          </button>
        {/each}
        <slot name="addon" />
      </div>
    {/if}
  </div>
  {#if hint}<span class="hint text-xs text-muted-foreground">{hint}</span>{/if}
</div>
