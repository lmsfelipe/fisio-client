import { format } from "date-fns/format";
import { toZonedTime } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

export const roundedHours = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

export const quarterHours = [
  "07:00",
  "07:15",
  "07:30",
  "07:45",
  "08:00",
  "08:15",
  "08:30",
  "08:45",
  "09:00",
  "09:15",
  "09:30",
  "09:45",
  "10:00",
  "10:15",
  "10:30",
  "10:45",
  "11:00",
  "11:15",
  "11:30",
  "11:45",
  "12:00",
  "12:15",
  "12:30",
  "12:45",
  "13:00",
  "13:15",
  "13:30",
  "13:45",
  "14:00",
  "14:15",
  "14:30",
  "14:45",
  "15:00",
  "15:15",
  "15:30",
  "15:45",
  "16:00",
  "16:15",
  "16:30",
  "16:45",
  "17:00",
  "17:15",
  "17:30",
  "17:45",
  "18:00",
  "18:15",
  "18:30",
  "18:45",
  "19:00",
];

// Time zone for Brasília (Brazilian UTC-3)
const DEFAULT_TIMEZONE = "America/Sao_Paulo"; // Set your default timezone here

export const formatDateWithTimezone = (
  date: string | Date,
  dateFormat = "yyyy-MM-dd",
  timeZone = DEFAULT_TIMEZONE
) => {
  // Convert the date to the desired timezone
  const zonedDate = toZonedTime(date, timeZone);

  // Format the zoned date
  return format(zonedDate, dateFormat, { locale: ptBR });
};

export const appointmentDuration = [
  30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180,
];

export function minutesToHours(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(
    2,
    "0"
  )}h`;
}
