<script>
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

	let { open = $bindable(false), ...restProps } = $props();
</script>

<DropdownMenuPrimitive.Root bind:open {...restProps} />