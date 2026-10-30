<script>
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

	let { ...restProps } = $props();
</script>

<DropdownMenuPrimitive.Portal {...restProps} />