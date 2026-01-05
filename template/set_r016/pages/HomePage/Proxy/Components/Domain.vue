<template>
  <div class="domain-content">
    <q-btn class="hide-hover btn-add" @click="openAddDomainDialog">
      {{ $t("collaboration.add_domain_management") }}
    </q-btn>

    <q-table
      v-if="isDesktop"
      square
      hide-pagination
      row-key="id"
      ref="tableRef"
      :rows="domainState.list"
      :rows-per-page-options="[domainState.pagination.size || 10]"
      :columns="domainTableColumns"
      :loading="isLoading"
      class="custom-table"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="red" />
      </template>
      <template #body="props">
        <q-tr>
          <q-td v-for="col in props.cols" :key="col.name" :props="props" class="!py-3">
            <span v-if="col.name === 'expired_at'" :class="{ 'text-expired': isBeforeNow(col.value) }">
              {{ col.value }}
            </span>
            <span
              v-else-if="col.name === 'status'"
              class="domain-status"
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
      <template #no-data>
        {{ $t("tableHeader.no_data") }}
      </template>
    </q-table>
    <div v-else class="mobile-list-wrapper">
      <q-list v-if="domainState.list.length" class="mobile-list">
        <div v-for="(item, index) in domainState.list" :key="index" class="w-full">
          <q-expansion-item dense dense-toggle expand-separator class="mobile-item" header-class="mobile-item-header">
            <template v-slot:header>
              <div class="header-item">
                <div class="header-item-title">{{ $t("collaboration.domain_name") }}</div>
                <div class="header-item-value">{{ item.title }}</div>
              </div>
              <div class="header-item">
                <div class="header-item-title">{{ $t("collaboration.status") }}</div>
                <div class="header-item-value">
                  <span
                    class="domain-status"
                    :class="{
                      red: item.status === DOMAIN_TYPE.Enums.EXPIRED,
                      green: item.status === DOMAIN_TYPE.Enums.IN_USE,
                      blue: item.status === DOMAIN_TYPE.Enums.ADDING
                    }"
                  >
                    {{ $t(DOMAIN_TYPE.I18nKeys[item.status as DOMAIN_TYPE.Enums]) }}
                  </span>
                </div>
              </div>
            </template>
            <q-list class="mobile-item-body">
              <q-item class="body-item">
                <span class="body-item-title">{{ $t("collaboration.domain") }}</span>
                <span class="body-item-value">{{ item.name }}</span>
              </q-item>
              <q-item class="body-item">
                <span class="body-item-title">{{ $t("collaboration.add_time") }}</span>
                <span class="body-item-value">{{ item.created_at }}</span>
              </q-item>
              <q-item class="body-item">
                <span class="body-item-title">{{ $t("collaboration.expiration_time") }}</span>
                <span class="body-item-value" :class="{ 'text-expired': isBeforeNow(item.expired_at) }">
                  {{ item.expired_at }}
                </span>
              </q-item>
            </q-list>
          </q-expansion-item>
        </div>
      </q-list>
      <div v-else class="mobile-no-data">{{ $t("tableHeader.no_data") }}</div>
    </div>

    <div v-if="totalPages > 1" class="custom-pagination">
      <q-pagination
        v-model="domainState.pagination.page"
        :max="totalPages"
        direction-links
        icon-prev="fa-solid fa-caret-left"
        icon-next="fa-solid fa-caret-right"
        active-color="pagination-active"
        @update:model-value="handlePagination"
      />
    </div>
  </div>
  <BaseDialog v-model="dialog" persistent :title="$t('collaboration.add_domain_application')">
    <q-form @submit="submit">
      <q-card-section class="domain-box">
        <p>{{ $t("collaboration.target_location") }}</p>
        <p class="row-host-copy">
          {{ host }}
          <q-img :src="svgIcon('copy')" loading="lazy" class="btn-copy" @click="copyMessage(host)"></q-img>
        </p>
      </q-card-section>
      <q-card-section class="domain-box mt-5">
        <p class="row-error">
          <q-icon name="error" class="icon-error"></q-icon>
          <span>
            {{ $t("collaboration.tip") }}
          </span>
        </p>
        <p class="input-content">
          <span class="input-title">
            {{ $t("collaboration.domain_name") }}
          </span>
          <q-input
            v-model="addDomainForm.title"
            :rules="[Rules.required()]"
            lazy-rules
            no-error-icon
            hide-bottom-space
          ></q-input>
        </p>
        <p class="input-content">
          <span class="input-title">
            {{ $t("collaboration.domain") }}
          </span>
          <q-input
            v-model="addDomainForm.name"
            :rules="[Rules.required()]"
            lazy-rules
            no-error-icon
            hide-bottom-space
          ></q-input>
        </p>
      </q-card-section>
      <q-card-section class="action-btns">
        <q-btn class="btn-cancel" flat :loading="isLoading" v-close-popup>{{ $t("common.btn.cancel") }}</q-btn>
        <q-btn class="btn-submit" :loading="isLoading" type="submit">{{ $t("common.btn.confirm") }}</q-btn>
      </q-card-section>
    </q-form>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { useDomain } from "src/common/composables/useDomain"
import { useRule } from "src/common/hooks/useRule"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { isBeforeNow } from "src/common/utils/dayjsUtils"
import { DOMAIN_TYPE } from "src/common/utils/constants"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import BaseDialog from "app/template/set_r016/components/Dialog/BaseDialog.vue"

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
const { isDesktop } = useMediaQuery()
const { svgIcon } = useSiteImg()

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
  domainState.pagination.size = 10
  handleGetDomainList()
})
</script>

<style scoped lang="scss">
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/table.scss";
@import "app/template/set_r016/assets/css/button.scss";

.domain-content {
  @include fontStyle();
  color: $neutral01;

  .btn-add {
    @include fontStyle();
    background-color: $neutral01;
    box-shadow: $shadow01;
    color: $primary04;
    border-radius: 0.625rem;
    padding: 0.625rem;
  }
}

.domain-box {
  @include fontStyle(0.875rem, 400);
  @apply flex flex-col gap-5;
  padding: 1.25rem;
  border-radius: 0.625rem;
  border: 1px solid $neutral10 !important;

  .row-host-copy {
    @apply flex items-center gap-[.625rem];
    .btn-copy {
      width: 1.25rem;
      height: auto;
      cursor: pointer;
    }
  }

  .row-error {
    @apply flex items-start flex-nowrap;
    gap: 0.625rem;
    line-height: 1rem;

    .icon-error {
      font-size: 1.125rem;
      color: $primary04;
    }
  }
  .input-content {
    @apply flex flex-nowrap items-baseline;
    gap: 0.625rem;

    .input-title {
      @apply min-w-[6.875rem] text-right;
    }

    .q-input {
      @include fontStyle(0.875rem, 400);
      width: 18.125rem;

      :deep(.q-field__control) {
        &::before {
          border-bottom-color: $neutral10;
        }

        &::after {
          background: $primary04;
        }
      }

      :deep(.q-field__bottom) {
        @include fontStyle(0.75rem, 400);
        color: $primary04;
      }
    }
  }
}

.action-btns {
  @apply p-0 mt-5 flex items-center flex-nowrap gap-[.625rem];

  @include phone-width {
    @apply flex-col;
  }

  .q-btn {
    @apply w-1/2 h-[2.25rem];
    @include fontStyle();
    border-radius: 0.625rem;

    &.btn-cancel {
      color: $primary04;
    }

    &.btn-submit {
      background: $gradient01;
      color: $neutral01;
    }

    @include phone-width {
      @apply w-full;
    }
  }
}
</style>
