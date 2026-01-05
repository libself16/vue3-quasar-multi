<template>
  <q-btn color="primary" class="hide-hover btn-add" @click="openAddDomainDialog">{{
    $t("collaboration.add_domain_management")
  }}</q-btn>
  <div class="mobile-invite-list">
    <div class="list-wrapper" v-if="domainState.list.length">
      <q-card class="list-item" v-for="(item, index) in domainState.list" :key="index">
        <q-card-section class="list-item-section">
          <q-expansion-item class="expansion-wrapper">
            <template v-slot:header>
              <q-item-section class="expansion-info">
                <q-item-label class="expansion-info-title">{{ $t("collaboration.domain_name") }}</q-item-label>
                <q-item-label class="expansion-info-value !mt-4">{{ item.title }}</q-item-label>
              </q-item-section>

              <q-item-section class="expansion-info">
                <q-item-label class="expansion-info-title">{{ $t("collaboration.status") }}</q-item-label>
                <q-item-label class="expansion-info-value !mt-2">
                  <span
                    class="revenue-status"
                    :class="{
                      red: item.status === DOMAIN_TYPE.Enums.EXPIRED,
                      green: item.status === DOMAIN_TYPE.Enums.IN_USE,
                      blue: item.status === DOMAIN_TYPE.Enums.ADDING
                    }"
                  >
                    {{ $t(DOMAIN_TYPE.I18nKeys[item.status as DOMAIN_TYPE.Enums]) }}
                  </span>
                </q-item-label>
              </q-item-section>
            </template>
            <q-card>
              <q-card-section class="revenue-wrapper">
                <div class="revenue-item">
                  <span>{{ $t("collaboration.domain") }}</span>
                  <span>{{ item.name }}</span>
                </div>
                <div class="revenue-item">
                  <span>{{ $t("collaboration.add_time") }}</span>
                  <span>{{ item.created_at }}</span>
                </div>
                <div class="revenue-item">
                  <span>{{ $t("collaboration.expiration_time") }}</span>
                  <span> {{ item.expired_at }} </span>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>
      <div class="referral-pagination-wrapper">
        <Pagination
          v-model="domainState.pagination.page"
          :total-pages="totalPages"
          :max-pages="3"
          @update:model-value="handlePagination"
        />
      </div>
    </div>
    <div v-else class="referral-no-data-container">
      <q-img v-if="getWideLogo" :src="getWideLogo()" lazy-load />
      <span>{{ $t("tableHeader.no_data") }}</span>
    </div>
    <q-dialog v-model="dialog" persistent>
      <q-card class="mobile-domain-dialog">
        <q-form @submit="submit">
          <q-card-section class="flex items-center p-0">
            <p class="dialog-title">
              {{ $t("collaboration.add_domain_application") }}
            </p>
            <q-space />
            <q-btn class="text-md hide-hover" icon="close" :loading="isLoading" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section class="domain-box py-[1.3438rem] px-[2.875rem] mt-2">
            <p class="target-text">{{ $t("collaboration.target_location") }}</p>
            <p class="host-text">
              {{ host }}
              <q-icon
                name="fa-solid fa-copy"
                color="primary"
                class="cursor-pointer ml-4"
                @click="copyMessage(host)"
              ></q-icon>
            </p>
          </q-card-section>
          <q-card-section class="domain-box mt-[1.125rem] py-[1.1875rem] px-4">
            <p class="flex items-start flex-nowrap">
              <q-icon name="error" color="primary" size="sm" class="mr-2"></q-icon>
              <span class="tips">
                {{ $t("collaboration.tip") }}
              </span>
            </p>
            <p class="mt-[2.0625rem] flex flex-nowrap items-baseline gap-2">
              <span class="w-[4.375rem] text-right tips">
                {{ $t("collaboration.domain_name") }}
              </span>
              <q-input
                v-model="addDomainForm.title"
                class="w-[10.625rem]"
                :rules="[Rules.required()]"
                lazy-rules
              ></q-input>
            </p>
            <p class="mt-[.5981rem] flex flex-nowrap items-baseline gap-2">
              <span class="w-[4.375rem] text-right tips">
                {{ $t("collaboration.domain") }}
              </span>
              <q-input
                v-model="addDomainForm.name"
                class="w-[10.625rem]"
                :rules="[Rules.required()]"
                lazy-rules
              ></q-input>
            </p>
          </q-card-section>
          <q-card-section class="action-btns">
            <q-btn class="btn-cancel" outline :loading="isLoading" v-close-popup>{{ $t("common.btn.cancel") }}</q-btn>
            <q-btn class="btn-submit" :loading="isLoading" type="submit">{{ $t("common.btn.confirm") }}</q-btn>
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useDomain } from "src/common/composables/useDomain"
import { useRule } from "src/common/hooks/useRule"
import { useLogo } from "src/common/composables/useLogo"
import { DOMAIN_TYPE } from "src/common/utils/constants"
import Pagination from "app/template/bmm_set_obtd/components/Pagination/Index.vue"

const { getWideLogo } = useLogo()
const { copyMessage } = useCommon()
const {
  host,
  addDomainForm,
  isLoading,
  domainState,
  totalPages,
  initAddDomainForm,
  handleAddDomain,
  handleGetDomainList,
  handlePagination
} = useDomain()
const Rules = useRule()

const dialog = ref(false)

const openAddDomainDialog = () => {
  initAddDomainForm()
  dialog.value = true
}

const submit = async () => {
  const { status } = await handleAddDomain()

  if (status) {
    await handleGetDomainList()
    dialog.value = false
  }
}

onMounted(() => {
  handleGetDomainList()
})
</script>

<style scoped lang="scss">
@import "app/template/bmm_set_obtd/assets/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/referral.scss";
@import "app/template/bmm_set_obtd/assets/css/button.scss";

.btn-add {
  @apply px-[1.5388rem] py-[.4688rem] rounded-[1.9569rem];
  font-size: 0.7825rem;
  line-height: 1.0662rem;
  font-weight: 400;
}

.mobile-domain-dialog {
  width: 100%;
  max-width: 19.6875rem;
  max-height: calc(100vh - 80px) !important;
  padding: 0.375rem 0.75rem 2.125rem;
  border-radius: 0.75rem;
  background: $background-light-color;

  .domain-box {
    border: 2px solid $border-pale-gray-color !important;
    border-radius: 0.625rem !important;
    font-size: 1rem;
    line-height: 21.79px;

    .target-text {
      color: rgba($text-dark-color, 0.5);
    }

    .host-text {
      margin-top: 1.5rem;
      color: rgba($text-dark-color, 0.7);
    }

    .tips {
      font-weight: 400;
      color: $text-charcoal-gray-color;
    }
  }

  .dialog-title {
    @apply pt-4 pl-2 text-xl font-normal;
    color: $primary-color;
    font-family: "Noto Sans TC";
    max-width: 80%;
  }

  .action-btns {
    @apply p-0 mt-[1.6875rem] flex flex-col justify-center gap-4;

    .q-btn {
      @apply w-full h-[3.125rem]  border-2;
      border-radius: 0.625rem;
      font-size: 1rem;
      font-weight: 600;

      &.btn-cancel {
        color: $primary-color;
        &::before {
          border-width: 2px;
        }
      }

      &.btn-submit {
        background-color: $primary-color;
        color: $text-light-color;
      }
    }
  }
}
</style>
