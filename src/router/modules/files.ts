// 最简代码，也就是这些字段必须有
export default {
  path: "/files",
  meta: {
    title: "本地文件预览",
    rank: 6
  },
  children: [
    {
      path: "/files",
      name: "Files",
      component: () => import("@/views/files/index.vue"),
      meta: {
        title: "本地文件预览"
      }
    }
  ]
};
