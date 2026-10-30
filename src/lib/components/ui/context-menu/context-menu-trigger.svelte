<script>
	import { ContextMenu as ContextMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	} = $props();
</script>

<ContextMenuPrimitive.Trigger
	bind:ref
	data-slot="context-menu-trigger"
	class={cn("select-none", className)}
	{...restProps}
/>