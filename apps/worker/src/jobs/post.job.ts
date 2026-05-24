import { publishPost } from "../publishers";

export const processPostJob = async (job: any) => {
  return await publishPost(job.data);
};
