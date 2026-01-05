<template>
  <div class="search-content text-xl font-semibold">
    <p>{{ $t("collaboration.search_content") }}</p>
    <div class="mt-6 pc-form-row">
      {{ $t("collaboration.member_account") }}
      <q-input
        v-model="invitationState.query.member_account"
        filled
        dense
        :placeholder="$t('collaboration.account_number')"
      ></q-input>
    </div>
    <div class="mt-[2.1875rem] flex items-center">
      <div class="pc-form-row">
        {{ $t("collaboration.status") }}
        <q-select
          v-model="invitationState.query.status"
          :options="statusDropDown"
          filled
          dense
          emit-value
          map-options
        ></q-select>
      </div>
      <div class="pc-form-row ml-[3.75rem]">
        {{ $t("collaboration.currency") }}
        <q-select
          v-model="invitationState.query.currency_id"
          :options="props.walletDropdown"
          filled
          dense
          emit-value
          map-options
        ></q-select>
      </div>
      <q-btn class="hide-hover btn-search" @click="submit">{{ $t("common.btn.search") }}</q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useInvitation } from "src/common/composables/useInvitation"
import { BaseListType } from "src/api/response.type"

const props = defineProps({
  walletDropdown: {
    type: Array<BaseListType>,
    required: true,
    default: () => []
  }
})

const { invitationState, statusDropDown, getInvitationList, initInvitationState, submit } = useInvitation()

onMounted(() => {
  initInvitationState()
  getInvitationList()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/_variable.sass";
@import "app/template/okbet_blackGold/assets/css/button.scss";

.pc-form-row {
  @apply flex items-center gap-5;
  .q-input {
    @apply w-[13.75rem] h-[3rem];
    :deep(.q-field__control) {
      @apply h-[3rem];
    }
    :deep(.q-field--filled .q-field__control:before) {
      border-bottom: 1px solid $gray-border-color;
    }
  }
  .q-select {
    @apply w-[9rem] h-[2.5rem] rounded-[3.125rem];
    :deep(.q-field__control) {
      @apply h-[2.5rem] rounded-[3.125rem];
      border: 1px solid $gray-border-color;
      .q-field__native {
        color: $primary-white-color;
        @apply justify-center;
      }
    }
    :deep(.q-icon) {
      color: $primary-white-color;
    }
  }
}
.btn-search {
  @apply ml-5 w-[9.375rem] h-[2.5625rem] rounded-[3.125rem] capitalize;
  font-size: 1rem;
  background: $primary-gradient-color;
  color: $primary-text-black;
}
</style>
