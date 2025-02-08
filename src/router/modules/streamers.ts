// 最简代码，也就是这些字段必须有
export default {
  path: "/streamers",
  meta: {
    title: "直播管理",
    rank: 1
  },
  children: [
    {
      path: "/streamers",
      name: "Streamers",
      component: () => import("@/views/streamers/index.vue"),
      meta: {
        title: "直播管理"
      }
    }
  ]
} satisfies RouteConfigsTable;
