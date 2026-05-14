interface ActivityCardDateTimeProps {
  date: string;
  startTime: string;
  endTime: string;
}

export function ActivityCardDateTime({
  date,
  startTime,
  endTime,
}: ActivityCardDateTimeProps) {
  return (
    <time
      dateTime={`${date}T${startTime}`}
      className="typo-sm-medium 2xl:typo-lg-medium flex gap-2 text-gray-500"
    >
      {`${date} · ${startTime} - ${endTime}`}
    </time>
  );
}
