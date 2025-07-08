
// Nigerian Public Holidays
export const nigerianPublicHolidays2024 = [
  { name: "New Year's Day", date: "2024-01-01" },
  { name: "Good Friday", date: "2024-03-29" },
  { name: "Easter Monday", date: "2024-04-01" },
  { name: "Workers' Day", date: "2024-05-01" },
  { name: "Children's Day", date: "2024-05-27" },
  { name: "Democracy Day", date: "2024-06-12" },
  { name: "Eid al-Fitr", date: "2024-04-10" },
  { name: "Eid al-Adha", date: "2024-06-17" },
  { name: "Independence Day", date: "2024-10-01" },
  { name: "Christmas Day", date: "2024-12-25" },
  { name: "Boxing Day", date: "2024-12-26" }
];

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

export const isPublicHoliday = (date: Date): boolean => {
  const dateString = date.toISOString().split('T')[0];
  return nigerianPublicHolidays2024.some(holiday => holiday.date === dateString);
};

export const calculateWorkingDays = (startDate: string, endDate: string): { workingDays: number; totalDays: number } => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let workingDays = 0;
  let totalDays = 0;
  
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    totalDays++;
    if (!isWeekend(date) && !isPublicHoliday(date)) {
      workingDays++;
    }
  }
  
  return { workingDays, totalDays };
};

export const getHolidaysInRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const holidaysInRange = [];
  
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    if (isWeekend(date)) {
      holidaysInRange.push({
        date: date.toISOString().split('T')[0],
        name: date.getDay() === 0 ? 'Sunday' : 'Saturday',
        type: 'weekend'
      });
    } else if (isPublicHoliday(date)) {
      const holiday = nigerianPublicHolidays2024.find(h => h.date === date.toISOString().split('T')[0]);
      holidaysInRange.push({
        date: date.toISOString().split('T')[0],
        name: holiday?.name || 'Public Holiday',
        type: 'public'
      });
    }
  }
  
  return holidaysInRange;
};
