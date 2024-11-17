<script>
  import Icon from '~components/Icon';
  import Checkbox from '~components/Checkbox';

  let {
    checked = $bindable(false),
    group = null,
    value = null,
    iconName,
    onchange,
  } = $props();
</script>

<div class="icon-checkbox" class:selected={group?.includes(value) || checked}>
  <Checkbox
    onchange={onchange}
    group={group}
    value={value}
    bind:checked={checked}
  />
  <Icon name={iconName} />
</div>

<style>
  .icon-checkbox:hover > :global(.icon),
  .icon-checkbox.selected > :global(.icon) {
    opacity: 0;
  }

  .icon-checkbox:hover > :global(.checkbox),
  .icon-checkbox.selected > :global(.checkbox) {
    opacity: 1;
  }

  .icon-checkbox {
    position: relative;
    width: 18px;
    height: 18px;
    margin-right: 5px;
    flex-shrink: 0;
  }

  .icon-checkbox > :global(.icon) {
    position: absolute;
    height: 14px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    transition: opacity 0.2s ease-in-out;
  }

  .icon-checkbox > :global(.checkbox) {
    position: absolute;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    right: 0;
  }
</style>
