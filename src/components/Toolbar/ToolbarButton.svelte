<script>
  import { Button } from '$lib/components/ui/button/index.js';
  import { Kbd } from '$lib/components/ui/kbd/index.js';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';

  let {
    label,
    shortcut = null,
    disabled = false,
    onclick,
    children,
  } = $props();
</script>

<Tooltip.Root>
  <Tooltip.Trigger>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="ghost"
        size="icon-sm"
        aria-label={label}
        disabled={disabled}
        onclick={onclick}
      >
        {@render children()}
      </Button>
    {/snippet}
  </Tooltip.Trigger>
  <Tooltip.Content>
    {label}
    {#if shortcut}<Kbd>{shortcut}</Kbd>{/if}
  </Tooltip.Content>
</Tooltip.Root>
