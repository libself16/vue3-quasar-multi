<template>
  <div class="add-subordinate-member-area">
    <q-btn class="back-btn" color="black" @click="memberManagementStore.handlerBackAddSubordinateMember()">
      <q-icon name="arrow_back_ios" class="back-btn-icon" size="1rem" />
      <div class="back-btn-text">{{ $t("common.btn.back") }}</div>
    </q-btn>

    <div class="data-area">
      <!-- 步驟指示器 -->
      <div class="step-indicator">
        <template v-for="i in 3" :key="i">
          <div class="step-circle" :class="{ active: step === i, finish: step > i }">
            {{ i }}
          </div>

          <div v-if="i < 3" class="step-line" :class="{ active: step > i }" />
        </template>
      </div>

      <!-- 步驟內容區域 -->
      <div class="step-content">
        <div v-if="step === 1" class="step-1">
          <!-- 標題 -->
          <div class="step-title">{{ $t("member.membershipManagement.basicInformation") }}</div>

          <div class="setting-section-area">
            <div class="setting-section">
              <div class="setting-label">
                {{ $t("member.membershipManagement.enable") }}/{{ $t("member.membershipManagement.disable") }}
              </div>
              <div class="setting-control">
                <q-toggle v-model="memberManagementStore.memberAgentCustomizeColumnData.is_enabled" color="primary" />
                <span class="toggle-text">
                  {{
                    memberManagementStore.memberAgentCustomizeColumnData.is_enabled
                      ? $t("member.membershipManagement.enable")
                      : $t("member.membershipManagement.disable")
                  }}
                </span>
              </div>
            </div>

            <div class="setting-section">
              <div class="setting-label">{{ $t("member.membershipManagement.agentIdentity") }}</div>
              <div class="setting-control">
                <q-toggle
                  v-model="memberManagementStore.memberAgentCustomizeColumnData.is_member_agent"
                  color="primary"
                />
                <span class="toggle-text">
                  {{
                    memberManagementStore.memberAgentCustomizeColumnData.is_member_agent
                      ? $t("member.membershipManagement.enable")
                      : $t("member.membershipManagement.disable")
                  }}
                </span>
              </div>
            </div>

            <div class="setting-section">
              <div class="setting-label">{{ $t("tableHeader.status") }}</div>
              <div class="setting-control">
                <q-btn-toggle
                  v-model="memberManagementStore.memberAgentCustomizeColumnData.is_blocked"
                  :options="[
                    { label: $t('member.membershipManagement.unfrozen'), value: false },
                    { label: $t('member.membershipManagement.frozen'), value: true }
                  ]"
                  class="status-toggle"
                />
              </div>
            </div>
          </div>

          <div class="input-section">
            <template v-for="(item, index) in memberManagementStore.memberAgentCustomizeColumn" :key="index">
              <div v-if="item.column_name !== 'country'" class="input-group">
                <div class="input-label" :class="{ required: item.required }">
                  {{ $t(memberColumnPlaceholderI18n?.[item.column_name] ?? item.column_name) }}
                </div>

                <div v-if="item.type === INPUT_TYPE.Enums.INPUT" class="w-full flex flex-nowrap gap-2">
                  <q-select
                    v-if="memberManagementStore.hasCountry && item.column_name === 'phone'"
                    v-model="memberManagementStore.memberAgentCustomizeColumnData['country']"
                    :options="memberManagementStore.hasCountry.values"
                    emit-value
                    map-options
                    dense
                    borderless
                    :disable="!item.edit"
                    :rules="item.required ? [Rules.required()] : []"
                    class="input-style !w-20 shrink-0"
                  />

                  <q-input
                    v-model="memberManagementStore.memberAgentCustomizeColumnData[item.column_name]"
                    dense
                    borderless
                    :disable="!item.edit"
                    :rules="
                      item.column_name === 'account'
                        ? [Rules.required(), Rules.noWhitespace()]
                        : item.required
                        ? [Rules.required()]
                        : []
                    "
                    class="input-style"
                  >
                  </q-input>
                </div>

                <template v-else-if="item.type === INPUT_TYPE.Enums.SELECT && item.column_name !== 'country'">
                  <q-select
                    v-if="item.column_name === 'ref_account'"
                    v-model="memberManagementStore.memberAgentCustomizeColumnData[item.column_name]"
                    :options="memberManagementStore.memberAgentReferralList"
                    :option-value="(option) => option.label"
                    emit-value
                    map-options
                    dense
                    borderless
                    :disable="!item.edit"
                    :rules="item.required ? [Rules.required()] : []"
                    class="input-style"
                  />

                  <q-select
                    v-else
                    v-model="memberManagementStore.memberAgentCustomizeColumnData[item.column_name]"
                    :options="item.values"
                    emit-value
                    map-options
                    dense
                    borderless
                    :disable="!item.edit"
                    :rules="item.required ? [Rules.required()] : []"
                    class="input-style"
                  />
                </template>

                <q-input
                  v-else-if="item.type === INPUT_TYPE.Enums.DATE"
                  v-model="memberManagementStore.memberAgentCustomizeColumnData[item.column_name]"
                  dense
                  borderless
                  readonly
                  :rules="item.required ? [Rules.required()] : []"
                  :disable="!item.edit"
                  class="input-style"
                >
                  <q-menu>
                    <q-date
                      v-model="memberManagementStore.memberAgentCustomizeColumnData[item.column_name]"
                      mask="YYYY-MM-DD"
                      minimal
                      color="primary"
                    />
                  </q-menu>
                </q-input>
              </div>
            </template>
          </div>
        </div>

        <div v-else-if="step === 2" class="step-2">
          <!-- 標題 -->
          <div class="step-title">{{ $t("member.membershipManagement.selectMemberTag") }}</div>

          <div class="tag-selection-title">
            {{ $t("member.membershipManagement.tagSelection") }}
          </div>

          <div class="tag-selection-area">
            <div class="tag-selection-item" v-for="item in memberManagementStore.memberAgentTagList" :key="item.id">
              <q-checkbox v-model="item.checked" :label="item.name" size="xs" />
            </div>
          </div>
        </div>

        <div v-else-if="step === 3" class="step-3">
          <!-- 標題 -->
          <div class="step-title">{{ $t("member.membershipManagement.done") }}</div>

          <img :src="successImg()" alt="arrow-right" class="w-[11.875rem] h-[11.875rem]" />
        </div>
      </div>

      <!-- 上下部按鈕 -->
      <div class="step-navigation">
        <q-btn v-if="step > 1 && step < 3" @click="step--" outline class="nav-btn previous">
          {{ $t("member.membershipManagement.previousStep") }}
        </q-btn>
        <q-btn v-if="step < 3" @click="handleNextStep" class="nav-btn">
          {{ $t("member.membershipManagement.nextStep") }}
        </q-btn>
        <q-btn v-if="step === 3" @click="memberManagementStore.handlerBackAddSubordinateMember()" class="nav-btn">
          {{ $t("member.membershipManagement.complete") }}
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useMemberManagement } from "src/stores/useMemberManagement"
import { useSiteImg } from "app/template/set_sjpn2/hooks/useSiteImg"
import { INPUT_TYPE } from "src/common/utils/constants"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useRule } from "src/common/hooks/useRule"

const { successImg } = useSiteImg()
const memberManagementStore = useMemberManagement()
const { memberColumnPlaceholderI18n } = useUserInfo()
const Rules = useRule()

const step = ref(1)

const handleNextStep = async () => {
  if (step.value === 1) {
    // 確認required欄位是否填寫
    if (!memberManagementStore.checkRequiredFields()) return
    step.value++
  } else if (step.value === 2) {
    let status

    if (memberManagementStore.memberAgentCustomizeColumnId) {
      status = await memberManagementStore.handlerUpdateMemberAgent()
    } else {
      status = await memberManagementStore.handlerCreateMemberAgent()
    }

    if (status) {
      step.value++
    }
  }
}

onMounted(async () => {
  await memberManagementStore.handlerOnMountedAddSubordinateMember()
})
</script>

<style lang="scss" scoped>
@import "app/template/set_sjpn2/assets/css/membershipManagement.scss";

.add-subordinate-member-area {
  width: 100%;

  .back-btn {
    min-width: 5.5rem;
    height: 2.75rem;
    border: 1px solid #ec7d38;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1.75rem;

    @include phone-width {
      width: 100%;
    }

    .back-btn-img {
      width: 1.5rem;
    }
  }

  .data-area {
    padding: 1.25rem;
    background: black;
    border-radius: 0.625rem;

    @include phone-width {
      padding: 0.625rem;
    }

    // 步驟指示器
    .step-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2rem;
      gap: 1rem;

      .step-circle {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        border: 1px solid #c6c6c6;
        background: black;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        font-weight: 700;
        transition: all 0.3s ease;
        font-size: 0.875rem;
        &.active {
          border: 3px solid #ff6b00;
        }

        &.finish {
          border: 3px solid #ff6b00;
          background: #ff6b00;
          color: white;
        }
      }

      .step-line {
        width: 4rem;
        height: 2px;
        background: #c6c6c6;
        transition: all 0.3s ease;

        &.active {
          background: #ff6b00;
        }
      }
    }

    // 標題樣式
    .step-title {
      text-align: center;
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
      margin-bottom: 2.75rem;

      @include phone-width {
        margin-bottom: 2rem;
      }
    }

    // 步驟內容
    .step-content {
      margin-bottom: 2rem;
      display: flex;
      justify-content: center;

      .step-1 {
        width: 36rem;

        @include phone-width {
          width: 100%;

          .step-title {
            margin-bottom: 1.25rem;
          }
        }

        .setting-section-area {
          display: flex;
          justify-content: space-between;

          @include phone-width {
            flex-wrap: wrap;
          }

          .setting-section {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;

            @include phone-width {
              width: 50%;
            }

            .setting-label {
              font-size: 0.875rem;
              color: white;
              font-weight: 400;
              margin-bottom: 0.3125rem;
            }

            .setting-control {
              display: flex;
              align-items: center;
              gap: 1.75rem;

              .toggle-text {
                font-size: 0.875rem;
                color: white;
              }

              .status-toggle {
                box-shadow: none;
                border: 1px solid #646464;
                border-radius: 0.45rem;

                :deep(.q-btn) {
                  min-width: 4.125rem;
                  color: white;

                  &.bg-primary {
                    background: #ff6b00 !important;
                    color: black !important;
                  }
                }
              }
            }
          }
        }

        .input-section {
          margin-top: 1rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;

          @include phone-width {
            grid-template-columns: 1fr;
          }

          .input-group {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;

            .input-label {
              display: block;
              font-size: 0.875rem;
              color: white;
              margin-bottom: 0.375rem;
              font-weight: 400;

              &.required {
                &::before {
                  content: "*";
                  color: #ff4444;
                  margin-right: 0.25rem;
                }
              }
            }

            .input-style {
              width: 100%;

              :deep(.q-field__inner) {
                height: 2.4375rem;
                border-radius: 0.625rem;

                .q-field__append {
                  height: 2.4375rem;
                }

                .q-field__control {
                  height: 2.4375rem;
                  min-height: 0;
                  padding: 0 0.875rem;

                  &::before {
                    border-radius: 0.625rem;
                    background: #272727;
                  }

                  .q-field__control-container {
                    width: 100%;
                    border: none;
                    font-size: 0.875rem;
                    font-weight: 400;

                    @include phone-width {
                      font-size: 0.9647rem;
                    }

                    .q-field__native {
                      color: white;
                      padding: 0.625rem 0;
                      min-height: 0;

                      &::placeholder {
                        color: #797979;
                      }
                    }
                  }

                  .q-field__append {
                    color: white;
                  }
                }
              }
            }
          }
        }
      }

      .step-2 {
        text-align: center;

        .tag-selection-title {
          font-size: 0.875rem;
          margin-bottom: 1rem;
          font-weight: 400;
        }

        .tag-selection-area {
          :deep(.q-checkbox__inner) {
            .q-checkbox__bg {
              background: #ffffff;
              color: transparent;
            }

            &.q-checkbox__inner--truthy {
              .q-checkbox__bg {
                background: #ff6b00 !important;
                border-color: #ff6b00 !important;
              }
            }
          }
        }
      }

      .step-3 {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    }

    // 上下部按鈕
    .step-navigation {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 2.75rem;

      @include phone-width {
        flex-direction: column;
        margin-top: 2rem;
      }

      .nav-btn {
        min-width: 13.9375rem;
        padding: 0.5rem 0;
        border-radius: 0.625rem;
        color: white;
        border: 2px solid #ff6b00;

        &.previous {
          color: white;
          border: none;

          &::before {
            border: none;
          }
        }
      }
    }
  }
}
</style>
