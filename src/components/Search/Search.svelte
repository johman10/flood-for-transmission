<script>
  import Input from '~components/Input';
  import Icon from '~components/Icon';
  import { filters } from '~helpers/stores';
</script>

<div class="wrapper" class:in-use="{$filters.search}">
  <Icon name="Search" />
  <Input placeholder="Search torrents" bind:value="{$filters.search}" />
</div>

<style>
  .wrapper {
    position: relative;
  }

  .wrapper.in-use :global(.input) {
    background: rgba(37, 141, 229, 0.25);
    border-bottom: 1px solid rgba(37, 141, 229, 0.3);
    border-top: 1px solid rgba(37, 141, 229, 0.3);
    color: #258de5;
    padding-right: 45px;
  }

  .wrapper.in-use > :global(.icon) {
    fill: #258de5;
    opacity: 1;
  }

  .wrapper > :global(.icon) {
    fill: #53718a;
    height: 22px;
    left: 17px;
    opacity: 0.5;
    pointer-events: none;
    position: absolute;
    top: 50%;
    transition: fill 0.25s, opacity 0.25s;
    transform: translateY(-50%);
    width: 22px;
  }

  .wrapper :global(.input) {
    border: 1px solid rgba(9, 24, 36, 0.4);
    border-left: none;
    border-right: none;
    border-radius: 0;
    background-color: rgba(9, 24, 36, 0.3);
    color: #53718a;
    display: block;
    font-size: 16px;
    outline: none;
    padding: 12px 0 12px 45px;
    transition: background-color 0.25s, border 0.25s, color 0.25s;
    width: 100%;
    height: auto;
  }

  .wrapper :global(.input::placeholder) {
    color: rgba(83, 113, 138, 0.4);
    font-style: italic;
    transition: color 0.25s;
  }
</style>
