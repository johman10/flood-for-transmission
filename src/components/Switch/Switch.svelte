<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let checked;

  const handleClick = () => {
    checked = !checked;
    dispatch('change', checked);
  };
</script>

<div class:checked on:click="{handleClick}"></div>

<style>
  div {
    background-color: #abbac7;
    width: 32px;
    height: 20px;
    border-radius: 10px;
    position: relative;
    margin: 0;
    padding: 0;
    border: 0;
    transition: background-color 0.3s cubic-bezier(0.35, 0, 0.25, 1);
    cursor: pointer;
    outline: none;
    flex-shrink: 0;
  }

  div::after {
    content: '';
    height: 14px;
    width: 14px;
    position: absolute;
    left: 3px;
    top: 3px;
    border-radius: 50%;
    background-color: #fff;
    transition: transform 0.3s cubic-bezier(0.35, 0, 0.25, 1);
    transform: 0;
  }

  .checked {
    background-color: #258de5;
  }

  .checked::after {
    transform: translateX(12px);
  }
</style>
