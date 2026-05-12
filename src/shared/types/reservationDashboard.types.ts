export interface ReservationDashboardDailyItem {
  date: string;
  reservations: {
    completed: number;
    confirmed: number;
    pending: number;
  };
}
