<script>
  import FolderOpenIcon from '@lucide/svelte/icons/folder-open';
  import SettingsIcon from '@lucide/svelte/icons/settings';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import Input from '~components/Input';
  import { Settings } from '~components/Modal';
  import { paths, modals } from '~helpers/stores';

  export let value;

  const openPathSettings = () => {
    modals.open({
      component: Settings,
      large: true,
      props: { activePageId: 'user-interface' },
    });
  };
</script>

<Input type="text" bind:value={value} {...$$restProps}>
  <DropdownMenu.Root slot="addon">
    <DropdownMenu.Trigger
      class="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      aria-label="Common paths"
      title="Common paths"
    >
      <FolderOpenIcon class="size-3.5" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end" class="max-w-96 min-w-56">
      <DropdownMenu.Label>Common paths</DropdownMenu.Label>
      {#each $paths as path (path)}
        <DropdownMenu.Item onSelect={() => (value = path)}>
          <span class="truncate">{path}</span>
        </DropdownMenu.Item>
      {:else}
        <div class="px-2 py-1.5 text-xs text-muted-foreground">
          No common paths configured yet.
        </div>
      {/each}
      <DropdownMenu.Separator />
      <DropdownMenu.Item onSelect={openPathSettings}>
        <SettingsIcon />
        Manage paths…
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</Input>
