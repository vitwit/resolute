import moment from 'moment/moment';

export function getLocalTime(value: string): string {
  return moment(value).format('YYYY-MM-DD HH:m:s');
}

export function getDaysLeft(end_date: string): number {
  const end = moment(end_date, 'YYYY-MM-DD');
  return end.diff(moment(), 'days') + 1;
}
