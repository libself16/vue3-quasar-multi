<template>
  <div class="shareholder-mobile-card">
    <template v-if="rows && rows.length > 0">
      <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="card-item" @click="handleRowClick?.(null, row, null)">
        <div v-for="(col, colIndex) in columns" :key="colIndex" class="data-row">
          <span class="data-label">{{ col.label }}:</span>
          <span :class="['data-value', col.classes ? col.classes(row) : '']">
            {{ getFieldValue(col, row) }}
          </span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="shareholder-no-data-container">
        <!-- <q-img v-if="getWideLogo" :src="getWideLogo()" lazy-load /> -->
        <span>{{ $t("common.btn.no_update") }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useLogo } from "src/common/composables/useLogo"

const { getWideLogo } = useLogo()

// 通用列类型定义
interface ShareholderColumn {
  name: string
  label: string
  align?: "left" | "right" | "center"
  field: (row: any) => any
  format?: (val: any) => string
  classes?: (row: any) => string
  style?: string
}

interface Props {
  rows?: any[]
  columns?: ShareholderColumn[]
  handleRowClick?: (evt: Event | null, row: any, index: number | null) => void
}

const props = withDefaults(defineProps<Props>(), {
  rows: () => [],
  columns: () => []
})

// 获取字段值的函数
const getFieldValue = (col: ShareholderColumn, row: any) => {
  try {
    const fieldValue = col.field(row)
    return col.format ? col.format(fieldValue) : fieldValue
  } catch (error) {
    console.error("Error getting field value:", error)
    return "-"
  }
}
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/shareholder.scss";

.shareholder-mobile-card {
  @apply flex flex-col gap-[1.25rem] mt-[1.25rem];

  .card-item {
    @apply p-4 rounded-lg;
    background: $primary08;
    border: 1px solid $primary05;

    .data-row {
      @apply flex justify-between items-center py-2;
      color: $neutral01;

      .data-label {
        color: $primary02;
        font-weight: bold;
      }

      .data-value {
        &.text-positive {
          color: $secondary01;
        }
        &.text-negative {
          color: $primary04;
        }
      }
    }

    .data-row:not(:last-child) {
      border-bottom: 1px solid $secondary02;
    }
  }

  .shareholder-no-data-container {
    @apply flex flex-col items-center justify-center p-8 gap-4;

    .q-img {
      max-width: 150px;
      opacity: 0.6;
    }
  }
}
</style>
