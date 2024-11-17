<script>
  import Icon from '~components/Icon';

  let { value = 0, torrentStatusClass = null } = $props();

  let seconds = $derived.by(() => {
    let secondString = Math.floor(value % 60);
    if (secondString < 10) secondString = `0${secondString}`;
    return secondString;
  });
  let minutes = $derived.by(() => {
    let minuteString = Math.floor((value / 60) % 60);
    if (minuteString < 10) minuteString = `0${minuteString}`;
    return minuteString;
  });
  let hours = $derived(Math.floor((value / 60 / 60) % 24));
  let days = $derived(Math.floor(value / 60 / 60 / 24));
</script>

<span>
  {#if value <= 0}
    <Icon name="InfinityIcon" />
  {:else if days}
    {days}
    <em>d</em>
    {hours}
    <em>hr</em>
  {:else if hours}
    {hours}
    <em>hr</em>
    {minutes}
    <em>m</em>
  {:else if minutes}
    {minutes}
    <em>m</em>
    {seconds}
    <em>s</em>
  {:else}{seconds} <em>s</em>{/if}
</span>

<style>
  em {
    font-style: normal;
    font-size: 10px;
  }

  span > :global(.icon) {
    fill: currentColor;
    height: 13px;
    vertical-align: middle;
  }
</style>
