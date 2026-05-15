export interface ReservationDashboardDailyItem {
  date: string;
  reservations: {
    completed: number;
    confirmed: number;
    declined: number;
    pending: number;
  };
}
