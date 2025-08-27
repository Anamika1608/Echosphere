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
  
  // Common Indian festivals and occasions (simplified)
  const festivalDates = [
    { name: "Raksha Bandhan", month: 7, day: 19, type: "festival" }, // August
    { name: "Independence Day", month: 7, day: 15, type: "national" }, // August
    { name: "Ganesh Chaturthi", month: 8, day: 7, type: "festival" }, // September
    { name: "Diwali", month: 10, day: 12, type: "festival" }, // November (approximate)
    { name: "Holi", month: 2, day: 14, type: "festival" }, // March (approximate)
    { name: "Dussehra", month: 9, day: 12, type: "festival" }, // October (approximate)
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