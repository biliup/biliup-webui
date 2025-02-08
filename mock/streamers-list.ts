import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/v2/streamers/list",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [
          {
            id: 1,
            type: "bilibili",
            remark: "测试标题",
            url: "https://live.bilibili.com/123",
            time_range: "01:00:00-02:00:00",
            format: null,
            segment_processor: [
              {
                run: "echo 2"
              }
            ],
            postprocessor: [{ cmd: "rm", value: "" }],
            filename_prefix: null,
            preprocessor: [
              {
                run: "echo 1"
              }
            ],
            downloaded_processor: [
              {
                run: "echo 3"
              }
            ],
            opt_args: ["echo 4"],
            upload_id: 1,
            status: {
              current_status: "waiting", //  values: "waiting", "recording", "uploading", "disabled"
              upload_speed: 0, // Speed in kb/s (int)
              download_speed: 0 // Speed in kb/s (int)
            },
            // 全局参数覆写
            override: [
              { key: "submit_api", value: "abc" },
              { key: "lines", value: "qqq" }
            ],
            filters: [
              {
                key: "title",
                operator: "not contains",
                value: "b",
                logic: "and"
              },
              { key: "area", operator: "equals", value: "c", logic: "or" }
            ]
          },

          {
            id: 2,
            type: "douyin",
            remark: "测试标题2",
            url: "https://www.douyin.com/follow/live/123",
            time_range: "01:00:00-02:00:00",
            format: null,
            segment_processor: [
              {
                run: "echo 2"
              }
            ],
            postprocessor: [{ cmd: "rm", value: "" }],
            filename_prefix: null,
            preprocessor: [
              {
                run: "echo 1"
              }
            ],
            downloaded_processor: [
              {
                run: "echo 3"
              }
            ],
            opt_args: ["echo 4"],
            upload_id: 1,
            status: {
              current_status: "recording", //  values: "waiting", "recording", "uploading", "disabled"
              upload_speed: 0, // Speed in kb/s (int)
              download_speed: 0 // Speed in kb/s (int)
            }
          },
          {
            id: 3,
            type: "huya",
            remark: "测试标题3",
            url: "https://www.huya.com/347185",
            time_range: "01:00:00-02:00:00",
            format: null,
            segment_processor: [
              {
                run: "echo 2"
              }
            ],
            postprocessor: [
              { cmd: "rm", value: "" },
              { cmd: "mv", value: "echo 4" },
              { cmd: "run", value: "echo 5" }
            ],
            filename_prefix: null,
            preprocessor: [
              {
                run: "echo 1"
              }
            ],
            downloaded_processor: [
              {
                run: "echo 3"
              }
            ],
            opt_args: ["echo 4"],
            upload_id: 1,
            status: {
              current_status: "uploading", //  values: "waiting", "recording", "uploading", "disabled"
              upload_speed: 0, // Speed in kb/s (int)
              download_speed: 0 // Speed in kb/s (int)
            }
          },
          {
            id: 4,
            type: "douyu",
            remark: "测试标题4",
            url: "https://www.douyu.com/347185",
            time_range: "01:00:00-02:00:00",
            format: null,
            segment_processor: [
              {
                run: "echo 2"
              }
            ],
            postprocessor: [{ cmd: "rm", value: "" }],
            filename_prefix: null,
            preprocessor: [
              {
                run: "echo 1"
              }
            ],
            downloaded_processor: [
              {
                run: "echo 3"
              }
            ],
            opt_args: ["echo 4"],
            upload_id: 1,
            status: {
              current_status: "disabled", //  values: "waiting", "recording", "uploading", "disabled"
              upload_speed: 0, // Speed in kb/s (int)
              download_speed: 0 // Speed in kb/s (int)
            }
          }
        ]
      };
    }
  }
]);
