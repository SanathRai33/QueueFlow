import api from "./axios";

export const fetchQueues = async () => {
  const res = await api.get("/queues");
  return res.data.queues;
};

export const createQueue = async (name) => {
  const res = await api.post("/queues", { name });
  return res.data.queue;
};
