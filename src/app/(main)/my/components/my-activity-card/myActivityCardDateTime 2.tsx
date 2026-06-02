interface MyActivityCardDateTimeProps {
  date: string;
  startTime: string;
  endTime: string;
}

export function MyActivityCardDateTime({
  date,
  startTime,
  endTime,
}: MyActivityCardDateTimeProps) {
  return (
    <time
      dateTime={`${date}T${startTime}`}
      className="typo-sm-medium 2xl:typo-lg-medium flex gap-2 text-gray-500"
    >
      {`${date} · ${startTime} - ${endTime}`}
    </time>
  );
}
