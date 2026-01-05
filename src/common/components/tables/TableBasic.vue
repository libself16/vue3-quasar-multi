<template>
  <q-card class="no-shadow" bordered>
    <q-card-section>
      <div class="text-h6 text-grey-8">Basic</div>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section class="q-pa-none">
      <q-table
        square
        separator="cell"
        :rows="props.tableData"
        :columns="props.tableColumn"
        row-key="name"
        :filter="filter"
      >
        <template v-slot:top-right>
          <q-input
            v-if="show_filter"
            filled
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-btn
            class="q-ml-sm"
            icon="filter_list"
            @click="show_filter = !show_filter"
            flat
          />
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';

interface Props {
  tableData: Array<any>;
  tableColumn: Array<any>;
}

const props = withDefaults(defineProps<Props>(), {
  tableData: () => [],
  tableColumn: () => [],
});

const show_filter = ref(false);
const filter = ref('');
</script>

<style scoped></style>
