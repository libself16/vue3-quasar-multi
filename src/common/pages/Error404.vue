<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">404</div>
      <div>now lang : {{ qLang }}</div>
      <div class="text-h2" style="opacity: 0.4">Oops. Nothing here...</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="返回首頁"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'error-404',
  setup() {
    return {};
  },
  computed: {},
});
</script>

<style>
.q-date__main {
  color: #000;
}
</style>
