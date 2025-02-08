import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data?: Array<any>;
};

/** 卡片列表 */
export const getUploadersList = (data?: object) => {
  return http.request<Result>("get", "/v2/uploaders/list", { data });
};

export const createUploaders = (data?: object) => {
  return http.request<Result>("post", "/v2/uploaders/create", { data });
};

export const deleteUploaders = (data?: object) => {
  return http.request<Result>("post", "/v2/uploaders/delete", { data });
};
