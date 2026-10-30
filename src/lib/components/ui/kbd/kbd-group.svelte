<script>
	import { cn } from "$lib/utils.js";
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	} = $props();
</script>

<kbd
	bind:this={ref}
	data-slot="kbd-group"
	class={cn("gap-1 inline-flex items-center", className)}
	{...restProps}
>
	{@render children?.()}
</kbd>