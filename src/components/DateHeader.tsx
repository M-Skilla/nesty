export const DateHeader = ({ date }: { date: Date }) => {
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <div className="my-4 flex justify-center">
      <span className="rounded-full bg-primary/20 px-3 py-1 text-xs text-white/60">
        {formatDate(date)}
      </span>
    </div>
  );
};
