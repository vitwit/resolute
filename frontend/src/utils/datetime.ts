import moment from 'moment/moment';

export function getLocalTime(value: string): string {
  return moment(value).format('YYYY-MM-DD HH:mm:ss');
}

export function getDaysLeft(end_date: string): number {
  const end = moment(end_date, 'YYYY-MM-DD');
  return end.diff(moment(), 'days') + 1;
}

export function getLocalDate(value: string): string {
  return moment(value).format('YYYY-MM-DD');
}

export const isTimeExpired = (expirationTime: string | null): boolean => {
  if (expirationTime == null) return false;
  const expirationDate = new Date(expirationTime);
  const currentTime = new Date();
  return currentTime.getTime() > expirationDate.getTime();
};
