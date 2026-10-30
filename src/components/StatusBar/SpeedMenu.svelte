<script>
  import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
  import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { session } from '~helpers/stores';
  import { getSize } from '~helpers/sizeHelper';
  import {
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SPEED,
    SESSION_COLUMN_ALT_SPEED_ENABLED,
  } from '~helpers/constants/columns';

  // direction: 'download' | 'upload'
  let { direction, rate } = $props();

  const UNLIMITED = 'unlimited';
  const speedLimit = session.speedLimit(direction);

  const perSize = $derived(
    $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SPEED] || 1000
  );
  const formatSpeed = (value, startSize) => {
    const { value: amount, size } = getSize(value, {
      isSpeed: true,
      startSize,
      perSize,
    });
    return `${amount} ${size}`;
  };
  const limits = $derived(
    [10, 100, 500, 1, 2, 5, 10, 25].map((value, index) =>
      // The first values are in kB/s, the rest in MB/s
      index < 3 ? value : value * perSize
    )
  );

  const handleChange = (value) => {
    const limit = value === UNLIMITED ? null : Number(value);
    session.updateSpeedLimit(
      direction,
      limit !== null,
      limit,
      $session[SESSION_COLUMN_ALT_SPEED_ENABLED]
    );
  };
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <button
        {...props}
        class="flex h-full items-center gap-1 rounded px-1.5 tabular-nums hover:bg-accent hover:text-accent-foreground {direction ===
        'download'
          ? 'text-(--color-download)'
          : 'text-(--color-upload)'}"
        title="{direction === 'download' ? 'Download' : 'Upload'} speed limit"
      >
        {#if direction === 'download'}
          <ArrowDownIcon class="size-3.5" />
        {:else}
          <ArrowUpIcon class="size-3.5" />
        {/if}
        <span class="text-foreground">{formatSpeed(rate, 'B')}</span>
        {#if $speedLimit !== null}
          <span class="text-muted-foreground">
            / {formatSpeed($speedLimit, 'kB')}
          </span>
        {/if}
      </button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content side="top" align="end" class="w-44">
    <DropdownMenu.Label>
      {direction === 'download' ? 'Download' : 'Upload'} limit
    </DropdownMenu.Label>
    <DropdownMenu.RadioGroup
      value={$speedLimit === null ? UNLIMITED : String($speedLimit)}
      onValueChange={handleChange}
    >
      <DropdownMenu.RadioItem value={UNLIMITED}
        >Unlimited</DropdownMenu.RadioItem
      >
      <DropdownMenu.Separator />
      {#each limits as limit (limit)}
        <DropdownMenu.RadioItem value={String(limit)}>
          {formatSpeed(limit, 'kB')}
        </DropdownMenu.RadioItem>
      {/each}
    </DropdownMenu.RadioGroup>
  </DropdownMenu.Content>
</DropdownMenu.Root>
