<script>
  import { scale, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import XIcon from '@lucide/svelte/icons/x';
  import { modals } from '~helpers/stores';

  const handleKeydown = (event) => {
    if (event.key !== 'Escape') return;
    modals.close();
  };
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $modals && $modals.component}
  <div class="modal fixed inset-0 z-40" role="dialog" aria-modal="true">
    <div
      class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      on:click={modals.close}
      transition:fade={{ duration: 150 }}
    ></div>
    <div
      class="content absolute flex flex-col overflow-hidden rounded-xl border bg-background text-foreground shadow-2xl"
      class:large={$modals.large}
      transition:scale={{ duration: 150, start: 0.97, easing: cubicOut }}
    >
      <button
        class="absolute top-3 right-3 z-10 flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        aria-label="Close"
        on:click={modals.close}
      >
        <XIcon class="size-4" />
      </button>
      <svelte:component this={$modals.component} {...$modals.props || {}} />
    </div>
  </div>
{/if}

<style>
  .content {
    max-height: 85%;
    max-width: 90%;
    width: 520px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .content.large {
    width: 960px;
    height: 85%;
  }

  @media (max-width: 700px) {
    .content,
    .content.large {
      width: 100vw;
      max-width: 100%;
      transform: translate(-50%, 0);
      bottom: 0;
      top: auto;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
</style>
