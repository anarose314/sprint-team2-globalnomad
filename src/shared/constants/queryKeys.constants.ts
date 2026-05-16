export const QUERY_KEYS = {
  ACTIVITIES: ['activities'],
  POPULAR_ACTIVITIES: ['popularActivities'],
  ACTIVITY_AVAILABLE_SCHEDULE: ['activityAvailableSchedule'],
  ACTIVITY_REVIEWS: ['activityReviews'],
  MY_ACTIVITIES: ['myActivities'],
  MY_RESERVATIONS: ['myReservations'],
  MY_ACTIVITIES_DASHBOARD: ['myActivitiesDashboard'],
  MY_ACTIVITY_RESERVATION_DASHBOARD: ['myActivityReservationDashboard'],
  MY_ACTIVITY_RESERVED_SCHEDULE: ['myActivityReservedSchedule'],
  MY_ACTIVITY_RESERVATIONS: ['myActivityReservations'],
  MY_INFO: ['myInfo'],
} as const;

export const URL_QUERY_ERRORS = {
  UNAUTHORIZED: 'unauthorized',
} as const;
