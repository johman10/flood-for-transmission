<script>
	import { cn } from "$lib/utils.js";
	let {
		ref = $bindable(null),
		class: className,
		inset,
		children,
		...restProps
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="context-menu-label"
	data-inset={inset}
	class={cn("text-muted-foreground px-1.5 py-1 text-xs font-medium data-inset:pl-7", className)}
	{...restProps}
>
	{@render children?.()}
</div>