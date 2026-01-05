<template>
  <q-dialog v-model="dialog" persistent :maximized="isLargeTablet">
    <q-card class="age-warning-wrapper overflow-hidden">
      <q-card-section class="flex flex-center q-mb-none py-0">
        <div class="logo">
          <img :src="getWideLogo()" :class="{ invisible: !getWideLogo() }" alt="logo" />
        </div>
      </q-card-section>

      <q-card-section class="text-center q-py-none warning-content-wrapper">
        <h6 class="mx-auto text-center verification-title" v-html="cmsPopupTitle" />
      </q-card-section>

      <q-card-section class="q-py-none warning-content-wrapper">
        <q-card flat class="terms-area">
          <q-list class="agree-list-wrapper">
            <q-item v-for="(item, index) in newCmsPopupAgreeList" :key="index" tag="label" v-ripple>
              <q-item-section side top>
                <q-checkbox
                  v-model="item.checked"
                  size="sm"
                  checked-icon="check_circle"
                  unchecked-icon="radio_button_unchecked"
                />
              </q-item-section>
              <q-item-section tpo class="!justify-start">
                <q-item-label class="agree-item cursor-text">
                  <div v-html="item.label" />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <p class="terms-text text-justify text-sm">
          Funds or credits in the account of player who is found ineligible to play shall mean forfeiture of said
          funds/credits in favor of the Government.
        </p>

        <div class="inline check-all-verification-wrapper">
          <q-item tag="label" v-ripple>
            <q-item-section side top>
              <q-checkbox
                v-model="cmsPopupCheckAllAgree"
                size="sm"
                checked-icon="check_circle"
                unchecked-icon="radio_button_unchecked"
                @update:model-value="handlerCheckAll"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <div v-html="cmsPopupAgreeAllText"></div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-card-section>

      <q-card-actions class="column verification-action-wrapper">
        <q-btn
          color="age-verification-enter-color"
          class="btn-action"
          block
          rounded
          unelevated
          v-close-popup
          :disable="!cmsPopupCheckAllAgree"
          @click="updateAlreadyShow"
        >
          <span class="w-full break-words">{{ cmsComfirmButtonLabel }}</span>
        </q-btn>
        <q-btn
          color="age-verification-exit-color"
          class="btn-action"
          block
          rounded
          unelevated
          v-close-popup
          @click="updateAlreadyShow"
        >
          <span class="w-full break-words">{{ cmsRejectButtonLabel }}</span>
        </q-btn>
      </q-card-actions>

      <q-card-section class="flex flex-center">
        <div class="text-h6 text-center signature-logo">
          <img v-for="(img, imgIndex) in cmsPopupImgs" :key="imgIndex" class="warning-icon" :src="img" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue"
import { CMS_TYPE } from "src/common/utils/constants"
import { useCms } from "src/common/composables/useCms"
import { useLogo } from "src/common/composables/useLogo"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useAgeVerificationStore } from "stores/ageVerificationStore"

type newCmsPopupAgreeListType = {
  label: string
  value: number
  checked: boolean
}

const { getWideLogo } = useLogo()
const { isLargeTablet } = useMediaQuery()
const { alreadyShow, updateAlreadyShow } = useAgeVerificationStore()
const {
  cmsPopupTitle,
  cmsComfirmButtonLabel,
  cmsPopupImgs,
  cmsRejectButtonLabel,
  cmsPopupAgreeList,
  cmsPopupAgreeAllText,
  cmsPopupCheckAllAgree,
  handleCmsList
} = useCms()

const dialog = ref(false)
const newCmsPopupAgreeList = ref<newCmsPopupAgreeListType[]>([])

const handlerCheckAll = (val: boolean) => {
  newCmsPopupAgreeList.value.forEach((item) => {
    item.checked = val
  })
}

watch(
  newCmsPopupAgreeList,
  (newList) => {
    const allChecked = newList.every((item) => item.checked)
    cmsPopupCheckAllAgree.value = allChecked
  },
  { deep: true }
)

onMounted(async () => {
  if (!alreadyShow) {
    await handleCmsList(CMS_TYPE.Enums.POPUP)
    dialog.value = true

    newCmsPopupAgreeList.value = cmsPopupAgreeList.value.map((e) => {
      return {
        ...e,
        checked: false
      }
    })
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.bg-age-verification-enter-color {
  background: var(--primary-01);
  border-radius: 0.5rem;
  color: var(--text-01) !important;
}

.bg-age-verification-exit-color {
  background: var(--neutral-01);
  border: 1px solid var(--neutral-03);
  border-radius: 0.5rem;
  color: var(--primary-08) !important;
}

:deep(.q-item__section--top) {
  width: 1rem;
  margin-right: 0.5rem;

  .q-checkbox {
    width: 1rem;
    height: 1rem;

    .q-checkbox__inner {
      width: 1rem;
      height: 1rem;

      &::before {
        opacity: 0 !important;
      }

      &.q-checkbox__inner--truthy {
        color: var(--primary-01);

        .q-checkbox__icon {
          width: 0.775rem;
          height: 0.775rem;
          border: 1px solid var(--primary-02);
          background: var(--white-01);
          color: var(--primary-01);
        }
      }
    }

    .q-checkbox__icon-container {
      width: 1rem;
      height: 1rem;
      align-items: flex-start;
      border-radius: 50%;

      .q-checkbox__icon {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        color: var(--primary-02);
      }
    }
  }
}

body.platform-ios {
  .age-warning-wrapper {
    max-height: 100%;
    overflow: auto !important;
  }
}

.age-warning-wrapper {
  width: 100%;
  max-width: 28.125rem;
  border-radius: 0.5rem;
  background: var(--neutral-01);
  padding: 1.5rem 1rem;

  :deep(.q-card__section) {
    padding: 0;
  }

  .btn-link,
  :deep(.btn-link) {
    color: var(--emotional-default-01);
  }

  .logo {
    height: 2.875rem;

    img {
      height: 100%;
    }
  }

  .warning-content-wrapper {
    width: 100%;
    text-align: left;

    .verification-title {
      width: 100%;
      font-size: 0.875rem;
      line-height: normal;
      margin: 0.75rem 0 0.8125rem;
      color: var(--primary-02);
      background: var(--neutral-01);
    }

    .terms-area {
      border-top: 1px solid var(--neutral-03);
      border-bottom: 1px solid var(--neutral-03);
      background: transparent;

      .agree-list-wrapper {
        overflow-y: scroll;
        height: 12.5rem;
        font-size: 0.875rem;
        padding: 0.75rem 0;
        color: var(--primary-02);

        :deep(.q-item) {
          min-height: 0;
          padding: 0;
          margin-bottom: 0.75rem;

          &:last-child {
            margin-bottom: 0;
          }
        }

        .agree-item {
          font-size: 0.75rem;
          line-height: 1.5;
        }
      }
    }

    .terms-text {
      color: var(--primary-02);
      margin: 0.75rem 0;
    }

    .check-all-verification-wrapper {
      width: 100%;
      display: flex;
      align-items: center;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--primary-02);
      flex-wrap: nowrap;
      justify-content: flex-start;

      :deep(.q-item) {
        width: 100%;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      :deep(.q-item__section--side) {
        padding-right: 0.25rem;
      }
    }
  }

  .verification-action-wrapper {
    width: 100%;
    margin-top: 1.6875rem;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .btn-action {
      width: 100%;
      min-width: 0;
      min-height: 0;
      font-size: 1rem;
      line-height: 2.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 400;
      padding: 0;
      margin-left: 0;
      margin-bottom: 0.75rem;
    }
  }

  .signature-logo {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 0.5rem auto 0;
    gap: 2.125rem;

    & * {
      height: 1.875rem;
    }
  }
}
</style>
