<template>
  <q-btn
    v-if="!memberManagementStore.showSubordinateMemberAccount?.account"
    :label="$t('common.btn.addSubordinate')"
    color="black"
    text-color="white"
    unelevated
    class="add-subordinate-btn"
    @click="memberManagementStore.showAddSubordinateStatus = true"
  />

  <q-btn v-else color="black" class="back-btn" @click="memberManagementStore.handlerBackSubordinateMember()">
    <q-icon name="arrow_back_ios" class="back-btn-icon" size="1rem" />
    <div class="back-btn-text">{{ $t("common.btn.back") }}</div>
  </q-btn>

  <q-form @submit.prevent="memberManagementStore.handlerSearchSubordinateMember" class="search-form">
    <div class="font-bold text-xl mb-1">
      {{ memberManagementStore.showSubordinateMemberAccount?.account ?? memberManagementStore.memberAgentAccount }}
      {{ $t("member.membershipManagement.subordinateMember") }}
    </div>

    <div class="search-form-row">
      <template v-if="!memberManagementStore.showSubordinateMemberAccount?.account">
        <div class="search-item manage">
          <div class="search-item-label manage">{{ $t("menu.userAccount") }}</div>
          <q-input
            v-model="memberManagementStore.memberAccount"
            :placeholder="$t('placeholder.pleaseEnterUserAccount')"
            dense
            standout="bg-grey-10 text-white"
            class="search-item-input account manage"
          />
        </div>

        <div class="search-item manage">
          <div class="search-item-label manage">{{ $t("member.profile.affiliate") }}</div>
          <q-input
            v-model="memberManagementStore.recommenderAccount"
            :placeholder="$t('placeholder.pleaseEnterReferral')"
            dense
            standout="bg-grey-10 text-white"
            class="search-item-input account manage"
          />
        </div>
      </template>

      <div v-else class="search-item manage">
        <div class="search-item-label manage">{{ $t("member.membershipManagement.subordinateMemberAccount") }}</div>
        <q-input
          v-model="memberManagementStore.searchSubordinateMemberAccount"
          :placeholder="$t('placeholder.pleaseEnterSubordinateMemberAccount')"
          dense
          standout="text-black"
          class="search-item-input account manage"
        />
      </div>

      <q-btn
        :label="$t('common.btn.searchBtn')"
        color="black"
        text-color="white"
        unelevated
        class="search-btn"
        type="submit"
      />
    </div>
  </q-form>

  <!-- pc data -->
  <q-table
    v-if="!isMobile"
    table-class="bg-[#222222] text-white"
    table-header-class="bg-black text-white"
    :rows="memberManagementStore.manageRows"
    :rows-per-page-options="[memberManagementStore.size]"
    :columns="memberManagementStore.manageColumns"
    row-key="id"
    hide-pagination
    flat
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
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
          <span
            v-for="(option, index) in memberManagementStore.operationOptions"
            :key="index"
            class="text-[#ED772E] font-bold cursor-pointer"
            :class="{ 'mr-4': index !== memberManagementStore.operationOptions.length - 1 }"
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

          <span
            v-if="props.row.is_downline_search_available"
            class="text-[#ED772E] cursor-pointer ml-4"
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
            class="text-[#ED772E] cursor-pointer ml-4"
            @click="
              memberManagementStore.handlerClickOperation(
                props.row.member_account,
                props.row.member_id,
                4,
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
    <q-list v-if="memberManagementStore.manageRows?.length">
      <q-expansion-item
        v-for="(data, index) in memberManagementStore.manageRows"
        :key="index"
        dense
        dense-toggle
        expand-separator
        expand-icon="keyboard_arrow_down"
      >
        <template v-slot:header>
          <q-item-section class="expansion-header">
            <div class="expansion-header-top">
              <div class="expansion-item">
                <div class="expansion-item-label">{{ $t("menu.account") }}</div>
                <div>{{ data.member_account }}</div>
              </div>
              <div class="expansion-item">
                <div class="expansion-item-label">{{ $t("tableHeader.balance") }}</div>
                <div>{{ moneyFormat(data.remain_quota_amount) }}</div>
              </div>
            </div>
            <div class="expansion-header-bottom">
              <div class="expansion-item !w-full">
                <div class="expansion-item-label">{{ $t("tableHeader.operating") }}</div>
                <div class="flex font-bold text-xs gap-[1.875rem]">
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
                        4,
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
          <q-card-section>
            <div class="expansion-detail">
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.level") }}</div>
                <div>{{ data.hierarchy_level }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.registerTime") }}</div>
                <div>{{ memberManagementStore.parseDate(data.register_date) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("tableHeader.lastLoginTime") }}</div>
                <div>{{ memberManagementStore.parseDate(data.last_login_date) }}</div>
              </div>
              <div class="expansion-detail-item">
                <div>{{ $t("common.btn.point") }}</div>
                <div>{{ moneyFormat(data.balance) }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
    <div v-else class="q-expansion-item flex justify-center items-center">
      <span class="m-5">{{ $t("tableHeader.no_data") }}</span>
    </div>
  </div>

  <!-- pagination -->
  <div v-if="memberManagementStore.totalPage" class="flex justify-end mt-7 pagination rounded mr-4">
    <q-pagination
      v-model="memberManagementStore.page"
      :max="memberManagementStore.totalPage"
      direction-links
      push
      color="pagination"
      icon-prev="keyboard_double_arrow_left"
      icon-next="keyboard_double_arrow_right"
      @update:model-value="memberManagementStore.handleChangePage"
    />
  </div>
</template>

<script lang="ts" setup>
import { useCommon } from "src/common/hooks/useCommon"
import { MEMBER_AGENT_QUOTA_BALANCE_TYPE } from "src/common/utils/constants"
import { useMemberManagement } from "src/stores/useMemberManagement"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"

const { moneyFormat } = useCommon()
const { isMobile } = useMediaQuery()
const memberManagementStore = useMemberManagement()
</script>

<style lang="scss" scoped>
@import "app/template/set_amuse/assets/css/membershipManagement.scss";
</style>
