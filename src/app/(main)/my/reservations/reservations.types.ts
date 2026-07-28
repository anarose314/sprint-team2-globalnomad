export type MyReservationsSearchParams = {
  [key: string]: string | string[] | undefined;
};

export interface MyReservationsPageProps {
  searchParams: Promise<MyReservationsSearchParams>;
}
