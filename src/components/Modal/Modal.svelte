<script>
  import { scale, fade } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import { modals } from '~helpers/stores';

  const handleKeydown = (event) => {
    if (event.keyCode !== 27) return;
    modals.close();
  };
</script>

<svelte:window on:keydown="{handleKeydown}" />

{#if $modals && $modals.component}
  <div class="modal">
    <div
      class="backdrop"
      on:click="{modals.close}"
      transition:fade="{{ duration: 250, easing: cubicInOut }}"
    ></div>
    <div
      class="content"
      class:large="{$modals.large}"
      transition:scale="{{ duration: 250, easing: cubicInOut }}"
    >
      <svelte:component this="{$modals.component}" {...$modals.props || {}} />
    </div>
  </div>
{/if}

<style>
  .modal {
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
  }

  .backdrop {
    background: var(--color-modal-backdrop);
    height: 100%;
    width: 100%;
  }

  .content {
    background: var(--color-modal-background);
    border-radius: 3px;
    max-height: 80%;
    max-width: 80%;
    width: 500px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    flex-direction: column;
    display: flex;
    overflow: hidden;
  }

  .content.large {
    width: 700px;
    height: 80%;
  }
</style>
