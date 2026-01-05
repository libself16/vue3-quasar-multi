<template>
  <div class="terms-wrapper px-[10px]">
    <!-- <q-list>
      <q-expansion-item
        v-for="(item, index) in TermsConditionsList"
        :key="index"
        dense
        dense-toggle
        expand-separator
        class="expend-title custom-expansion-item"
      >
        <template v-slot:header="{ expanded }">
          <q-item-section> {{ index + 1 }}. {{ item.title }} </q-item-section>
          <q-item-section side>
            <i class="fa-solid fa-angle-up custom-icon" :class="{ expanded: expanded }"></i>
          </q-item-section>
        </template>
        <q-card class="expend-card">
          <q-card-section>
            <ul>
              <li v-for="(detail, detailIndex) in item.detail" :key="detailIndex" class="card-content">
                <template v-if="typeof detail === 'string'">{{ detail }}</template>
                <template v-else>
                  <p>{{ detail.main }}</p>
                  <ul>
                    <li v-for="(subItem, subIndex) in detail.subItems" :key="subIndex">{{ subItem }}</li>
                  </ul>
                </template>
              </li>
            </ul>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list> -->
    <q-list>
      <q-expansion-item
        v-for="(item, index) in webInformationMenuList"
        :key="index"
        dense
        dense-toggle
        expand-separator
        class="expend-title custom-expansion-item"
      >
        <template v-slot:header="{ expanded }">
          <q-item-section> {{ index + 1 }}. {{ item.title }} </q-item-section>
          <q-item-section side>
            <i class="fa-solid fa-angle-up custom-icon" :class="{ expanded: expanded }"></i>
          </q-item-section>
        </template>
        <q-card class="expend-card">
          <q-card-section>
            <div class="detail" v-html="item.content"></div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script lang="ts" setup>
import { useEnv } from "src/common/hooks/useEnv"
import { useCms } from "src/common/composables/useCms"
import { CMS_TYPE } from "src/common/utils/constants"
import { onMounted, ref, Ref } from "vue"

const { companyName } = useEnv()
const { handleCmsList, webInformationMenuList } = useCms()

interface DetailItem {
  main: string
  subItems: string[]
}

interface InformationItem {
  title: string
  detail: (string | DetailItem)[]
}

onMounted(async () => {
  await handleCmsList(CMS_TYPE.Enums.WEBSITE_INFORMATION)
})
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";

.terms-wrapper {
  @apply pt-[10px] pb-[80px];
}

.expend-title {
  @apply flex w-full text-black mb-[5px] font-medium cursor-pointer;
  background: $gradient-to-bottom;
  font-size: 1rem;
  border-radius: 0.3125rem;

  ::v-deep(.q-expansion-item__container) {
    @apply flex flex-col w-full;

    .q-item-type {
      @apply flex w-full;
    }

    .q-expansion-item__content {
      background: #2b2b2b;
    }

    .expend-card {
      color: $primary;
      background: #2b2b2b;

      ul {
        @apply list-disc px-4;
      }

      .card-content {
        @apply mb-4;

        &:last-child {
          @apply mb-0;
        }
      }
    }
  }
}

.custom-expansion-item {
  :deep(.q-expansion-item__toggle-icon) {
    display: none;
  }
}

.custom-icon {
  font-size: 0.75rem;
  transition: transform 0.3s ease;
  color: $dark;
  transform: rotate(180deg);

  &.expanded {
    transform: rotate(360deg);
  }
}
</style>
