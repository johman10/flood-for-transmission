<script>
  import Input from '~components/Input';
  import { Paths as PathsContextMenu } from '~components/ContextMenu';
  import { contextMenu } from '~helpers/stores';

  export let value;

  let input;

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
  bind:input
  bind:value
  addons="{[{ iconName: 'Search', onClick: togglePopup, iconSize: '18px' }]}"
  {...$$restProps}
/>
