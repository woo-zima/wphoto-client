import MyTable from './MyTable/MyTable.vue';
import WaterFall from './WaterFall/WaterFall.vue';

const components = {
  MyTable,
  WaterFall,
};
export default {
  install(app) {
    for (let c in components) {
      app.component(c, components[c]);
    }
  },
};
