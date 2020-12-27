<script>
  import Icon from '~components/Icon';
  import { torrents, modals, selectedTorrents, panel } from '~helpers/stores';

  const togglePanel = () => {
    panel.toggle();
  }

  const handleStart = () => {
    torrents.start($selectedTorrents);
  };

  const handleStop = () => {
    torrents.stop($selectedTorrents);
  };

  const handleAdd = () => {
    modals.open('add');
  };

  const handleRemove = () => {
    modals.open('remove');
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
        <Icon name="StartIcon" viewBox="0 0 60 60" />
      </button>
      <button class="button" on:click="{handleStop}">
        <Icon name="StopIcon" viewBox="0 0 60 60" />
      </button>
    </div>
    <div class="divider"></div>
    <div class="group">
      <button class="button" on:click="{handleAdd}">
        <Icon name="Add" viewBox="0 0 60 60" />
      </button>
      <button class="button" on:click="{handleRemove}">
        <Icon name="Remove" viewBox="0 0 60 60" />
      </button>
    </div>
  </div>
</nav>

<style>
  .header {
    background: #e9eef2;
    border-bottom: 1px solid rgba(41, 51, 65, 0.15);
    color: #1b1a1c;
    display: flex;
    flex: 0 0 30px;
    height: 30px;
    justify-content: space-between;
    fill: #8899a8;
    transition: fill 0.25s;
  }

  .right {
    display: flex;
  }

  .left {

  }

  .button > :global(.icon) {
    height: 18px;
    width: 18px;
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
    box-shadow: 1px 0 rgba(51, 62, 74, 0.15), -1px 0 rgba(51, 62, 74, 0.15);
    fill: #258de5;
  }

  .divider {
    background: rgba(122, 128, 128, 0.15);
    height: 100%;
    left: 0;
    width: 1px;
  }
</style>
