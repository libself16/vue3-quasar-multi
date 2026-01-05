<template>
  <!-- pc data -->
  <q-table
    v-if="!isMobile"
    table-class="text-white"
    table-header-class="text-white"
    :rows="memberManagementStore.manageRows"
    :rows-per-page-options="[memberManagementStore.size]"
    :columns="memberManagementStore.manageColumns"
    row-key="id"
    hide-pagination
    flat
    class="manage-table"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template #top>
      <div class="font-bold text-xl mb-5">
        {{ memberManagementStore.showSubordinateMemberAccount?.account ?? memberManagementStore.memberAgentAccount }}
        {{ $t("member.membershipManagement.subordinateMember") }}
      </div>

      <q-form @submit.prevent="memberManagementStore.handlerSearchSubordinateMember" class="search-form">
        <div class="search-form-row">
          <template v-if="!memberManagementStore.showSubordinateMemberAccount?.account">
            <div class="search-item manage">
              <div class="search-item-label manage">{{ $t("menu.userAccount") }}</div>
              <q-input
                v-model="memberManagementStore.memberAccount"
                :placeholder="$t('placeholder.pleaseEnterUserAccount')"
                dense
                standout="text-black"
                class="search-item-input account manage"
              />
            </div>

            <div class="search-item manage">
              <div class="search-item-label manage">{{ $t("member.profile.affiliate") }}</div>
              <q-input
                v-model="memberManagementStore.recommenderAccount"
                :placeholder="$t('placeholder.pleaseEnterReferral')"
                dense
                standout="text-black"
                class="search-item-input account manage"
              />
            </div>
          </template>

          <div v-else class="search-item manage">
            <div class="search-item-label manage">
              {{ $t("member.membershipManagement.subordinateMemberAccount") }}
            </div>
            <q-input
              v-model="memberManagementStore.searchSubordinateMemberAccount"
              :placeholder="$t('placeholder.pleaseEnterSubordinateMemberAccount')"
              dense
              standout="text-black"
              class="search-item-input account manage"
            />
          </div>

          <q-btn
            :label="$t('common.btn.search')"
            text-color="black"
            unelevated
            class="search-btn manage"
            type="submit"
          />
        </div>
      </q-form>
    </template>

    <template #body="props">
      <q-tr>
        <q-td key="member_account" :props="props">
          <span>{{ props.row.member_account }}</span>
        </q-td>
        <q-td key="level" :props="props">
          <span>{{ props.row.hierarchy_level }}</span>
        </q-td>
        <q-td key="register_date" :props="props">
          <span>{{ memberManagementStore.parseDate(props.row.register_date) }}</span>
        </q-td>
        <q-td key="last_login_date" :props="props">
          <span>{{ memberManagementStore.parseDate(props.row.last_login_date) }}</span>
        </q-td>
        <q-td key="balance" :props="props">
          <span>{{ moneyFormat(props.row.balance) }}</span>
        </q-td>
        <q-td key="remain_quota_amount" :props="props">
          <span>{{ moneyFormat(props.row.remain_quota_amount) }}</span>
        </q-td>
        <q-td key="actions" :props="props">
          <template v-if="isCredit">
            <span
              v-for="(option, index) in memberManagementStore.operationOptions"
              :key="index"
              class="text-[#ffbf00] cursor-pointer"
              :class="{ 'mr-4': !index }"
              @click="
                memberManagementStore.handlerClickOperation(
                  props.row.member_account,
                  props.row.member_id,
                  option.value,
                  props.row.is_member_agent
                )
              "
            >
              {{ option.label }}
            </span>
          </template>

          <span
            v-if="props.row.is_downline_search_available"
            class="text-[#ffbf00] cursor-pointer"
            :class="{ 'ml-4': isCredit }"
            @click="
              memberManagementStore.handlerClickOperation(
                props.row.member_account,
                props.row.member_id,
                MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.ViewSubordinate,
                props.row.is_member_agent
              )
            "
          >
            {{ $t("member.membershipManagement.viewSubordinateMember") }}
          </span>

          <span
            v-if="props.row.is_direct_downline"
            class="text-[#ffbf00] cursor-pointer ml-4"
            @click="
              memberManagementStore.handlerClickOperation(
                props.row.member_account,
                props.row.member_id,
                MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Edit,
                props.row.is_member_agent
              )
            "
          >
            {{ $t("common.btn.edit") }}
          </span>
        </q-td>
      </q-tr>
    </template>

    <template #no-data>
      <span>{{ $t("tableHeader.no_data") }}</span>
    </template>
  </q-table>

  <!-- mobile data -->
  <div v-else class="expansion-menu">
    <div class="font-bold text-xl mb-5">
      {{ memberManagementStore.showSubordinateMemberAccount?.account ?? memberManagementStore.memberAgentAccount }}
      {{ $t("member.membershipManagement.subordinateMember") }}
    </div>

    <q-form @submit.prevent="memberManagementStore.handlerSearchSubordinateMember" class="search-form">
      <div class="search-form-row">
        <template v-if="!memberManagementStore.showSubordinateMemberAccount?.account">
          <div class="search-item manage">
            <div class="search-item-label manage">{{ $t("menu.userAccount") }}</div>
            <q-input
              v-model="memberManagementStore.memberAccount"
              :placeholder="$t('placeholder.pleaseEnterUserAccount')"
              dense
              standout="text-black"
              class="search-item-input account manage"
            />
          </div>

          <div class="search-item manage">
            <div class="search-item-label manage">{{ $t("member.profile.affiliate") }}</div>
            <q-input
              v-model="memberManagementStore.recommenderAccount"
              :placeholder="$t('placeholder.pleaseEnterReferral')"
              dense
              standout="text-black"
              class="search-item-input account manage"
            />
          </div>
        </template>

        <template v-else>
          <div class="search-item manage">
            <div class="search-item-label manage">
              {{ $t("member.membershipManagement.subordinateMemberAccount") }}
            </div>
            <q-input
              v-model="memberManagementStore.searchSubordinateMemberAccount"
              :placeholder="$t('placeholder.pleaseEnterSubordinateMemberAccount')"
              dense
              standout="text-black"
              class="search-item-input account manage"
            />
          </div>
        </template>

        <q-btn :label="$t('common.btn.search')" text-color="white" unelevated class="search-btn manage" type="submit" />
      </div>
    </q-form>

    <q-list v-if="memberManagementStore.manageRows?.length">
      <q-expansion-item
        v-for="(data, index) in memberManagementStore.manageRows"
        :key="index"
        dense
        dense-toggle
        expand-separator
        expand-icon="keyboard_arrow_down"
        class="expansion-item"
      >
        <template v-slot:header>
          <q-item-section class="expansion-header">
            <div class="expansion-header-top">
              <div class="expansion-header-item">
                <div>{{ $t("menu.account") }}</div>
                <div class="text-gray">{{ data.member_account }}</div>
              </div>
              <div class="expansion-header-item">
                <div>{{ $t("tableHeader.balance") }}</div>
                <div class="text-gray">
                  {{ moneyFormat(data.remain_quota_amount) }}
                </div>
              </div>
            </div>
            <div class="expansion-header-bottom flex !flex-row">
              <div class="flex flex-col items-start justify-center w-full">
                <div>{{ $t("tableHeader.operating") }}</div>
                <div class="flex font-bold text-xs mt-1.5 gap-[1.875rem]">
                  <template v-if="isCredit">
                    <div
                      v-for="(option, index) in memberManagementStore.operationOptions"
                      :key="index"
                      class="operating-btn"
                      @click="
                        memberManagementStore.handlerClickOperation(
                          data.member_account,
                          data.member_id,
                          option.value,
                          data.is_member_agent
                        )
                      "
                    >
                      {{ option.label }}
                    </div>
                  </template>

                  <div
                    v-if="data.is_downline_search_available"
                    class="operating-btn"
                    @click="
                      memberManagementStore.handlerClickOperation(
                        data.member_account,
                        data.member_id,
                        MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.ViewSubordinate,
                        data.is_member_agent
                      )
                    "
                  >
                    {{ $t("member.membershipManagement.viewSubordinateMember") }}
                  </div>

                  <div
                    v-if="data.is_direct_downline"
                    class="operating-btn"
                    @click="
                      memberManagementStore.handlerClickOperation(
                        data.member_account,
                        data.member_id,
                        MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Edit,
                        data.is_member_agent
                      )
                    "
                  >
                    {{ $t("common.btn.edit") }}
                  </div>
                </div>
              </div>
            </div>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section class="!bg-[#cd2e2b] !p-5">
            <div class="expansion-detail">
              <div class="expansion-detail-item">
                <span>{{ $t("tableHeader.level") }}</span>
                <span class="text-right">{{ data.hierarchy_level }}</span>
              </div>
              <div class="expansion-detail-item">
                <span>{{ $t("tableHeader.registerTime") }}</span>
                <span class="text-right">{{ memberManagementStore.parseDate(data.register_date) }}</span>
              </div>
              <div class="expansion-detail-item">
                <span>{{ $t("tableHeader.lastLoginTime") }}</span>
                <span class="text-right">{{ memberManagementStore.parseDate(data.last_login_date) }}</span>
              </div>
              <div class="expansion-detail-item">
                <span>{{ $t("common.btn.point") }}</span>
                <span class="text-right">{{ moneyFormat(data.balance) }}</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>

    <div v-else class="q-expansion-item flex justify-center items-center !bg-transparent !mb-0">
      <span class="m-5">{{ $t("tableHeader.no_data") }}</span>
    </div>
  </div>

  <!-- pagination -->
  <div v-if="memberManagementStore.totalPage" class="pagination">
    <q-pagination
      v-model="memberManagementStore.page"
      :max="memberManagementStore.totalPage"
      @update:model-value="memberManagementStore.handleChangePage"
      direction-links
      flat
      active-design="flat"
      color="white"
      active-color="active-pagination"
      icon-prev="chevron_left"
      icon-next="chevron_right"
    />
  </div>
</template>

<script lang="ts" setup>
import { useEnv } from "src/common/hooks/useEnv"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useMemberManagement } from "src/stores/useMemberManagement"
import { MEMBER_AGENT_QUOTA_BALANCE_TYPE } from "src/common/utils/constants"

const { isCredit } = useEnv()
const { isMobile } = useMediaQuery()
const { moneyFormat } = useCommon()
const memberManagementStore = useMemberManagement()
</script>

<style lang="scss" scoped>
@import "app/template/okbet_red/assets/css/membershipManagement.scss";
</style>
