import { createApp } from 'vue';
import App from './App.vue';
import api from './api';
import { createPinia } from 'pinia';
import router from './router';
import ElementPlus from 'element-plus';
import MyUI from './modules/my-ui';

const app = createApp(App);
const pinia = createPinia();
app.provide('$api', api);
app.use(router).use(ElementPlus).use(MyUI).use(pinia).mount('#app');
