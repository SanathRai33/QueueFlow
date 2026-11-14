import api from "./axios";

export const fetchQueueDetail = async (queueId) => {
  const res = await api.get(`/queues/${queueId}`);
  return res.data;
};

export const addToken = async (queueId, personName) => {
  const res = await api.post(`/queues/${queueId}/tokens`, { personName });
  return res.data.token;
};

export const moveToken = async (tokenId, direction) => {
  const res = await api.patch(`/tokens/${tokenId}/move`, { direction });
  return res.data.tokens;
};

export const cancelToken = async (tokenId) => {
  const res = await api.patch(`/tokens/${tokenId}/cancel`);
  return res.data.tokens;
};

export const serveNext = async (queueId) => {
  const res = await api.post(`/queues/${queueId}/serve-next`);
  return res.data.token;
};

export const completeCurrent = async (queueId) => {
  const res = await api.post(`/queues/${queueId}/complete-current`);
  return res.data.token;
};
