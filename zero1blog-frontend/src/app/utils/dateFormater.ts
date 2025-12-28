import { HttpClient } from '@angular/common/http';

export function formatDate(ceaiation: number) {
  let now: number = new Date().getTime() / 1000;
  let ceaiationDate = new Date(ceaiation * 1000);
  let duration: number = now - ceaiation;
  let onemin = 60;
  let oneHour = onemin * 60;
  let oneDay = oneHour * 24;
  let oneMon = oneDay * 30;

  if (duration > oneMon * 6) {
    return `${ceaiationDate.getFullYear()}/${
      ceaiationDate.getMonth() + 1
    }/${ceaiationDate.getDate()}`;
  }

  if (duration >= oneMon) {
    const months = Math.floor(duration / oneMon);
    return months === 1 ? '1 Month ago' : `${months} Months ago`;
  }

  if (duration >= oneDay) return `${Math.floor(duration / oneDay)} d ago`;

  if (duration >= oneHour) return `${Math.floor(duration / oneHour)} H ago`;

  if (duration >= onemin) return `${Math.floor(duration / onemin)} min ago`;

  return `${Math.floor(duration)} s ago`;
}

export function checkToken() {
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    console.warn('JWT Token not found. Redirecting to login.');
    return '';
  }
  return token;
}
