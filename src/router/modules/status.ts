// 最简代码，也就是这些字段必须有
export default {
  path: "/status",
  meta: {
    title: "任务平台",
    rank: 8
  },
  children: [
    {
      path: "/status",
      name: "Status",
      component: () => import("@/views/status/index.vue"),
      meta: {
        title: "任务平台"
      }
    }
  ]
};
