// 最简代码，也就是这些字段必须有
export default {
  path: "/dashboard",
  meta: {
    title: "空间配置",
    rank: 7
  },
  children: [
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("@/views/dashboard/index.vue"),
      meta: {
        title: "空间配置"
      }
    }
  ]
};
