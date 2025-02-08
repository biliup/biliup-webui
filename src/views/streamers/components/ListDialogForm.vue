<script setup lang="ts">
import { ref, watch } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import { enableCache } from "@iconify/vue/dist/iconify.js";

// 模拟下拉框的投稿模板选项，实际可从接口获取
const UPLOAD_TEMPLATE_OPTIONS = [
  { label: "模板A", value: 1 },
  { label: "模板B", value: 2 },
  { label: "模板C", value: 3 }
];

const OVERRIDE_OPTIONS = [
  {
    label: "下载插件",
    value: "downloader",
    type: "select",
    options: ["streamlink", "ffmpeg", "stream-gears", "sync-downloader"]
  },
  { label: "视频分段大小", value: "file_size" },
  { label: "视频分段时长", value: "segment_time" },
  { label: "文件名模板", value: "filename_prefix" },
  { label: "碎片过滤", value: "filtering_threshold" }
];

const FILTER_KEYS = [
  { label: "直播标题", value: "room_title" },
  { label: "时间范围", value: "time_range" },
  { label: "直播分区", value: "live_area" }
];

const OPERATOR_OPTIONS = [
  { label: "等于", value: "equals" },
  { label: "不等于", value: "not equals" },
  { label: "包含", value: "contains" },
  { label: "不包含", value: "not contains" }
];
const LOGIC_OPTIONS = ["and", "or"]; // 逻辑操作符

// 定义接收的 props
interface Props {
  visible: boolean;
  data?: Record<string, any>;
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => ({})
  }
} as const) as Props;

const emit = defineEmits(["update:visible", "onOk"]);

// 用于控制弹窗显示/隐藏
const formVisible = ref(false);

// 表单引用和表单数据
const formRef = ref<FormInstance>();
const formData = ref({
  id: 0,
  remark: "",
  url: "",
  enable: true,
  upload_id: 0,
  postprocessor: [{ cmd: "rm", value: "" }],
  format: "flv",
  filename_prefix: "",
  time_range: "",
  preprocessor: [],
  segment_processor: [],
  downloaded_processor: [],
  opt_args: [],
  override: [],
  filters: []
});

// 必填提示
const requiredMsg = "该项为必填项";

// 定义简单验证规则
const rules = {
  remark: [{ required: true, message: requiredMsg, trigger: "blur" }],
  url: [{ required: true, message: requiredMsg, trigger: "blur" }]
};

// 监听 props.visible，同步组件内的 formVisible
watch(
  () => props.visible,
  newVal => {
    formVisible.value = newVal;
    if (newVal) {
      initFormData();
    }
  }
);

// 监听 props.data，赋值给表单数据
watch(
  () => props.data,
  newData => {
    // 深拷贝数据
    formData.value = {
      id: newData.id || 0,
      remark: newData.remark || "",
      url: newData.url || "",
      enable: newData.enable || true,
      upload_id: newData.upload_id || 0,
      postprocessor:
        newData.postprocessor?.length > 0
          ? [...newData.postprocessor]
          : [{ cmd: "rm", value: "" }],
      format: newData.format || "flv",
      filename_prefix: newData.filename_prefix || "",
      time_range: newData.time_range || "",
      preprocessor: newData.preprocessor || [],
      segment_processor: newData.segment_processor || [],
      downloaded_processor: newData.downloaded_processor || [],
      opt_args: newData.opt_args || [],
      override: newData.override || [],
      filters: newData.filters || []
    };
  },
  { immediate: true } // 初始化时赋值
);

// 初始化表单数据
function initFormData() {
  formData.value = {
    id: props.data?.id || 0,
    remark: props.data?.remark || "",
    url: props.data?.url || "",
    enable: props.data.enable || true,
    upload_id: props.data?.upload_id || 0,
    postprocessor:
      props.data?.postprocessor?.length > 0
        ? [...props.data.postprocessor]
        : [{ cmd: "rm", value: "" }],
    format: props.data?.format || "flv",
    filename_prefix: props.data?.filename_prefix || "",
    time_range: props.data?.time_range || "",
    preprocessor: props.data?.preprocessor || [],
    segment_processor: props.data?.segment_processor || [],
    downloaded_processor: props.data?.downloaded_processor || [],
    opt_args: props.data?.opt_args || [],
    override: props.data?.override || [],
    filters: props.data?.filters || []
  };
}

// 提交
function handleSubmit() {
  formRef.value?.validate(async valid => {
    if (!valid) return;
    try {
      emit("onOk", formData.value);
      console.log("提交的数据：", formData.value);
      closeDialog();
      ElMessage.success("提交成功");
    } catch (err) {
      ElMessage.error("提交失败");
    }
  });
}

// 关闭对话框
function closeDialog() {
  formVisible.value = false;
  emit("update:visible", false);
}

// ============== 以下是各数组字段的 添加/删除 操作 ==============

// 后处理 postprocessor
function addPostprocessor() {
  formData.value.postprocessor.push({ cmd: "rm", value: "" });
}
function removePostprocessor(index: number) {
  if (formData.value.postprocessor.length <= 1) return;
  formData.value.postprocessor.splice(index, 1);
}

// 下载前处理 preprocessor
function addPreprocessor() {
  formData.value.preprocessor.push({ run: "" });
}
function removePreprocessor(index: number) {
  formData.value.preprocessor.splice(index, 1);
}

// 分段时后处理 segment_processor
function addSegmentProcessor() {
  formData.value.segment_processor.push({ run: "" });
}
function removeSegmentProcessor(index: number) {
  formData.value.segment_processor.splice(index, 1);
}

// 下载后处理 downloaded_processor
function addDownloadedProcessor() {
  formData.value.downloaded_processor.push({ run: "" });
}
function removeDownloadedProcessor(index: number) {
  formData.value.downloaded_processor.splice(index, 1);
}

// ffmpeg参数 opt_args
function addOptArg() {
  formData.value.opt_args.push("");
}
function removeOptArg(index: number) {
  formData.value.opt_args.splice(index, 1);
}

// override
function addOverwrite() {
  formData.value.override.push({ key: "", value: "" });
}

function removeOverwrite(index: number) {
  if (formData.value.override.length <= 1) return;
  formData.value.override.splice(index, 1);
}

// filters
function addFilter() {
  formData.value.filters.push({
    key: "",
    operator: "equals",
    value: "",
    logic: "and"
  });
}

function removeFilter(index: number) {
  if (formData.value.filters.length <= 1) return;
  formData.value.filters.splice(index, 1);
}
</script>

<template>
  <!-- 弹窗 -->
  <el-dialog
    v-model="formVisible"
    title="录播管理"
    width="700px"
    draggable
    :before-close="closeDialog"
  >
    <!-- 表单区域 -->
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-position="top"
      class="form-container"
    >
      <!-- 录播备注 -->
      <el-form-item label="录播备注" prop="remark">
        <el-input
          v-model="formData.remark"
          class="input-480"
          placeholder="请输入录播备注"
        />
      </el-form-item>

      <!-- 直播链接 -->
      <el-form-item label="直播链接" prop="url">
        <el-input
          v-model="formData.url"
          class="input-480"
          placeholder="请输入直播链接"
        />
      </el-form-item>

      <!-- 是否启用 -->
      <el-form-item label="是否启用" prop="enable">
        <el-switch
          v-model="formData.enable"
          active-text="启用"
          inactive-text="禁用"
        />
      </el-form-item>

      <!-- 投稿模板 -->
      <el-form-item label="投稿模板" prop="upload_id">
        <el-select
          v-model="formData.upload_id"
          class="select-240"
          clearable
          placeholder="选择投稿模板"
        >
          <el-option
            v-for="(opt, idx) in UPLOAD_TEMPLATE_OPTIONS"
            :key="idx"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <!-- 后处理 -->
      <el-form-item label="后处理">
        <el-col :span="24">
          <el-button type="primary" link size="small" @click="addPostprocessor">
            添加行
          </el-button>
        </el-col>
        <div>
          <el-row
            v-for="(item, index) in formData.postprocessor"
            :key="index"
            :gutter="10"
            style="display: flex; align-items: center; margin-top: 10px"
          >
            <el-col :span="item.cmd === 'rm' ? 20 : 10">
              <el-select v-model="item.cmd" style="width: 100%">
                <el-option label="run（运行）" value="run" />
                <el-option label="mv（移动到）" value="mv" />
                <el-option label="rm（删除文件）" value="rm" />
              </el-select>
            </el-col>
            <el-col v-if="item.cmd != 'rm'" :span="10">
              <el-input
                v-model="item.value"
                class="input-280"
                placeholder="输入bash 命令"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="4">
              <el-button
                type="danger"
                text
                :disabled="formData.postprocessor.length <= 1"
                @click="removePostprocessor(index)"
              >
                删除
              </el-button>
            </el-col>
          </el-row>
        </div>
        <el-col :span="24" style="margin-top: 15px">
          <div class="el-form-item__description">
            流程无报错结束时触发，将按自定义顺序执行操作。<br />
            示例：<code>rm</code>（删除文件，默认）<br />
            <code>mv = backup/</code>（移动文件到 backup 目录）<br />
            <code>run = echo hello!</code>（执行任意命令，注意风险）
          </div>
        </el-col>
      </el-form-item>

      <!-- 视频格式 -->
      <el-form-item label="视频格式" prop="format">
        <el-input
          v-model="formData.format"
          class="input-240"
          placeholder="例如 flv"
        />
        <div class="el-form-item__description">
          不支持 stream-gears 下载器和 Youtube 平台
        </div>
      </el-form-item>

      <!-- 文件名模板 -->
      <el-form-item label="文件名模板" prop="filename_prefix">
        <el-input
          v-model="formData.filename_prefix"
          class="input-480"
          placeholder="{streamer}%Y-%m-%dT%H_%M_%S"
        />
      </el-form-item>

      <!-- 录制时间范围 -->
      <el-form-item label="录制时间范围" prop="time_range">
        <el-input
          v-model="formData.time_range"
          class="input-240"
          placeholder="01:00:00-02:00:00"
        />
        <div class="el-form-item__description">
          格式：'01:00:00-02:00:00'（时:分:秒-时:分:秒）
        </div>
      </el-form-item>

      <!-- 下载前处理 -->
      <el-form-item label="下载前处理">
        <el-col :span="24">
          <el-button type="primary" link size="small" @click="addPreprocessor"
            >添加行</el-button
          >
        </el-col>
        <div>
          <el-row
            v-for="(item, index) in formData.preprocessor"
            :key="index"
            :gutter="10"
            style="display: flex; align-items: center; margin-top: 10px"
          >
            <el-col :span="20">
              <el-input
                v-model="item.run"
                class="input-400"
                placeholder="run = 命令"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="4">
              <el-button type="danger" text @click="removePreprocessor(index)"
                >删除</el-button
              >
            </el-col>
          </el-row>
        </div>
        <el-col :span="24" style="margin-top: 15px">
          <div class="el-form-item__description">
            下载直播前触发，将按自定义顺序执行自定义操作，仅支持 shell 指令
          </div>
        </el-col>
      </el-form-item>

      <!-- 分段时后处理 -->
      <el-form-item label="分段时后处理">
        <el-col :span="24">
          <el-button
            type="primary"
            link
            size="small"
            @click="addSegmentProcessor"
            >添加行</el-button
          >
        </el-col>
        <div>
          <el-row
            v-for="(item, index) in formData.segment_processor"
            :key="index"
            :gutter="10"
            style="display: flex; align-items: center; margin-top: 10px"
          >
            <el-col :span="20">
              <el-input
                v-model="item.run"
                class="input-400"
                placeholder="run = 命令"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="4">
              <el-button
                type="danger"
                text
                @click="removeSegmentProcessor(index)"
                >删除</el-button
              >
            </el-col>
          </el-row>
        </div>
        <el-col :span="24" style="margin-top: 15px">
          <div class="el-form-item__description">
            分段时触发，将按自定义顺序执行自定义操作，仅支持 shell 指令
          </div>
        </el-col>
      </el-form-item>

      <!-- 下载后处理 -->
      <el-form-item label="下载后处理">
        <el-col :span="24">
          <el-button
            type="primary"
            link
            size="small"
            @click="addDownloadedProcessor"
            >添加行</el-button
          >
        </el-col>
        <div>
          <el-row
            v-for="(item, index) in formData.downloaded_processor"
            :key="index"
            :gutter="10"
            style="display: flex; align-items: center; margin-top: 10px"
          >
            <el-col :span="20">
              <el-input
                v-model="item.run"
                class="input-400"
                placeholder="run = 命令"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="4">
              <el-button
                type="danger"
                text
                @click="removeDownloadedProcessor(index)"
                >删除</el-button
              >
            </el-col>
          </el-row>
        </div>
        <el-col :span="24" style="margin-top: 15px">
          <div class="el-form-item__description">
            准备上传直播时触发，将按自定义顺序执行自定义操作，仅支持 shell
            指令。<br />
            如需对最终视频做改名，请与 filename_prefix
            保持一致，否则可能无法检测到正确文件。
          </div>
        </el-col>
      </el-form-item>

      <!-- ffmpeg参数 -->
      <el-form-item label="ffmpeg参数">
        <el-col :span="24">
          <el-button type="primary" link size="small" @click="addOptArg"
            >添加行</el-button
          >
        </el-col>
        <div>
          <el-row
            v-for="(arg, index) in formData.opt_args"
            :key="index"
            :gutter="10"
            style="display: flex; align-items: center; margin-top: 10px"
          >
            <el-col :span="20">
              <el-input
                v-model="formData.opt_args[index]"
                class="input-400"
                placeholder="单个参数, 如 -ss"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="4">
              <el-button type="danger" text @click="removeOptArg(index)"
                >删除</el-button
              >
            </el-col>
          </el-row>
        </div>
        <el-col :span="24" style="margin-top: 15px">
          <div class="el-form-item__description">
            例如："-ss"、"00:00:16" 等，每个参数需单独一行
          </div>
        </el-col>
      </el-form-item>

      <!-- 全局参数覆写 -->
      <el-form-item label="全局参数覆写">
        <el-col :span="24">
          <el-button type="primary" link size="small" @click="addOverwrite">
            添加行
          </el-button>
        </el-col>
        <div>
          <el-row
            v-for="(item, index) in formData.override"
            :key="index"
            :gutter="10"
            style="display: flex; align-items: center; margin-top: 10px"
          >
            <el-col :span="10">
              <el-select
                v-model="item.key"
                :placeholder="'重写相'"
                style="width: 100%"
              >
                <el-option
                  v-for="key in OVERRIDE_OPTIONS"
                  :key="key.value"
                  :label="key.label"
                  :value="key.value"
                />
              </el-select>
            </el-col>
            <el-col :span="10">
              <!-- 判断 type 是否为 select -->
              <div
                v-if="
                  OVERRIDE_OPTIONS.find(
                    option =>
                      option.value === item.key && option.type === 'select'
                  )
                "
              >
                <el-select
                  v-model="item.value"
                  placeholder="请选择 value"
                  style="width: 100%"
                >
                  <el-option
                    v-for="option in OVERRIDE_OPTIONS.find(
                      option =>
                        option.value === item.key && option.type === 'select'
                    ).options"
                    :key="option"
                    :label="option"
                    :value="option"
                  />
                </el-select>
              </div>
              <!-- 如果不是 select 类型，则使用 el-input -->
              <div v-else>
                <el-input
                  v-model="item.value"
                  placeholder="请输入 value"
                  clearable
                />
              </div>
            </el-col>
            <el-col :span="4">
              <el-button
                type="danger"
                text
                :disabled="formData.override.length <= 1"
                @click="removeOverwrite(index)"
              >
                删除
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-form-item>

      <!-- 过滤器 -->
      <el-form-item label="过滤器">
        <el-col :span="24">
          <el-button type="primary" link size="small" @click="addFilter">
            添加行
          </el-button>
        </el-col>
        <div>
          <el-row
            v-for="(filter, index) in formData.filters"
            :key="index"
            :gutter="10"
            style="display: flex; align-items: center; margin-top: 10px"
          >
            <el-col :span="6">
              <el-select
                v-model="filter.key"
                :placeholder="'选择key'"
                style="width: 100%"
              >
                <el-option
                  v-for="key in FILTER_KEYS"
                  :key="key.value"
                  :label="key.label"
                  :value="key.value"
                />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select
                v-model="filter.operator"
                :placeholder="'选择操作符'"
                style="width: 100%"
              >
                <el-option
                  v-for="operator in OPERATOR_OPTIONS"
                  :key="operator.value"
                  :label="operator.label"
                  :value="operator.value"
                />
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-input v-model="filter.value" placeholder="请输入value" />
            </el-col>
            <el-col :span="5">
              <el-select
                v-model="filter.logic"
                :placeholder="'选择逻辑'"
                style="width: 100%"
              >
                <el-option
                  v-for="logic in LOGIC_OPTIONS"
                  :key="logic"
                  :label="logic"
                  :value="logic"
                />
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button
                type="danger"
                text
                :disabled="formData.filters.length <= 1"
                @click="removeFilter(index)"
              >
                删除
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
    </el-form>

    <!-- 弹窗底部按钮 -->
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.form-container {
  max-height: 70vh;
  padding-right: 8px;
  overflow: auto;
}

.array-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.flex-row {
  display: flex;
  align-items: center;
}
</style>
