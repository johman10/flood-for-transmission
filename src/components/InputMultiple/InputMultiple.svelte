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
      bind:value
      addons="{getAddons(index)}"
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

  .list > :global(.container) {
    margin: 0 0 8px;
  }
</style>
