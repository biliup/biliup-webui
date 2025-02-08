import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/v2/streamers/delete",
    method: "post",
    response: () => {
      return {
        success: true,
        data: {}
      };
    }
  }
]);
