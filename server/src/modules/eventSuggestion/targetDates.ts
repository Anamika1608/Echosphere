// Redis key patterns for tracking alternation
export const REDIS_KEYS = {
  SUGGESTION_CACHE: 'pg:suggestions:'
};

// Generate target dates dynamically based on current date
export const getTargetDates = () => {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Find next Saturday and Sunday
  const daysUntilSaturday = (6 - now.getDay() + 7) % 7 || 7;
  const nextSaturday = new Date(now.getTime() + daysUntilSaturday * 24 * 60 * 60 * 1000);
  nextSaturday.setHours(18, 0, 0, 0); // 6 PM Saturday

  const nextSunday = new Date(nextSaturday.getTime() + 24 * 60 * 60 * 1000);
  nextSunday.setHours(16, 0, 0, 0); // 4 PM Sunday

  // Generate upcoming special dates (festivals, holidays)
  const upcomingFestivals = getUpcomingFestivals(now);

  const targetDates = [
    {
      date: nextSaturday.toISOString(),
      context: "Weekend Saturday Evening",
      type: "weekend",
      description: "Saturday evening perfect for social events and community bonding"
    },
    {
      date: nextSunday.toISOString(),
      context: "Weekend Sunday Afternoon",
      type: "weekend",
      description: "Sunday afternoon ideal for recreational and cultural activities"
    }
  ];

  // Add upcoming festivals
  targetDates.push(...upcomingFestivals);

  return targetDates;
};

// Get upcoming festivals and special occasions
interface FestivalEvent {
  date: string;
  context: string;
  type: string;
  description: string;
}

const getUpcomingFestivals = (currentDate: Date): FestivalEvent[] => {
  const festivals: FestivalEvent[] = [];
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const festivalDates = [
    { name: "Good Friday", month: 3, day: 18, type: "festival" },       // April 18
    { name: "May Day", month: 4, day: 1, type: "national" },            // May 1
    { name: "Bakrid", month: 5, day: 7, type: "festival" },             // June 7
    { name: "Muharram", month: 6, day: 6, type: "festival" },           // July 6 (Sunday)
    { name: "Raksha Bandhan", month: 7, day: 19, type: "festival" },    // August 19
    { name: "Independence Day", month: 7, day: 15, type: "national" },  // August 15
    { name: "Ganesh Chaturthi", month: 7, day: 27, type: "festival" },  // August 27
    { name: "Eid-Milad", month: 8, day: 5, type: "festival" },          // September 5
    { name: "MahaAsthami", month: 8, day: 30, type: "festival" },       // September 30
    { name: "Mahanavami", month: 9, day: 1, type: "festival" },         // October 1
    { name: "Gandhi Jayanti", month: 9, day: 2, type: "national" },     // October 2
    { name: "Dussehra", month: 9, day: 2, type: "festival" },           // October 2
    { name: "Diwali", month: 9, day: 20, type: "festival" },            // October 20
    { name: "Diwali", month: 9, day: 21, type: "festival" },            // October 21
    { name: "Holi", month: 2, day: 14, type: "festival" },              // March (approx)
    { name: "Christmas", month: 11, day: 25, type: "festival" }         // December 25
  ];

  festivalDates.forEach(festival => {
    const festivalDate = new Date(currentYear, festival.month, festival.day, 17, 0, 0);

    // Only include festivals that are upcoming
    if (festivalDate > currentDate && festival.month >= currentMonth) {
      festivals.push({
        date: festivalDate.toISOString(),
        context: `${festival.name} Festival`,
        type: festival.type,
        description: `Traditional ${festival.name} celebration perfect for community gathering`
      });
    }
  });

  return festivals.slice(0, 2); // Limit to next 2 festivals
};