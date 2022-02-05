<script>
  import { timeConfig } from '~helpers/stores';

  export let value;
  export let torrentStatusClass = null;
  export const column = null;

  $: date = new Date(value * 1000);

  function getYear(date) {
    return date.getFullYear();
  }

  function getMonth(date) {
    const month = date.getMonth() + 1;
    return month < 10 ? `0${month}` : month;
  }

  function getDay(date) {
    const day = date.getDate();
    return day < 10 ? `0${day}` : day;
  }

  function getHour(date, format24Hours) {
    let hour = date.getHours();
    if (!format24Hours) {
      hour = hour > 11 ? hour - 12 : hour;
      hour = hour ? hour : 12; // The hour 0 should be 12
    }
    return hour < 10 ? `0${hour}` : hour;
  }

  function getMinutes(date) {
    const minute = date.getMinutes();
    return minute < 10 ? `0${minute}` : minute;
  }

  function getPeriod(date, format24Hours) {
    if (format24Hours) return '';

    const hour = date.getHours();
    return hour > 11 ? 'p.m.' : 'a.m.';
  }
</script>

{#if value > 0}
  {getYear(date)}-{getMonth(date)}-{getDay(date)}
  {getHour(date, $timeConfig)}:{getMinutes(date)}
  {getPeriod(date, $timeConfig)}
{:else}
  -
{/if}
