import { definePlugin, type EditorProvider } from "@halo-dev/console-shared";
import { markRaw } from "vue";
import UEditorPlusEdit from "./views/UEditorPlusEdit.vue";
import logo from './assets/logo.svg'

export default definePlugin({
  extensionPoints: {
    "editor:create": (): EditorProvider[] => {
      return [
        {
          name: "ueditor",
          displayName: "富文本编辑器",
          component: markRaw(UEditorPlusEdit),
          rawType: "html",
          logo: logo
        },
      ];
    },
  },
});
