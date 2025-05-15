/// <reference types="vite/client" />
/// <reference types="unplugin-icons/types/vue" />

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module '@wangeditor/editor-for-vue' {
  const Editor: any;
  const Toolbar: any;
  type IEditorConfig = any;
  type InsertFnType = (url: string, alt: string, href: string) => void
}
