<script>
  import Input from '~components/Input';

  export let values;
  export let type = 'text';

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
  {#each values as value, index}
    <Input
      type="{type}"
      bind:value
      addons="{getAddons(index)}"
      {...$$restProps}
    />
  {/each}
</div>

<style>
  .list > :global(.container) {
    margin: 0 0 8px;
  }
</style>
