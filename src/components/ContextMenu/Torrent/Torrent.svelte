<script>
  import PriorityIndicator from '~components/PriorityIndicator';

  let {
    onItemClick,
    prio = $bindable(),
    onStart,
    onStartNow,
    onStop,
    onRemove,
    onVerify,
    onCopyMagnetLink,
    onAsk,
    onLabels,
    onLocation,
    onPrio,
  } = $props();

  let priorityIndicator = $state();

  const clickOnPriorityIndicator = () => {
    priorityIndicator.$capture_state().element.click();
  };
</script>

<li onclick={(...args) => onItemClick(onStart, args)}>Start</li>
<li onclick={(...args) => onItemClick(onStartNow, args)}>Start now</li>
<li onclick={(...args) => onItemClick(onStop, args)}>Stop</li>
<li onclick={(...args) => onItemClick(onRemove, args)}>Remove</li>
<li onclick={(...args) => onItemClick(onVerify, args)}>Verify local data</li>
<li onclick={(...args) => onItemClick(onCopyMagnetLink, args)}>
  Copy magnet link
</li>
<li onclick={(...args) => onItemClick(onAsk, args)}>
  Ask tracker for more peers
</li>
<hr />
<li onclick={(...args) => onItemClick(onLabels, args)}>Set labels</li>
<li onclick={(...args) => onItemClick(onLocation, args)}>Set location</li>
<hr />
<li onclick={clickOnPriorityIndicator}>
  Priority
  <PriorityIndicator
    bind:this={priorityIndicator}
    value={prio}
    onclick={(event, ...args) => {
      onItemClick(onPrio, [event, ...args], { shouldClose: false });
      prio = event.detail;
    }}
  />
</li>
