import Content from "./tabs-content.svelte";
import Trigger from "./tabs-trigger.svelte";
import Root from "./tabs.svelte";
import List, { tabsListVariants, } from "./tabs-list.svelte";

export {
	Root,
	Content,
	List,
	Trigger,
	tabsListVariants,

	//
	Root as Tabs,
	Content as TabsContent,
	List as TabsList,
	Trigger as TabsTrigger,
};