import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { registerSW } from "virtual:pwa-register";

// add this to prompt for a refresh
const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm('发现新版本，是否更新客户端？')) {
            updateSW(true);
        }
    },
});

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus)

app.use(router)

app.mount('#app')
