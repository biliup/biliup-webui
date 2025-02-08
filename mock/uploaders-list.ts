import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/v2/uploaders/list",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [
          {
            tid: 138,
            hires: 1,
            up_selection_reply: 1,
            copyright: 1,
            open_elec: 1,
            up_close_reply: 1,
            copyright_source: "",
            no_reprint: 1,
            up_close_danmu: 1,
            cover_path: "",
            uploader: "bili_web",
            extra_fields: null,
            description: "",
            user_cookie: "data/112233.json",
            template_name: "测测又试试",
            dynamic: "12333333",
            tags: ["测测"],
            id: 1,
            dtime: null,
            credits: null,
            title: "{streamer}  %Y-%m-%d %H_%M 测测又试试",
            dolby: 1
          }
        ]
      };
    }
  }
]);
