<script setup lang="ts">
import { computed, defineAsyncComponent, PropType } from "vue";
import More2Fill from "@iconify-icons/ri/more-2-fill";

// 定义组件名称
defineOptions({
  name: "ReCard"
});

// 修改后的接口定义，适配返回数据字段
interface CardProductType {
  id: number;
  type: string; // 用于动态加载对应图标，如 "bilibili"
  remark: string; // 用作卡片标题
  url: string;
  time_range: string; // 用作卡片描述
  format: any;
  segment_processor: Array<{ run: string }>;
  postprocessor: string[];
  filename_prefix: string | null;
  preprocessor: Array<{ run: string }>;
  downloaded_processor: Array<{ run: string }>;
  opt_args: string[];
  upload_id: number;
  status: {
    current_status: "waiting" | "recording" | "uploading" | "disabled";
    upload_speed: number; // 单位：kb/s
    download_speed: number; // 单位：kb/s
  };
}

const props = defineProps({
  product: {
    type: Object as PropType<CardProductType>,
    required: true
  }
});

const emit = defineEmits(["manage-product", "delete-item"]);

const handleClickManage = (product: CardProductType) => {
  emit("manage-product", product);
};

const handleClickDelete = (product: CardProductType) => {
  emit("delete-item", product);
};

// 根据状态判断卡片是否处于停用状态（disabled 状态视为停用）
const cardClass = computed(() => [
  "list-card-item",
  {
    "list-card-item__disabled":
      props.product.status.current_status === "disabled"
  }
]);

const cardLogoClass = computed(() => [
  "list-card-item_detail--logo",
  {
    "list-card-item_detail--logo__disabled":
      props.product.status.current_status === "disabled"
  }
]);

// 动态加载图标组件，拼接 product.type + ".svg"
const iconComponent = computed(() => {
  return defineAsyncComponent(
    () => import(`@/assets/svg/${props.product.type}.svg?component`)
  );
});

// 根据状态值映射中文标签和颜色
const statusInfo = computed(() => {
  const mapping: Record<string, { label: string; color: string }> = {
    waiting: { label: "等待开播", color: "#ff9900" },
    recording: { label: "录播中", color: "#67c23a" },
    uploading: { label: "上传中", color: "#409EFF" },
    disabled: { label: "停用", color: "#909399" }
  };
  return (
    mapping[props.product.status.current_status] || {
      label: props.product.status.current_status,
      color: "#d3d3d3"
    }
  );
});

// 计算上传、下载速度（转换为 Mb/s，保留两位小数）
const uploadSpeedMb = computed(() =>
  (props.product.status.upload_speed / 1000).toFixed(2)
);
const downloadSpeedMb = computed(() =>
  (props.product.status.download_speed / 1000).toFixed(2)
);
</script>

<template>
  <div :class="cardClass">
    <div class="list-card-item_detail bg-bg_color">
      <el-row justify="space-between">
        <div :class="cardLogoClass">
          <!-- 动态加载图标 -->
          <component :is="iconComponent" />
        </div>
        <div class="list-card-item_detail--operation">
          <!-- 显示状态对应的中文和颜色 -->
          <el-tag
            :color="statusInfo.color"
            effect="dark"
            class="mx-1 list-card-item_detail--operation--tag"
          >
            {{ statusInfo.label }}
          </el-tag>
          <el-dropdown trigger="click">
            <IconifyIconOffline :icon="More2Fill" class="text-[24px]" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleClickManage(props.product)">
                  编辑
                </el-dropdown-item>
                <el-dropdown-item @click="handleClickDelete(props.product)">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-row>
      <!-- 标题和链接使用 remark 和 url 字段 -->
      <p class="list-card-item_detail--name text-text_color_primary">
        {{ product.remark }}
      </p>
      <a
        class="list-card-item_detail--desc text-text_color_regular"
        :href="product.url"
        target="_blank"
      >
        {{ product.url }}
      </a>
      <!-- 底部增加上传、下载速度标签，单位 Mb/s -->
      <div class="list-card-item_detail--speed">
        <el-tag type="info" class="mx-1">
          上传速度: {{ uploadSpeedMb }} Mb/s
        </el-tag>
        <el-tag type="success" class="mx-1">
          下载速度: {{ downloadSpeedMb }} Mb/s
        </el-tag>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-card-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  overflow: hidden;
  cursor: default; // 将卡片容器的鼠标样式设置为默认
  border-radius: 3px;

  &_detail {
    flex: 1;
    min-height: 140px;
    padding: 24px 32px;

    &--logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      font-size: 26px;
      color: #0052d9;
      background: #e0ebff;
      border-radius: 50%;

      &__disabled {
        color: #a1c4ff;
      }
    }

    &--operation {
      display: flex;
      height: 100%;

      &--tag {
        border: 0;
      }
    }

    &--name {
      margin: 24px 0 8px;
      font-size: 16px;
      font-weight: 400;
    }

    &--desc {
      display: -webkit-box;
      height: 40px;
      margin-bottom: 24px;
      overflow: hidden;
      font-size: 12px;
      line-height: 20px;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      /* 调整下划线与文字之间的距离 */
      text-decoration: underline;
      text-underline-offset: 1px;
      /* 超链接鼠标样式为手指 */
      cursor: pointer;
    }

    &--speed {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }
  }

  &__disabled {
    .list-card-item_detail--name,
    .list-card-item_detail--desc {
      color: var(--el-text-color-disabled);
    }

    .list-card-item_detail--operation--tag {
      color: #bababa;
    }
  }
}
</style>
