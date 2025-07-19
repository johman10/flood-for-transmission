<script>
  import { fade } from 'svelte/transition';
  import { alerts } from '~helpers/stores';
  import Icon from '~components/Icon';
</script>

{#if $alerts.length}
  <ul class="alert-container" transition:fade={{ duration: 250 }}>
    {#each $alerts as alert (alert.id)}
      <li class="alert {alert.type}">
        <Icon
          name={alert.type === 'positive'
            ? 'CircleCheckmarkIcon'
            : 'CircleExclamationIcon'}
        />
        <span class="message">{alert.message}</span>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .alert-container {
    background: var(--color-alert-background);
    border-radius: 3px;
    bottom: 5px;
    color: var(--color-alert-text);
    font-size: 0.85rem;
    padding: 10px 15px;
    position: fixed;
    right: 5px;
    width: 250px;
    z-index: 20;
  }

  .alert {
    display: flex;
    margin-bottom: 10px;
  }

  .alert:last-child {
    margin-bottom: 0px;
  }

  .alert.positive {
    fill: var(--color-alert-positive);
  }

  .alert.negative {
    fill: var(--color-alert-negative);
  }

  .alert > :global(.icon) {
    flex: 0 0 20px;
  }

  .message {
    flex: 1 1 auto;
    margin-left: 5px;
  }
</style>
