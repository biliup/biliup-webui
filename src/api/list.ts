import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data?: Array<any>;
};

/** 卡片列表 */
export const getStreamersList = (data?: object) => {
  return http.request<Result>("get", "/v2/streamers/list", { data });
};

export const createStreamers = (data?: object) => {
  return http.request<Result>("post", "/v2/streamers/create", { data });
};

export const deleteStreamers = (data?: object) => {
  return http.request<Result>("post", "/v2/streamers/delete", { data });
};
