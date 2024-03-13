<script>
  import Input from '~components/Input';

  export let values;
  export let type = 'text';
  export let label = null;

  $: {
    if (!values.length) {
      values = [''];
    }
  }

  function handlePaste(index, e) {
    // Prevent the original value from actually being pasted
    e.preventDefault();

    const pastedValues = e.clipboardData.getData("text").split('\n').map(url => url.trim()).filter(Boolean)
    const clonedValues = [...values];
    if (clonedValues[index]) {
      clonedValues.splice(index + 1, 0, ...pastedValues);
    } else {
      clonedValues.splice(index, 1, ...pastedValues);
    }
    values = clonedValues;
  }

  function getAddons(index) {
    const addons = [
      {
        iconName: 'Add',
        onClick: addEmptyItem.bind(this, index),
        iconSize: '14px',
      },
    ];

    if (index !== 0) {
      addons.unshift({
        iconName: 'Remove',
        onClick: removeItem.bind(this, index),
        iconSize: '14px',
      });
    }

    return addons;
  }

  function addEmptyItem(index) {
    const clonedValues = [...values];
    clonedValues.splice(index + 1, 0, '');
    values = clonedValues;
  }

  function removeItem(index) {
    const clonedValues = [...values];
    clonedValues.splice(index, 1);
    values = clonedValues;
  }
</script>

<div class="list">
  {#if label}
    <label class="label" for="input-multiple-{values.length - 1}">
      {label}
    </label>
  {/if}
  {#each values as value, index}
    <Input
      id="input-multiple-{index}"
      type="{type}"
      bind:value="{value}"
      addons="{getAddons(index)}"
      on:paste="{(e) => handlePaste(index, e)}"
      {...$$restProps}
    />
  {/each}
</div>

<style>
  label {
    display: block;
    font-size: 13px;
    margin-bottom: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .list > :global(.input-container) {
    margin: 0 0 8px;
  }
</style>
