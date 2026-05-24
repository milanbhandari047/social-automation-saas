import { publishPost } from "../publishers";

export const processPostJob = async (job: any) => {
  const { data } = job;

  return await publishPost(data);
};
