<template>
  <div class="referral-table !mt-0">
    <template v-if="domainState.list && domainState.list.length > 0">
      <q-table
        :rows="domainState.list"
        :columns="domainTableColumns"
        row-key="name"
        class="referral-table-content"
        hide-bottom
        :pagination="{
          rowsPerPage: domainState.pagination.size
        }"
      >
        <template #top>
          <q-btn class="hide-hover btn-add" @click="openAddDomainDialog">{{
            $t("collaboration.add_domain_management")
          }}</q-btn>
        </template>
        <template #body="props">
          <q-tr>
            <q-td v-for="col in props.cols" :key="col.name" :props="props" class="!py-3">
              <span v-if="col.name === 'expired_at'" :class="{ 'text-expired': isBeforeNow(col.value) }">
                {{ col.value }}
              </span>
              <span
                v-else-if="col.name === 'status'"
                class="commission-status"
                :class="{
                  red: col.value === DOMAIN_TYPE.Enums.EXPIRED,
                  green: col.value === DOMAIN_TYPE.Enums.IN_USE,
                  blue: col.value === DOMAIN_TYPE.Enums.ADDING
                }"
              >
                {{ $t(DOMAIN_TYPE.I18nKeys[col.value as DOMAIN_TYPE.Enums]) }}
              </span>
              <span v-else> {{ col.value }}</span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="referral-pagination-wrapper">
        <Pagination
          v-model="domainState.pagination.page"
          :total-pages="totalPages"
          :max-pages="3"
          @update:model-value="handlePagination"
        />
      </div>
    </template>
    <template v-else>
      <q-btn color="primary" class="hide-hover btn-add" @click="openAddDomainDialog">
        {{ $t("collaboration.add_domain_management") }}
      </q-btn>
      <div class="referral-no-data-container">
        <q-img v-if="getWideLogo" :src="getWideLogo()" lazy-load />
        <span>{{ $t("tableHeader.no_data") }}</span>
      </div>
    </template>
  </div>

  <q-dialog v-model="dialog" persistent>
    <q-card class="desktop-domain-dialog">
      <q-form @submit="submit">
        <q-card-section class="dialog-title">
          <p class="title">{{ $t("collaboration.add_domain_application") }}</p>
          <q-space />
          <q-btn class="text-lg hide-hover" icon="close" :loading="isLoading" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="domain-box">
          <p>{{ $t("collaboration.target_location") }}</p>
          <div class="mt-10 flex items-center justify-between">
            <div>
              {{ host }}
            </div>
            <q-icon name="fa-solid fa-copy" class="cursor-pointer copy-img" @click="copyMessage(host)"></q-icon>
          </div>
        </q-card-section>
        <q-card-section class="domain-box !mt-3">
          <p class="flex items-start flex-nowrap text-[1rem]">
            <q-icon name="error" color="primary" size="sm" class="mr-2"></q-icon>
            <span>
              {{ $t("collaboration.tip") }}
            </span>
          </p>
          <div class="domain-input-area">
            <span class="min-w-[3.75rem] text-right mr-3">
              {{ $t("collaboration.domain_name") }}
            </span>
            <q-input
              v-model="addDomainForm.title"
              class="domain-input"
              :rules="[Rules.required()]"
              lazy-rules
            ></q-input>
          </div>
          <div class="domain-input-area second">
            <span class="min-w-[3.75rem] text-right mr-3">
              {{ $t("collaboration.domain") }}
            </span>
            <q-input v-model="addDomainForm.name" class="domain-input" :rules="[Rules.required()]" lazy-rules></q-input>
          </div>
        </q-card-section>
        <q-card-section class="action-btns">
          <q-btn class="btn-cancel" outline :loading="isLoading" v-close-popup>{{ $t("common.btn.cancel") }}</q-btn>
          <q-btn class="btn-submit" :loading="isLoading" type="submit">{{ $t("common.btn.confirm") }}</q-btn>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useLogo } from "src/common/composables/useLogo"
import { useCommon } from "src/common/hooks/useCommon"
import { useDomain } from "src/common/composables/useDomain"
import { useRule } from "src/common/hooks/useRule"
import { isBeforeNow } from "src/common/utils/dayjsUtils"
import { DOMAIN_TYPE } from "src/common/utils/constants"
import Pagination from "app/template/set_r022/components/Pagination/Index.vue"

const { copyMessage } = useCommon()
const {
  host,
  addDomainForm,
  isLoading,
  domainTableColumns,
  domainState,
  totalPages,
  initAddDomainForm,
  handleAddDomain,
  handleGetDomainList,
  handlePagination
} = useDomain()
const Rules = useRule()
const { getWideLogo } = useLogo()

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
  padding: 0.71875rem 2.4375rem;
  margin-bottom: 1.4375rem;
  font-size: 1.25rem;
  min-height: unset;
  line-height: normal;
  background: var(--primary-01);
  color: var(--text-01);
}

.desktop-domain-dialog {
  width: 40.5625rem;
  height: 33.9375rem;
  max-width: unset;
  min-height: unset;
  padding: 2rem 1.5rem;
  border-radius: 0.75rem;
  background: var(--neutral-01);

  .dialog-title {
    display: flex;
    align-items: center;
    padding: 0;

    .title {
      color: var(--neutral-10);
      font-weight: bold;
      font-size: 1.5rem;
    }
  }

  .domain-box {
    border: 2px solid var(--neutral-03) !important;
    border-radius: 0.625rem !important;
    padding: 1.25rem;
    margin-top: 2.5rem;
    color: var(--neutral-09);

    .copy-img {
      color: var(--primary-01);
    }

    .domain-input-area {
      width: 100%;
      margin: 1.25rem 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;
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

  .action-btns {
    @apply p-0 mt-[2.5rem] flex items-center flex-nowrap justify-between;

    .q-btn {
      width: calc(50% - 0.625rem);
      height: 3.125rem;
      border-radius: 0.625rem;
      font-size: 1rem;
      font-weight: 600;
      min-height: unset;

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
