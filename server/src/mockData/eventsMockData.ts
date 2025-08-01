// Mock data - just facilities and past events for 3 different PG types
export const mockPgData = [
  // Mock Data Set 1 - Social/Festival Focused PG
  {
    setId: "social_pg",
    facilities: [
      {
        name: "Main Common Room",
        type: "COMMON_ROOM",
        capacity: 50,
        description: "Spacious common room with comfortable seating",
        amenities: ["Projector", "Sound System", "Air Conditioning", "WiFi", "Comfortable Seating"]
      },
      {
        name: "Rooftop Terrace",
        type: "ROOFTOP",
        capacity: 80,
        description: "Open rooftop with city views",
        amenities: ["Outdoor Seating", "String Lights", "BBQ Area", "City View"]
      },
      {
        name: "Garden Area",
        type: "GARDEN",
        capacity: 30,
        description: "Green space with garden setting",
        amenities: ["Garden Seating", "Natural Lighting", "Plants", "Fresh Air"]
      }
    ],
    pastEvents: [
      {
        title: "Diwali Celebration 2024",
        eventType: "FESTIVAL",
        startDate: "2024-11-01T18:00:00Z",
        endDate: "2024-11-01T22:00:00Z",
        location: "Rooftop Terrace",
        facilityType: "ROOFTOP",
        actualCost: 5000,
        maxCapacity: 80,
        analytics: {
          totalRegistrations: 75,
          actualAttendance: 68,
          attendanceRate: 90.67,
          averageRating: 4.6,
          totalFeedbacks: 45,
          positiveFeedbackCount: 42,
          engagementScore: 92.5,
          successFactors: [
            "Perfect timing with festival season",
            "Rooftop venue created great ambiance",
            "Traditional decorations were highly appreciated",
            "Food variety was excellent",
            "Live music enhanced the experience"
          ]
        }
      },
      {
        title: "Weekend Movie Night",
        eventType: "SOCIAL",
        startDate: "2024-10-15T20:00:00Z",
        endDate: "2024-10-15T23:00:00Z",
        location: "Main Common Room",
        facilityType: "COMMON_ROOM",
        actualCost: 1200,
        maxCapacity: 50,
        analytics: {
          totalRegistrations: 45,
          actualAttendance: 42,
          attendanceRate: 93.33,
          averageRating: 4.3,
          totalFeedbacks: 35,
          positiveFeedbackCount: 30,
          engagementScore: 85.5,
          successFactors: [
            "Popular movie selection",
            "Comfortable seating arrangement",
            "Good snack variety",
            "Weekend timing perfect for relaxation"
          ]
        }
      },
      {
        title: "Raksha Bandhan Celebration",
        eventType: "FESTIVAL",
        startDate: "2024-08-19T17:00:00Z",
        endDate: "2024-08-19T21:00:00Z",
        location: "Garden Area",
        facilityType: "GARDEN",
        actualCost: 2500,
        maxCapacity: 30,
        analytics: {
          totalRegistrations: 28,
          actualAttendance: 26,
          attendanceRate: 92.86,
          averageRating: 4.7,
          totalFeedbacks: 22,
          positiveFeedbackCount: 21,
          engagementScore: 89.0,
          successFactors: [
            "Traditional festival celebration",
            "Garden setting was perfect",
            "Sweet distribution was loved",
            "Cultural significance resonated well"
          ]
        }
      }
    ]
  },

  // Mock Data Set 2 - Sports/Recreation Focused PG
  {
    setId: "sports_pg",
    facilities: [
      {
        name: "Recreation Hall",
        type: "RECREATION_ROOM",
        capacity: 60,
        description: "Multi-purpose hall with entertainment facilities",
        amenities: ["Gaming Setup", "Pool Table", "Sound System", "LED TV", "Air Conditioning"]
      },
      {
        name: "Sports Area",
        type: "COURTYARD",
        capacity: 40,
        description: "Open area for sports and activities",
        amenities: ["Badminton Court", "Table Tennis", "Outdoor Games", "Good Lighting"]
      },
      {
        name: "Study Lounge",
        type: "STUDY_ROOM",
        capacity: 25,
        description: "Quiet space for studying and meetings",
        amenities: ["Study Tables", "WiFi", "Whiteboard", "Silent Environment", "Good Lighting"]
      }
    ],
    pastEvents: [
      {
        title: "Gaming Tournament Championship",
        eventType: "SPORTS",
        startDate: "2024-10-28T16:00:00Z",
        endDate: "2024-10-28T20:00:00Z",
        location: "Recreation Hall",
        facilityType: "RECREATION_ROOM",
        actualCost: 2000,
        maxCapacity: 40,
        analytics: {
          totalRegistrations: 35,
          actualAttendance: 33,
          attendanceRate: 94.29,
          averageRating: 4.7,
          totalFeedbacks: 28,
          positiveFeedbackCount: 27,
          engagementScore: 94.5,
          successFactors: [
            "Multiple gaming stations available",
            "Competitive prizes motivated participation",
            "Weekend timing was perfect",
            "Snacks and refreshments provided",
            "Live commentary added excitement"
          ]
        }
      },
      {
        title: "Badminton Tournament",
        eventType: "SPORTS",
        startDate: "2024-09-14T18:00:00Z",
        endDate: "2024-09-14T21:00:00Z",
        location: "Sports Area",
        facilityType: "COURTYARD",
        actualCost: 800,
        maxCapacity: 32,
        analytics: {
          totalRegistrations: 28,
          actualAttendance: 26,
          attendanceRate: 92.86,
          averageRating: 4.4,
          totalFeedbacks: 22,
          positiveFeedbackCount: 20,
          engagementScore: 87.5,
          successFactors: [
            "Well-organized tournament brackets",
            "Good sports facilities",
            "Healthy competition environment",
            "Weekend event timing worked well"
          ]
        }
      }
    ]
  },

  // Mock Data Set 3 - Cultural/Educational Focused PG
  {
    setId: "cultural_pg",
    facilities: [
      {
        name: "Cultural Hall",
        type: "COMMON_ROOM",
        capacity: 70,
        description: "Large hall perfect for cultural events",
        amenities: ["Stage Setup", "Sound System", "Lighting", "Seating Arrangement", "AC"]
      },
      {
        name: "Workshop Room",
        type: "STUDY_ROOM",
        capacity: 35,
        description: "Interactive space for workshops and learning",
        amenities: ["Projector", "Whiteboard", "Tables", "WiFi", "Art Supplies"]
      },
      {
        name: "Community Kitchen",
        type: "DINING_HALL",
        capacity: 40,
        description: "Shared cooking and dining space",
        amenities: ["Modern Appliances", "Large Dining Table", "Cooking Utensils", "Storage"]
      }
    ],
    pastEvents: [
      {
        title: "Cultural Night - Dance & Music",
        eventType: "CULTURAL",
        startDate: "2024-10-12T19:00:00Z",
        endDate: "2024-10-12T22:30:00Z",
        location: "Cultural Hall",
        facilityType: "COMMON_ROOM",
        actualCost: 3500,
        maxCapacity: 65,
        analytics: {
          totalRegistrations: 60,
          actualAttendance: 55,
          attendanceRate: 91.67,
          averageRating: 4.8,
          totalFeedbacks: 42,
          positiveFeedbackCount: 40,
          engagementScore: 93.0,
          successFactors: [
            "Diverse cultural performances",
            "Great stage and sound setup",
            "Weekend timing perfect for attendance",
            "Community participation was high",
            "Traditional and modern mix appealed to all"
          ]
        }
      },
      {
        title: "Cooking Workshop - Regional Cuisine",
        eventType: "EDUCATIONAL",
        startDate: "2024-09-22T17:00:00Z",
        endDate: "2024-09-22T20:00:00Z",
        location: "Community Kitchen",
        facilityType: "DINING_HALL",
        actualCost: 1500,
        maxCapacity: 25,
        analytics: {
          totalRegistrations: 24,
          actualAttendance: 22,
          attendanceRate: 91.67,
          averageRating: 4.6,
          totalFeedbacks: 20,
          positiveFeedbackCount: 19,
          engagementScore: 91.0,
          successFactors: [
            "Hands-on learning experience",
            "Everyone got to cook and taste",
            "Recipe cards were provided",
            "Professional chef guidance"
          ]
        }
      }
    ]
  }
];

// Redis key patterns for tracking alternation
export const REDIS_KEYS = {
  LAST_ASSIGNED_MOCK_DATA: 'pg:last_assigned_mock_data',
  PG_MOCK_DATA_MAPPING: 'pg:mock_data_mapping:',
  SUGGESTION_CACHE: 'pg:suggestions:'
};

// Get next mock data set in rotation
export function getNextMockDataSet(): { setIndex: number; data: any } {
  // This will be implemented with Redis to track the last assigned
  // For now, return based on timestamp for demo
  const currentHour = new Date().getHours();
  const setIndex = currentHour % 3; // Rotate through 0, 1, 2
  
  return {
    setIndex,
    data: mockPgData[setIndex]
  };
}

// Specific dates for AI suggestions (next week from Aug 1, 2025)
export const TARGET_SUGGESTION_DATES = {
  WEEKEND_SATURDAY: "2025-08-02T18:00:00Z", // Saturday evening
  WEEKEND_SUNDAY: "2025-08-03T16:00:00Z",   // Sunday afternoon  
  RAKSHA_BANDHAN: "2025-08-09T17:00:00Z"    // Raksha Bandhan
};

export const getTargetDates = () => [
  {
    date: TARGET_SUGGESTION_DATES.WEEKEND_SATURDAY,
    context: "Weekend Saturday",
    type: "weekend",
    description: "Saturday evening perfect for social events"
  },
  {
    date: TARGET_SUGGESTION_DATES.WEEKEND_SUNDAY,
    context: "Weekend Sunday", 
    type: "weekend",
    description: "Sunday afternoon ideal for recreational activities"
  },
  {
    date: TARGET_SUGGESTION_DATES.RAKSHA_BANDHAN,
    context: "Raksha Bandhan Festival",
    type: "festival", 
    description: "Traditional festival celebration"
  }
];