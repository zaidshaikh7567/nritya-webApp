import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const getDraftStatus = (creationTimeString, draftWindowHours = 4) => {
  const creationTime = dayjs.unix(creationTimeString).tz("Asia/Kolkata");
  const draftWindowEnd = creationTime.add(draftWindowHours, 'hour');
  const now = dayjs().tz("Asia/Kolkata");

  const minutesLeft = draftWindowEnd.diff(now, 'minute');
  const isDraftActive = minutesLeft > 0;

  return {
    creationTime,
    draftWindowEnd,
    minutesLeft,
    isDraftActive,
  };
};

export const formatDateToReadable = (dateString) => {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};

export const convertTo12HourFormat = (timeStr) => {
  const [hour, minute] = timeStr.split(":").map(Number);

  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
};
