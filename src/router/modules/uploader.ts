// 最简代码，也就是这些字段必须有
export default {
  path: "/uploader",
  meta: {
    title: "投稿管理",
    rank: 2
  },
  children: [
    {
      path: "/uploader",
      name: "Uploader",
      component: () => import("@/views/uploader/index.vue"),
      meta: {
        title: "投稿管理"
      }
    }
  ]
};
