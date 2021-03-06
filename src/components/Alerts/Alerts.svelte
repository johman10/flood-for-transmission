<script>
  import { fade } from 'svelte/transition';
  import { alerts } from '~helpers/stores';
  import Icon from '~components/Icon';
</script>

{#if $alerts.length}
  <ul class="alert-container" transition:fade={{ duration: 250 }}>
    {#each $alerts as alert}
      <li class="alert {alert.type}">
        <Icon
          name="{alert.type === 'positive'
            ? 'CircleCheckmarkIcon'
            : 'CircleExclamationIcon'}"
        />
        <span class="message">{alert.message}</span>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .alert-container {
    --icon-color: #e95779;

    background: rgba(41, 51, 65, 0.95);
    border-radius: 3px;
    bottom: 5px;
    color: #8fa2b2;
    font-size: 0.85rem;
    padding: 10px 15px;
    position: fixed;
    right: 5px;
    transition: opacity 0.25s;
    width: 250px;
    z-index: 20;
  }

  .alert {
    display: flex;
    fill: var(--icon-color);
    margin-bottom: 10px;
  }

  .alert:last-child {
    margin-bottom: 0px;
  }

  .alert.positive {
    --icon-color: #39ce83;
  }

  .alert > :global(.icon) {
    flex: 0 0 20px;
  }

  .message {
    flex: 1 1 auto;
    margin-left: 5px;
  }
</style>
