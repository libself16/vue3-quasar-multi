<template>
  <div class="team-report-table">
    <div class="team-people-list">
      <div v-for="item in timeRangeTeamOverViewRows" :key="item.name" class="team-people-item">
        <p class="item-name">{{ item.name }}</p>
        <p class="item-number">{{ item.number }}</p>
      </div>
    </div>
    <p class="data-overview-title">{{ $t("shareholder_platform.data_overview") }}</p>
    <div class="data-overview">
      <p class="text-center text-base font-bold">{{ $t("shareholder_platform.my_team") }}</p>
      <div class="data-overview-list">
        <div v-for="item in teamOverViewDataRows" :key="item.name" class="data-overview-item">
          <p class="item-name">{{ item.name }}</p>
          <p class="item-number">{{ item.count }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useShareholder } from "src/common/composables/useShareholder"

const { fetchTimeRangeTeamOverView, fetchTeamOverView, timeRangeTeamOverViewRows, teamOverViewDataRows } =
  useShareholder()

onMounted(async () => {
  await fetchTimeRangeTeamOverView()
  await fetchTeamOverView()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/shareholder.scss";

.team-people-list {
  @apply grid grid-cols-3 gap-[1.25rem] my-[1.25rem];

  .team-people-item {
    @apply flex flex-col items-center justify-center p-[1.25rem] rounded-[.625rem];
    background: $neutral01;
    box-shadow: $shadow02;

    .item-number {
      @apply text-base font-bold;
      color: $primary04;
    }
  }

  @include phone-width {
    @apply grid-cols-1 gap-[.625rem];
  }
}

.data-overview-title {
  @apply text-base font-bold mb-[.625rem];
  color: $primary04;
}

.data-overview {
  @apply flex flex-col gap-[1.25rem] p-[1.25rem] rounded-[.625rem];
  background: $primary04;
  color: $neutral01;

  @include phone-width {
    @apply p-[.625rem];
  }

  .data-overview-list {
    @apply grid grid-cols-3 gap-[1.25rem];

    @include phone-width {
      @apply grid-cols-1 gap-[.625rem];
    }
  }

  .data-overview-item {
    @apply flex flex-col justify-center items-center rounded-[.625rem] p-[1.25rem];
    background: $primary06;

    .item-name {
      color: $primary02;
    }

    .item-number {
      @apply text-[2rem] font-bold mt-[0.625rem];
    }
  }
}
</style>
