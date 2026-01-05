<template>
  <div class="search-content text-xl font-semibold">
    <p class="text-[#FFF4F4]">{{ $t("collaboration.search_content") }}</p>
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
      <q-btn color="primary" text-color="black" class="hide-hover btn-search" @click="submit">{{
        $t("common.btn.search")
      }}</q-btn>
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
@import "app/template/okbet_red/assets/css/_variable.sass";
@import "app/template/okbet_red/assets/css/button.scss";

.pc-form-row {
  @apply flex items-center gap-5;
  color: #fff4f4;

  .q-input {
    @apply w-[13.75rem] h-[3rem];
    background: $white-color;
    border-radius: 0.5rem;

    :deep(.q-field__control) {
      @apply h-[3rem];
      background: $white-color;
      border-radius: 0.5rem;

      &::before {
        background: $white-color;
      }

      &::after {
        background: transparent;
      }
    }
  }
  .q-select {
    @apply w-[9rem] h-[2.5rem] rounded-[3.125rem];
    background: $white-color;

    :deep(.q-field__control) {
      @apply h-[2.5rem] rounded-[3.125rem];
      background: $white-color;

      &::before {
        background: $white-color;
      }

      &::after {
        background: transparent;
      }

      .q-field__native {
        @apply justify-center;
      }
    }
  }
}
.btn-search {
  @apply ml-5 w-[9.375rem] h-[2.5625rem] rounded-[3.125rem] capitalize;
  font-size: 1rem;
}
</style>
