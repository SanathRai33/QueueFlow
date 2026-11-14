import api from "./axios";

export const fetchAnalytics = async (queueId, days) => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const res = await api.get(`/analytics/queues/${queueId}`, {
    params: { days, tz },
  });
  return res.data;
};
