export const formatTokenNumber = (number) => {
  return `#${String(number).padStart(3, "0")}`;
};

export const formatElapsed = (from, to) => {
  const minutes = Math.max(
    0,
    Math.floor((to - new Date(from).getTime()) / 60000),
  );
  if (minutes < 1) return "less than 1 min";
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
};

export const formatTimer = (startedAt, now) => {
  const seconds = Math.max(
    0,
    Math.floor((now - new Date(startedAt).getTime()) / 1000),
  );
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
};

export const formatMinutes = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${Math.round(minutes % 60)} min`;
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};
