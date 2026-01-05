<template>
  <q-btn class="hide-hover btn-add" @click="openAddDomainDialog">
    {{ $t("collaboration.add_domain_management") }}
  </q-btn>
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
          <q-card-section class="domain-box">
            <p class="target-text">{{ $t("collaboration.target_location") }}</p>
            <p class="host-text">
              {{ host }}
              <q-icon name="fa-solid fa-copy" class="cursor-pointer copy-img" @click="copyMessage(host)"></q-icon>
            </p>
          </q-card-section>
          <q-card-section class="domain-box">
            <p class="flex items-start flex-nowrap">
              <q-icon name="error" color="primary" size="sm" class="mr-2"></q-icon>
              <span class="tips">
                {{ $t("collaboration.tip") }}
              </span>
            </p>
            <p class="domain-input-area">
              <span class="flex-1 mr-[0.5625rem] text-right">
                {{ $t("collaboration.domain_name") }}
              </span>
              <q-input
                v-model="addDomainForm.title"
                class="w-[10.625rem]"
                :rules="[Rules.required()]"
                lazy-rules
              ></q-input>
            </p>
            <p class="domain-input-area second">
              <span class="flex-1 mr-[0.5625rem] text-right">
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
import Pagination from "app/template/set_r022/components/Pagination/Index.vue"

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
@import "app/template/set_r022/assets/css/_variable.scss";
@import "app/template/set_r022/assets/css/referral.scss";
@import "app/template/set_r022/assets/css/button.scss";

.btn-add {
  border-radius: 0.5rem;
  padding: 0.625rem 2.4375rem;
  margin-bottom: 1.25rem;
  font-size: 1rem;
  min-height: unset;
  line-height: normal;
  background: var(--primary-01);
}

.mobile-domain-dialog {
  width: 100%;
  max-width: 19.6875rem;
  max-height: calc(100vh - 80px) !important;
  padding: 1.25rem;
  border-radius: 0.75rem;
  background: var(--neutral-01);

  .domain-box {
    border: 2px solid var(--neutral-03) !important;
    border-radius: 0.625rem !important;
    font-size: 1rem;
    padding: 1.25rem 1rem;
    margin-top: 1.75rem;

    .target-text {
      color: var(--neutral-09);
    }

    .host-text {
      margin-top: 1.25rem;
      color: var(--neutral-09);
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .copy-img {
        color: var(--primary-01);
        margin-left: 0.9375rem;
      }
    }

    .tips {
      font-weight: 400;
      color: var(--neutral-09);
    }

    .domain-input-area {
      width: 100%;
      margin-top: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--neutral-09);
      font-size: 0.9375rem;

      &.second {
        margin-bottom: 0;
      }

      .domain-input {
        width: 18.1875rem;
        height: 2.5rem;
        padding: 0;

        :deep(.q-field__control) {
          height: 2.5rem;

          &::before {
            border-color: var(--neutral-03);
          }
        }
      }
    }
  }

  .dialog-title {
    color: var(--neutral-10);
    font-family: "Noto Sans TC";
    font-size: 1.25rem;
    font-weight: 700;
  }

  .action-btns {
    @apply p-0 mt-[1.6875rem] flex flex-col justify-center gap-4;

    .q-btn {
      @apply w-full h-[3.125rem]  border-2;
      border-radius: 0.625rem;
      font-size: 1rem;
      font-weight: 600;

      &.btn-cancel {
        color: var(--primary-01);
        background: var(--primary-04) !important;

        &::before {
          border-width: 2px;
          border-color: var(--primary-01);
        }
      }

      &.btn-submit {
        background-color: var(--primary-01);
        color: var(--text-01);
      }
    }
  }
}
</style>
