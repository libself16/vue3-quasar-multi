<template>
  <div class="wrap">
    <q-btn class="hide-hover btn-add" @click="openAddDomainDialog">{{
      $t("collaboration.add_domain_management")
    }}</q-btn>
    <div class="mobile-invite-list ">
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
                      <span class="!text-xs">{{ $t(DOMAIN_TYPE.I18nKeys[item.status as DOMAIN_TYPE.Enums]) }}</span>
                    </span>
                  </q-item-label>
                </q-item-section>
              </template>
              <q-card class="revenue-wrapper">
                <q-card-section>
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
          class="r-pagination"
            v-model="domainState.pagination.page"
            :total-pages="totalPages"
            :max-pages="3"
            @update:model-value="handlePagination"
          />
        </div>
      </div>
      <div v-else class="referral-no-data-container">
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
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useDomain } from "src/common/composables/useDomain"
import { useRule } from "src/common/hooks/useRule"
import { useLogo } from "src/common/composables/useLogo"
import { DOMAIN_TYPE } from "src/common/utils/constants"
import Pagination from "app/template/okbet/components/Pagination/Index.vue"

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
  console.log(status)
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
.wrap {
  @apply text-white p-4;
  border-radius: 10px;
  background: #53356B;
}

.btn-add {
  @apply px-[1.5388rem] py-[.4688rem] rounded-[1.9569rem];
  font-size: 0.7825rem;
  line-height: 1.0662rem;
  font-weight: 400;
  background: #AA1E74;
  border: 1px solid #5831D7;
  box-shadow: 0px -4px 4px 0px #00000066 inset;
  box-shadow: 0px 4px 4px 0px #FFFFFF4D inset;
}

.referral-no-data-container {
  @apply flex justify-center items-center text-white my-24;
}

.mobile-domain-dialog {
  width: 100%;
  max-width: 19.6875rem;
  max-height: calc(100vh - 80px) !important;
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
    @apply p-0 mt-[1.6875rem] flex flex-col justify-center gap-4;

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

.list-item {
  border: 1px solid #AA1E74;
  background: #53356B;
  border-radius: 0.625rem;
  margin-top: 1.5rem;
  padding: 0;
}

:deep(.q-card__section--vert) {
  padding: 0;
}

:deep(.q-expansion-item__content) {
  padding: 0.5rem 1rem;
  background: #322040;
  border-radius: 0 0 0.625rem 0.625rem;
}

.revenue-item {
  padding: 0.5rem 0;
  background: #322040;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #AA1E74;
  &:last-child {
    border-bottom: none;
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

::marker {
  display: none;
  color: transparent;
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
</style>
