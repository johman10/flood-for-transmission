<script>
  import Icon from '~components/Icon';

  export let value;
  export let torrentStatusClass = null;

  let seconds;
  let minutes;
  let hours;
  let days;

  $: {
    seconds = Math.floor(value % 60);
    if (seconds < 10) seconds = `0${seconds}`;
    minutes = Math.floor((value / 60) % 60);
    if (minutes < 10) minutes = `0${minutes}`;
    hours = Math.floor((value / 60 / 60) % 24);
    days = Math.floor(value / 60 / 60 / 24);
  }
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
