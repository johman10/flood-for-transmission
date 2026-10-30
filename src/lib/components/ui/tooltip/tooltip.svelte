<script>
	import { Tooltip as TooltipPrimitive } from "bits-ui";

	let { open = $bindable(false), ...restProps } = $props();
</script>

<TooltipPrimitive.Root bind:open {...restProps} />