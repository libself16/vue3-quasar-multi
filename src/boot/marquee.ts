import { boot } from 'quasar/wrappers';
import Vue3Marquee from 'vue3-marquee';

/* eslint-enable @typescript-eslint/no-empty-interface */

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(Vue3Marquee);
});
