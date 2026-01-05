<template>
  <section class="shareholder-platform-wrapper">
    <div class="platform-container">
      <div class="platform-title">
        <q-img :src="shareholderLogo" class="platform-title-logo" />
        <p class="platform-title-text">
          {{ $t("shareholder_platform.shareholder") }}
        </p>
      </div>
      <div class="platform-content">
        <div class="platform-tab">
          <div
            class="platform-tab-item"
            v-for="item in SHAREHOLDER_TABS"
            :key="item.value"
            @click="onShareholderTabClick(item.value, item.label)"
          >
            <q-img :src="shareholderTabImg(item.value)" class="tab-item-img" />
            <p class="tab-item-text">{{ item.label }}</p>
          </div>
        </div>
        <div class="platform-table">
          <div class="platform-table-tabs">
            <div
              class="platform-table-tabs-item"
              v-for="item in SHAREHOLDER_TABLE_TABS.filter((item) => item.isParent)"
              :key="item.value"
              :class="{ active: activeTableTab.value === item.value || activeTableTab.parent === item.value }"
              @click="setActiveTableTab(item)"
            >
              {{ item.label }}
            </div>
          </div>
          <div class="platform-table-content">
            <SearchForm
              v-if="activeTableTab.value !== SHAREHOLDER_TABLE_TABS[0]?.value"
              :activeTableTab="activeTableTab"
            />
            <NewReportTable
              v-if="
                activeTableTab.value === SHAREHOLDER_TABLE_TABS[0]?.value ||
                activeTableTab.parent === SHAREHOLDER_TABLE_TABS[0]?.value
              "
            />
            <MyReportTable
              v-if="
                activeTableTab.value === SHAREHOLDER_TABLE_TABS[1]?.value ||
                activeTableTab.parent === SHAREHOLDER_TABLE_TABS[1]?.value
              "
            />
            <TeamReportTable
              v-if="
                activeTableTab.value === SHAREHOLDER_TABLE_TABS[3]?.value ||
                activeTableTab.parent === SHAREHOLDER_TABLE_TABS[3]?.value
              "
            />
          </div>
        </div>
        <ShareCommunity
          v-if="
            activeTableTab.value === SHAREHOLDER_TABLE_TABS[0]?.value ||
            activeTableTab.parent === SHAREHOLDER_TABLE_TABS[0]?.value
          "
        />
      </div>
    </div>
  </section>
  <q-dialog v-model="isInfoDialogOpen" persistent transition-show="rotate" transition-hide="rotate">
    <q-card class="dialog-card">
      <q-card-section class="dialog-header">
        <p class="dialog-title">{{ $t("shareholder_platform.introduction") }}</p>
        <q-icon class="dialog-close-icon" name="close" @click="isInfoDialogOpen = false" />
      </q-card-section>
      <q-card-section> <div v-html="shareholderInfoLocalized"></div></q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { useShareholder } from "src/common/composables/useShareholder"
import { useLiveChat } from "src/common/hooks/useLiveChat"
import SearchForm from "app/template/set_r016/pages/HomePage/ShareholderPlatform/Components/SearchForm.vue"
import NewReportTable from "app/template/set_r016/pages/HomePage/ShareholderPlatform/NewReportTable/Index.vue"
import MyReportTable from "app/template/set_r016/pages/HomePage/ShareholderPlatform/MyReportTable/Index.vue"
import TeamReportTable from "app/template/set_r016/pages/HomePage/ShareholderPlatform/TeamReportTable/Index.vue"
import ShareCommunity from "app/template/set_r016/pages/HomePage/ShareholderPlatform/Components/ShareCommunity.vue"

const { shareholderLogo, shareholderTabImg } = useSiteImg()
const {
  SHAREHOLDER_TABS,
  SHAREHOLDER_TABLE_TABS,
  activeTableTab,
  setActiveTableTab,
  fetchShareholderInfo,
  shareholderInfoLocalized
} = useShareholder()
const { handleOpenLiveChat } = useLiveChat()
const isInfoDialogOpen = ref(true)

const onShareholderTabClick = (value: string, label: string) => {
  if (value === SHAREHOLDER_TABS.value[0].value) {
    setActiveTableTab(SHAREHOLDER_TABLE_TABS.value[0])
  } else if (value === SHAREHOLDER_TABS.value[1].value) {
    if (isInfoDialogOpen.value) return
    isInfoDialogOpen.value = true
  } else if (value === SHAREHOLDER_TABS.value[2].value) {
    handleOpenLiveChat()
  }
}

onBeforeMount(() => {
  fetchShareholderInfo()
  setActiveTableTab(SHAREHOLDER_TABLE_TABS.value[0])
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";

.shareholder-platform-wrapper {
  @apply max-w-[1200px] mx-auto rounded-[10px];
  background: $primary05;
}

.platform-container {
  @apply flex flex-col;
}

.platform-title {
  @apply flex items-center justify-center gap-2 py-[10px];
  color: $neutral01;

  &-logo {
    @apply w-10 h-10;
  }

  &-text {
    @apply text-2xl font-bold;
  }
}

.platform-content {
  @apply p-[20px] rounded-[10px];
  background: $gradient03;

  .platform-tab {
    @apply flex items-center justify-between gap-[1.25rem];

    &-item {
      @apply flex flex-1 items-center justify-center rounded-[.625rem] p-[1.25rem];
      @apply font-bold text-xl cursor-pointer gap-[.375rem];
      background: $neutral04;
    }

    .tab-item-img {
      @apply w-[1.875rem] h-[1.875rem];
    }

    @include phone-width() {
      @apply flex gap-[6px];

      &-item {
        @apply w-full px-[10px] py-[6px];

        .tab-item-text {
          @apply text-[.625rem];
        }
      }
      .tab-item-img {
        @apply w-[1.25rem] h-[1.25rem];
      }
    }
  }
}

.platform-table {
  @apply mt-[20px] rounded-[10px];
  background: $neutral01;

  @include phone-width {
    @apply mt-2;
  }
  &-tabs {
    @apply flex items-center gap-[20px] p-[20px];

    @include phone-width {
      @apply px-0 py-2;
    }

    &-item {
      @apply flex-1 text-center py-2.5 cursor-pointer relative transition-colors duration-300 ease-in-out;
      color: $neutral09;

      &::after {
        content: "";
        @apply absolute bottom-0 left-0 w-full h-[.125rem] scale-x-0 origin-left transition-transform duration-300 ease-in-out;
        background: $primary04;
      }

      &.active {
        color: $primary04;

        &::after {
          @apply scale-x-100;
        }
      }
    }
  }
}

.platform-table-content {
  @apply rounded-[10px] p-[20px];
  background: $neutral04;
}

.dialog-card {
  @apply w-[18.75rem] max-w-[800px] max-h-[300px] rounded-[10px];

  .dialog-header {
    @apply flex items-center justify-between;
    color: $primary04;
  }

  .dialog-close-icon {
    @apply w-[20px] h-[20px] cursor-pointer;
  }
}
</style>
