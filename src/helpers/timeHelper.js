const MS = 1;
const MS_PER_SECOND = MS * 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

const MINUTES_PER_HOUR = 60;

export function relativeTime(timestamp) {
  let timeLeft = Date.now() - timestamp;

  const days = Math.floor(timeLeft / MS_PER_DAY);
  const daysText = days === 1 ? 'day' : 'days';
  timeLeft %= MS_PER_DAY;

  const hours = Math.floor(timeLeft / MS_PER_HOUR);
  const hoursText = hours === 1 ? 'hour' : 'hours';
  timeLeft %= MS_PER_HOUR;

  if (days && hours) {
    return `${days} ${daysText} and ${hours} ${hoursText} ago`;
  }
  if (days) {
    return `${days} ${daysText} ago`;
  }

  const minutes = Math.floor(timeLeft / MS_PER_MINUTE);
  const minutesText = minutes === 1 ? 'minute' : 'minutes';
  timeLeft %= MS_PER_MINUTE;

  if (hours && minutes) {
    return `${hours} ${hoursText} and ${minutes} ${minutesText} ago`;
  }
  if (hours) {
    return `${hours} ${hoursText} ago`;
  }

  const seconds = Math.floor(timeLeft / MS_PER_SECOND);
  const secondsText = seconds === 1 ? 'second' : 'seconds';
  timeLeft %= MS_PER_SECOND;

  if (minutes && seconds) {
    return `${minutes} ${minutesText} and ${seconds} ${secondsText} ago`;
  }
  if (minutes) {
    return `${minutes} ${minutesText} ago`;
  }

  if (seconds) {
    return `${seconds} ${secondsText} ago`;
  }
  return 'now';
}

export function minutesToTime(minutes) {
  let minutesLeft = minutes;

  let hours = Math.floor(minutesLeft / MINUTES_PER_HOUR);
  minutesLeft %= MINUTES_PER_HOUR;

  if (hours === 0) {
    hours = '00';
  } else if (hours < 10) {
    hours = `0${hours}`;
  }

  if (minutesLeft === 0) {
    minutesLeft = '00';
  } else if (minutesLeft < 10) {
    minutesLeft = `0${minutesLeft}`;
  }

  return `${hours}:${minutesLeft}`;
}

export function timeToMinutes(time) {
  const splitTime = time.split(':');
  const hours = parseInt(splitTime[0], 10);
  const minutes = parseInt(splitTime[1], 10);
  return hours * MINUTES_PER_HOUR + minutes;
}
