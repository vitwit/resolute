export function getTimeDifference(timestamp: string): string {
  const now: Date = new Date();
  const timestampDate: Date = new Date(timestamp);
  const timeDifference: number = now.getTime() - timestampDate.getTime();
  const seconds: number = Math.floor(timeDifference / 1000);
  const minutes: number = Math.floor(seconds / 60);
  const hours: number = Math.floor(minutes / 60);
  const days: number = Math.floor(hours / 24);
  const months: number = Math.floor(days / 30);
  const years: number = Math.floor(days / 365);

  if (seconds < 60) {
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (days < 30) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
}
