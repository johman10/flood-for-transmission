<script>
  import { onMount } from 'svelte';
  import { scale, fade } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import { modals } from '~helpers/stores';
  import Add from './Add';
  import Remove from './Remove';
  import Settings from './Settings';
  import Labels from './Labels';
  import Location from './Location';
  import TorrentDetail from './TorrentDetail';

  const handleKeydown = (event) => {
    if (event.keyCode !== 27) return;
    modals.close();
  };

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

{#if $modals}
  <div class="modal">
    <div
      class="background"
      on:click="{modals.close}"
      transition:fade="{{ duration: 250, easing: cubicInOut }}"
    ></div>
    <div
      class="content"
      class:large="{$modals === 'settings' || $modals[0] === 'torrent-detail'}"
      transition:scale="{{ duration: 250, easing: cubicInOut }}"
    >
      {#if $modals === 'add'}
        <Add />
      {:else if $modals === 'remove'}
        <Remove />
      {:else if $modals === 'settings'}
        <Settings />
      {:else if $modals === 'labels'}
        <Labels />
      {:else if $modals === 'location'}
        <Location />
      {:else if $modals[0] === 'torrent-detail'}
        <TorrentDetail torrentId="{$modals[1]}" />
      {/if}
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

  .background {
    background: rgba(11, 16, 20, 0.95);
    height: 100%;
    width: 100%;
  }

  .content {
    background: #3a4553;
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
