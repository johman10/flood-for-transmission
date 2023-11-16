<script>
  import Icon from '~components/Icon';
  import { Add, Remove } from '~components/Modal';
  import { torrents, modals, selectedTorrents, panel } from '~helpers/stores';

  const togglePanel = () => {
    panel.toggle();
  };

  const handleStart = () => {
    torrents.start($selectedTorrents);
  };

  const handleStop = () => {
    torrents.stop($selectedTorrents);
  };

  const handleAdd = () => {
    modals.open({ component: Add });
  };

  const handleRemove = () => {
    modals.open({ component: Remove });
  };
</script>

<nav class="header">
  <div class="left">
    <div class="group">
      <button class="button" on:click="{togglePanel}">
        <Icon name="MenuIcon" viewBox="0 0 60 60" />
      </button>
    </div>
  </div>
  <div class="right">
    <div class="group">
      <button class="button" on:click="{handleStart}">
        <Icon name="StartIcon" />
      </button>
      <button class="button" on:click="{handleStop}">
        <Icon name="StopIcon" />
      </button>
    </div>
    <div class="divider"></div>
    <div class="group">
      <button class="button" on:click="{handleAdd}">
        <Icon name="Add" />
      </button>
      <button class="button" on:click="{handleRemove}">
        <Icon name="Remove" />
      </button>
    </div>
  </div>
</nav>

<style>
  .header {
    background: var(--color-top-bar-background);
    border-bottom: 1px solid var(--color-top-bar-border);
    color: var(--color-top-bar-text);
    display: flex;
    flex: 0 0 30px;
    height: 30px;
    justify-content: space-between;
    fill: var(--color-top-bar-inactive);
    transition: fill 0.25s;
  }

  .right {
    display: flex;
  }

  .button > :global(.icon) {
    height: 16px;
    width: 16px;
  }

  .group {
    padding: 0 10px;
    display: flex;
    height: 100%;
  }

  .button {
    background-color: transparent;
    border: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    width: 46px;
  }

  .button:hover {
    background: rgba(51, 62, 74, 0.05);
    box-shadow:
      1px 0 rgba(51, 62, 74, 0.15),
      -1px 0 rgba(51, 62, 74, 0.15);
    fill: var(--color-top-bar-active);
  }

  .divider {
    background: rgba(122, 128, 128, 0.15);
    height: 100%;
    left: 0;
    width: 1px;
  }
</style>
