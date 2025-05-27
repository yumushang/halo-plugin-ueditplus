<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, onMounted, watch } from 'vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { Attachment } from "@halo-dev/api-client";

const props = withDefaults(
  defineProps<{
    raw: string;
    title: string;
    content: string;
    uploadImage?: (file: File) => Promise<Attachment>;
  }>(),
  {
    title: "",
    raw: "",
    content: "",
    uploadImage: undefined,
  }
);

const emit = defineEmits<{
  (event: "update:title", value: string): void;
  (event: "update:raw", value: string): void;
  (event: "update:content", value: string): void;
  (event: "update", value: string): void;
}>();

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 内容 HTML
const mode = 'default' // 编辑器模式，'simple' 或 'default'
const toolbarConfig = {
  excludeKeys:['uploadVideo']
};
const editorConfig = {
  placeholder: '请输入内容...',
  scroll: false, // 禁止编辑器滚动
  MENU_CONF: {
    uploadImage: {
      customUpload(file: File, insertFn: any){
        if (props.uploadImage) {
          props.uploadImage(file).then((res: Attachment) => {
            if (!res.status) {
              return;
            }
            // Insert Image
            insertFn(res.status.permalink, res.spec.displayName, res.status.permalink);
          });
        }
      }
    }
  }
};


// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor:any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
const handleChange = (editor:any) => {
  console.log('change:', editor.children)
  console.log('change2:', editor.getHtml())
  emit("update:raw", editor.getHtml());
  emit("update:content", editor.getHtml());
}
const inTitle = ref('');
watch(
  () => props.title,
  (val) => {
    inTitle.value = val;
  },
  { immediate: true, deep: true }
);
const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  inTitle.value = target.value
  emit("update:title", inTitle.value);
}
</script>

<template>
  
  <div >
    <div style="border-bottom: 1px solid #e8e8e8;">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
    </div>
    <div id="content">
      <div id="editor-container">
        <div id="title-container">
          <input v-model="inTitle" @input="handleInput" placeholder="输入标题...">
        </div>
        <Editor
          v-model="raw"
          :defaultConfig="editorConfig"
          :mode="mode"
          style="min-height: 900px;"
          @onCreated="handleCreated"
          @onChange="handleChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#top-container {
  border-bottom: 1px solid #e8e8e8;
  padding-left: 30px;
}

#editor-toolbar {
  width: 1350px;
  background-color: #FCFCFC;
  margin: 0 auto;
}

#content {
  height: calc(100% - 40px);
  background-color: rgb(245, 245, 245);
  overflow-y: auto;
  position: relative;
}

#editor-container {
  width: 1200px;
  margin: 30px auto 150px auto;
  background-color: #fff;
  padding: 20px 50px 50px 50px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 10px rgb(0 0 0 / 12%);
}

#title-container {
  padding: 20px 0;
  border-bottom: 1px solid #e8e8e8;
}

#title-container input {
  font-size: 30px;
  border: 0;
  outline: none;
  width: 100%;
  line-height: 1;
}

#editor-text-area {
  min-height: 900px;
  margin-top: 20px;
}
</style>
