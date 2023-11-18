<script>
  import Url from './Url';
  import Create from './Create';
  import File from './File';
  import Icon from '~components/Icon';
  import { session } from '~helpers/stores';
  import {
    SESSION_COLUMN_DOWNLOAD_DIR,
    SESSION_COLUMN_START_ADDED,
  } from '~helpers/constants/columns';

  let loadingInitial = true;
  let tab = 'url';
  let destination = null;
  let start = null;

  session
    .addColumns([SESSION_COLUMN_DOWNLOAD_DIR, SESSION_COLUMN_START_ADDED])
    .then(($session) => {
      destination = $session[SESSION_COLUMN_DOWNLOAD_DIR];
      start = $session[SESSION_COLUMN_START_ADDED];
    })
    .finally(() => {
      loadingInitial = false;
    });
</script>

<h1>Add Torrents</h1>
<ul class="tabs">
  <li on:click="{() => (tab = 'url')}" class:active="{tab === 'url'}">
    By URL or hash
  </li>
  <li on:click="{() => (tab = 'file')}" class:active="{tab === 'file'}">
    By File
  </li>
  <li on:click="{() => (tab = 'create')}" class:active="{tab === 'create'}">
    Create Torrent
  </li>
</ul>

<div class="content" class:loading-initial="{loadingInitial}">
  <Icon name="SpinnerIcon" />
  {#if tab === 'url'}
    <Url bind:start={start} bind:destination={destination} />
  {:else if tab === 'file'}
    <File bind:start={start} bind:destination={destination} />
  {:else if tab === 'create'}
    <Create />
  {/if}
</div>

<style>
  h1 {
    color: var(--color-modal-header);
    font-size: 20px;
    font-weight: 500;
    padding: 20px 25px 0;
  }

  ul {
    color: var(--color-modal-tab-label);
    font-size: 13px;
    font-weight: 500;
    margin: 5px 0 0;
    padding: 0 25px;
    box-shadow: inset 0 -1px 0 var(--color-modal-add-tab-bar-shadow);
  }

  li {
    cursor: pointer;
    display: inline-block;
    margin-right: 15px;
    padding: 5px 0 10px 0;
    position: relative;
  }

  li.active {
    color: var(--color-modal-tab-label-active);
    font-weight: 700;
  }

  li.active::after {
    background-color: var(--color-modal-tab-label-active);
    bottom: 0;
    content: '';
    height: 1px;
    left: 0;
    position: absolute;
    right: 0;
  }

  .content {
    overflow-y: auto;
    padding: 20px 25px 20px 25px;
    color: var(--color-modal-text);
    position: relative;
  }

  .content.loading-initial {
    display: flex;
    align-items: center;
    justify-content: center;
    fill: var(--color-modal-loading);
  }

  .content > :global(.icon) {
    position: absolute;
    height: 30px;
    width: 30px;
    display: none;
  }

  .content.loading-initial > :global(.icon) {
    display: inherit;
  }

  .content.loading-initial form {
    visibility: hidden;
  }
</style>
