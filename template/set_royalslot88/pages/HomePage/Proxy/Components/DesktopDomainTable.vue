<template>
  <div class="referral-table !mt-0">
    <template v-if="domainState.list && domainState.list.length > 0">
      <q-table
        :rows="domainState.list"
        :columns="domainTableColumns"
        row-key="name"
        class="referral-table-content"
        table-header-class="text-white"
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
                class="revenue-status mx-auto"
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
        class="r-pagination"
          v-model="domainState.pagination.page"
          :total-pages="totalPages"
          :max-pages="3"
          @update:model-value="handlePagination"
        />
      </div>
    </template>
    <template v-else>
      <q-btn class="hide-hover btn-add" @click="openAddDomainDialog">{{
        $t("collaboration.add_domain_management")
      }}</q-btn>
      <div class="referral-no-data-container">
        <span>{{ $t("tableHeader.no_data") }}</span>
      </div>
    </template>
  </div>
  <q-dialog v-model="dialog" persistent>
    <q-card class="domain-dialog">
      <q-form @submit="submit">
        <q-card-section class="flex items-center p-0">
          <p class="dialog-title">
            {{ $t("collaboration.add_domain_application") }}
          </p>
          <q-space />
          <q-btn class="text-md hide-hover" icon="close" :loading="isLoading" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="domain-box !py-[1.3438rem] !px-[2.875rem] mt-2">
          <p class="target-text">{{ $t("collaboration.target_location") }}</p>
          <p class="host-text">
            {{ host }}
            <q-icon
              name="fa-solid fa-copy"
              class="cursor-pointer ml-4 text-[#AA1E74]"
              @click="copyMessage(host)"
            ></q-icon>
          </p>
        </q-card-section>
        <q-card-section class="domain-box mt-[1.125rem] !py-[1.1875rem] !px-4">
          <p class="flex items-start flex-nowrap">
            <q-icon name="error" size="sm" class="mr-2 text-[#AA1E74]"></q-icon>
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
              dark
              color="white"
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
              dark
              color="white"
              class="w-[10.625rem]"
              :rules="[Rules.required()]"
              lazy-rules
            ></q-input>
          </p>
        </q-card-section>
        <q-card-section class="action-btns">
          <q-btn class="btn-cancel" rounded outline :loading="isLoading" v-close-popup>{{ $t("common.btn.cancel") }}</q-btn>
          <q-btn class="btn-submit" rounded :loading="isLoading" type="submit">{{ $t("common.btn.confirm") }}</q-btn>
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
import Pagination from "app/template/okbet/components/Pagination/Index.vue"

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
.referral-table {
  @apply p-4;
  background: #53356B;
  border-radius: 10px;

  .referral-table-content {
    background: transparent;
    box-shadow: none;
  }
}

.btn-add {
  @apply  rounded-[3.125rem] text-sm mb-4;
  color: #fff;
  background: #AA1E74;
  border: 1px solid #5831D7;
  box-shadow: 0px -4px 4px 0px #00000066 inset;
  box-shadow: 0px 4px 4px 0px #FFFFFF4D inset;
}


.domain-dialog {
  width: 100%;
  padding: 0.375rem 0.75rem 2.125rem;
  border-radius: 0.75rem;
  background: #1C133E;
  border: 1px solid #AA1E74;

  .domain-box {
    border: 1px solid #AA1E74 !important;
    border-radius: 0.625rem !important;
    font-size: 1rem;
    line-height: 21.79px;

    .target-text {
      color: rgba(#fff, 0.5);
    }

    .host-text {
      margin-top: 1.5rem;
      color: rgba(#fff, 0.7);
    }

    .tips {
      font-weight: 400;
      color: #fff;
    }
  }

  .dialog-title {
    @apply pt-4 pl-2 text-xl font-normal;
    color: #fff;
    font-family: "Noto Sans TC";
    max-width: 80%;
  }

  .action-btns {
    @apply p-0 mt-[1.6875rem] flex justify-center gap-4;

    .q-btn {
      @apply w-full h-[3.125rem];
      font-size: 1rem;
      font-weight: 600;

      &.btn-cancel {
        color: #fff;
        background: #190A43!important;
        border: 1px solid #5831D7;
      }

      &.btn-submit {
        background: #AA1E74;
        border: 1px solid #5831D7;
        box-shadow: 0px -4px 4px 0px #00000066 inset;
        box-shadow: 0px 4px 4px 0px #FFFFFF4D inset;
      }
    }
  }
}

.r-pagination {
  @apply justify-end mt-[2rem];

  :deep(.q-pagination__middle) {
    gap: 2px;

    .q-btn {
      background-color: transparent;
      color: rgba(255, 255, 255, 0.5);
    }
  }

  :deep(.q-btn) {
    border-radius: 0.35rem;
  }

  :deep(.q-icon) {
    color: rgba(255, 255, 255, 0.5);
  }

  :deep(.q-btn--standard) {
    background-color: transparent !important;
    color: #AA1E74 !important;

    &::before {
      display: none;
    }
  }
}

:deep(.q-table) {
  thead {
    tr {
      th {
        @apply text-base;
        border-bottom: 1px solid #AA1E74;
      }
    }
  }
  tbody {
    tr {
      td {
        @apply text-xs;
        color: #FFFFFF80;
        border-bottom: 1px solid #AA1E74;
      }
    }
  }
}

.revenue-status {
  width: 50px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  &.red {
    background: #FFE2E3;
    color: #FF474C;
  }
  &.blue {
    background: #D6F4F8D9;
    color: #0062A3;
  }
  &.green {
    background: #DDF6E8;
    color: #009D46;
  }
}

.referral-no-data-container {
  @apply flex justify-center items-center text-white my-24;
}
</style>
