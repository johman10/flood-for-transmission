<script>
  import Input from '~components/Input';
  import { Paths as PathsContextMenu } from '~components/ContextMenu';
  import { contextMenu } from '~helpers/stores';

  let { value = $bindable(), ...rest } = $props();

  let input = $state();

  function onPathSelect(path) {
    value = path;
  }

  function togglePopup() {
    contextMenu.open({
      element: input,
      matchElementWidth: true,
      component: PathsContextMenu,
      props: {
        onPathSelect,
      },
    });
  }
</script>

<Input
  type="text"
  bind:input={input}
  bind:value={value}
  addons={[{ iconName: 'Search', onClick: togglePopup, iconSize: '18px' }]}
  {...rest}
/>
