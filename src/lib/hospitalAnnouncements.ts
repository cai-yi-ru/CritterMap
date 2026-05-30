import type { HospitalAnnouncement } from '@/types/hospital';

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getActiveAnnouncements(
  announcements: HospitalAnnouncement[] = [],
  today = getLocalDateString(),
) {
  return announcements.filter((announcement) => {
    if (announcement.startDate && announcement.startDate > today) {
      return false;
    }

    if (announcement.endDate && announcement.endDate < today) {
      return false;
    }

    return true;
  });
}
