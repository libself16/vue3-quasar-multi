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
          <q-btn color="primary" class="hide-hover btn-add" @click="openAddDomainDialog">{{
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
      <q-btn color="primary" class="hide-hover btn-add" @click="openAddDomainDialog">{{
        $t("collaboration.add_domain_management")
      }}</q-btn>
      <div class="referral-no-data-container">
        <q-img v-if="getWideLogo" :src="getWideLogo()" lazy-load />
        <span>{{ $t("tableHeader.no_data") }}</span>
      </div>
    </template>
  </div>
  <q-dialog v-model="dialog" persistent>
    <q-card class="desktop-domain-dialog">
      <q-form @submit="submit">
        <q-card-section class="flex items-center p-0">
          <p class="pt-2 text-[1.8125rem] font-normal text-primary">{{ $t("collaboration.add_domain_application") }}</p>
          <q-space />
          <q-btn class="text-lg hide-hover" icon="close" :loading="isLoading" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="domain-box py-[2.1875rem] px-[3.125rem] mt-[.6875rem]">
          <p>{{ $t("collaboration.target_location") }}</p>
          <p class="mt-10">
            {{ host }}
            <q-icon name="fa-solid fa-copy" color="primary" class="cursor-pointer" @click="copyMessage(host)"></q-icon>
          </p>
        </q-card-section>
        <q-card-section class="domain-box mt-5 py-[.8125rem] px-[1.125rem]">
          <p class="flex items-start flex-nowrap">
            <q-icon name="error" color="primary" size="sm" class="mr-2"></q-icon>
            <span>
              {{ $t("collaboration.tip") }}
            </span>
          </p>
          <p class="mt-[2.125rem] ml-8 flex flex-nowrap items-baseline gap-[.8125rem]">
            <span class="min-w-[6.875rem] text-right">
              {{ $t("collaboration.domain_name") }}
            </span>
            <q-input
              v-model="addDomainForm.title"
              class="w-[18.125rem]"
              :rules="[Rules.required()]"
              lazy-rules
            ></q-input>
          </p>
          <p class="mt-[2.125rem] ml-8 flex flex-nowrap items-baseline gap-[.8125rem]">
            <span class="min-w-[6.875rem] text-right">
              {{ $t("collaboration.domain") }}
            </span>
            <q-input
              v-model="addDomainForm.name"
              class="w-[18.125rem]"
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
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useLogo } from "src/common/composables/useLogo"
import { useCommon } from "src/common/hooks/useCommon"
import { useDomain } from "src/common/composables/useDomain"
import { useRule } from "src/common/hooks/useRule"
import { isBeforeNow } from "src/common/utils/dayjsUtils"
import { DOMAIN_TYPE } from "src/common/utils/constants"
import Pagination from "app/template/bmm_set_obtd/components/Pagination/Index.vue"

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
@import "app/template/bmm_set_obtd/assets/css/_variable.sass";
@import "app/template/bmm_set_obtd/assets/css/referral.scss";
@import "app/template/bmm_set_obtd/assets/css/button.scss";

.btn-add {
  @apply px-[2.5rem] py-3 rounded-[3.125rem] text-xl mb-4;
}

.desktop-domain-dialog {
  width: 100%;
  max-width: 43.125rem;
  height: 46rem;
  padding: 1.875rem;
  border-radius: 0.75rem;
  background: $background-light-color;
  .domain-box {
    border: 2px solid $border-pale-gray-color !important;
    border-radius: 0.625rem !important;
  }

  .action-btns {
    @apply p-0 mt-[2.9375rem] flex items-center flex-nowrap gap-[3.375rem];

    .q-btn {
      @apply w-1/2 h-[3.125rem]  border-2;
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
