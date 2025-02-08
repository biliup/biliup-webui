// 最简代码，也就是这些字段必须有
export default {
  path: "/job",
  meta: {
    title: "录制历史",
    rank: 4
  },
  children: [
    {
      path: "/job",
      name: "Job",
      component: () => import("@/views/job/index.vue"),
      meta: {
        title: "录制历史"
      }
    }
  ]
};
