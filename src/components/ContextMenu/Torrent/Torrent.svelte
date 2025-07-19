<script>
  import PriorityIndicator from '~components/PriorityIndicator';

  export let onItemClick;
  export let prio;
  export let onStart;
  export let onStartNow;
  export let onStop;
  export let onRemove;
  export let onVerify;
  export let onCopyMagnetLink;
  export let onAsk;
  export let onLabels;
  export let onLocation;
  export let onPrio;

  let priorityIndicator;

  const clickOnPriorityIndicator = () => {
    priorityIndicator.$capture_state().element.click();
  };
</script>

<li on:click={(...args) => onItemClick(onStart, args)}>Start</li>
<li on:click={(...args) => onItemClick(onStartNow, args)}>Start now</li>
<li on:click={(...args) => onItemClick(onStop, args)}>Stop</li>
<li on:click={(...args) => onItemClick(onRemove, args)}>Remove</li>
<li on:click={(...args) => onItemClick(onVerify, args)}>Verify local data</li>
<li on:click={(...args) => onItemClick(onCopyMagnetLink, args)}>
  Copy magnet link
</li>
<li on:click={(...args) => onItemClick(onAsk, args)}>
  Ask tracker for more peers
</li>
<hr />
<li on:click={(...args) => onItemClick(onLabels, args)}>Set labels</li>
<li on:click={(...args) => onItemClick(onLocation, args)}>Set location</li>
<hr />
<li on:click={clickOnPriorityIndicator}>
  Priority
  <PriorityIndicator
    bind:this={priorityIndicator}
    value={prio}
    on:click={(event, ...args) => {
      onItemClick(onPrio, [event, ...args], { shouldClose: false });
      prio = event.detail;
    }}
  />
</li>
