<template>
  <ModalBase
    v-model="modalShow"
    modal-class="modal_announcement_custom"
    use-title
    :title="$t('menu.announcement')"
    title-class="modal_title_top_announ"
    max-width="1280px"
  >
    <div class="dep_wrap">
      <ul class="nav nav-tabs deposit-tab" role="tablist">
        <li class="nav-item" v-for="(tab, i) in tabs" :key="i">
          <q-btn
            href="#"
            :class="{ active: tab.id == activeTab }"
            class="nav-link tablinksannouncement capitalize"
            role="tab"
            @click="activeTab = tab.id"
            >{{ tab.name }}</q-btn
          >
        </li>
      </ul>
      <div class="tab-content" id="announcementTabContent">
        <div
          class="tab-pane fade show tabcontentannouncement tabcontentdep_custom tabcontentann_bg"
          id="menu_annoceone"
          role="tabpanel"
          aria-labelledby="news-tab"
          :class="{ active: activeTab == 1 }"
        >
          <div class="table_share table_news">
            <table width="100%">
              <tr>
                <th>Date/Time</th>
                <th>Announcement</th>
              </tr>
              <tr>
                <td>11/11/2023 | 14:12:38</td>
                <td class="table_new_point" data-target="#announ_modal" data-toggle="modal">Message</td>
              </tr>
              <tr>
                <td>11/11/2023 | 14:12:38</td>
                <td class="table_new_point" data-target="#announ_modal" data-toggle="modal">Message</td>
              </tr>
              <tr>
                <td>11/11/2023 | 14:12:38</td>
                <td class="table_new_point" data-target="#announ_modal" data-toggle="modal">Message</td>
              </tr>
              <tr>
                <td>11/11/2023 | 14:12:38</td>
                <td class="table_new_point" data-target="#announ_modal" data-toggle="modal">Message</td>
              </tr>
            </table>
          </div>
        </div>
        <div
          class="tab-pane fade tabcontentannouncement tabcontentdep_custom tabcontentann_bg"
          id="menu_annocetwo"
          role="tabpanel"
          aria-labelledby="live-deposit-tab"
          :class="{ active: activeTab == 2 }"
        >
          <div class="table_share">
            <table width="100%">
              <tr>
                <th>Date/Time</th>
                <th>Name</th>
                <th>Amount</th>
              </tr>
              <tr>
                <td>11/11/2023 | 14:12:38</td>
                <td>Username</td>
                <td>88.00</td>
              </tr>
              <tr>
                <td>11/11/2023 | 14:12:38</td>
                <td>Username</td>
                <td>88.00</td>
              </tr>
              <tr>
                <td>11/11/2023 | 14:12:38</td>
                <td>Username</td>
                <td>88.00</td>
              </tr>
              <tr>
                <td>11/11/2023 | 14:12:38</td>
                <td>Username</td>
                <td>88.00</td>
              </tr>
            </table>
          </div>
        </div>
        <div
          class="tab-pane fade tabcontentannouncement tabcontentdep_custom tabcontentann_bg"
          id="menu_annocethree"
          role="tabpanel"
          aria-labelledby="live-withdrawal-tab"
          :class="{ active: activeTab == 3 }"
        >
          <div class="table_share">
            <table width="100%">
              <tr>
                <th>Date/Time</th>
                <th>Name</th>
                <th>Amount</th>
              </tr>
              <tr>
                <td>11/11/2023 | 14:12:38</td>
                <td>Username</td>
                <td>88.00</td>
              </tr>
              <tr>
                <td>11/11/2023 | 14:12:38</td>
                <td>Username</td>
                <td>88.00</td>
              </tr>
              <tr>
                <td>11/11/2023 | 14:12:38</td>
                <td>Username</td>
                <td>88.00</td>
              </tr>
              <tr>
                <td>11/11/2023 | 14:12:38</td>
                <td>Username</td>
                <td>88.00</td>
              </tr>
              <tr>
                <td>11/11/2023 | 14:12:38</td>
                <td>Username</td>
                <td>88.00</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import ModalBase from "./modalBase.vue"
import { ref, onMounted, computed } from "vue"
import { useI18n } from "vue-i18n"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"

const { t } = useI18n()
const eventbus = injectStrict(EventBusKey)

const modalShow = ref(false)
const modalDetailShow = ref(false)
const activeTab = ref(1)

const tabs = ref([
  {
    name: t("menu.news"),
    id: 1
  },
  {
    name: t("menu.deposit"),
    id: 2
  },
  {
    name: t("menu.withdrawal"),
    id: 3
  }
])

const promotionList = ref([{}, {}])

const openModal = () => {
  modalShow.value = true
}

defineExpose({
  openModal
})

onMounted(() => {
  eventbus.on("openAnnouncement", (show: boolean) => {
    if (show) {
      openModal()
    }
  })
})
</script>

<style lang="scss">
@import url("app/template/set_royalslot88/assets/css/deposit.css");
.modal_announcement_custom {
  .deposit-tab {
    @apply flex;
  }
  .tab-content > .active {
    @apply block;
  }
  .table_share.table_news table tr th {
    font-size: inherit;
    &:first-child {
      @apply text-left;
    }
  }
  .table_share table tr th {
    &:first-child {
      @apply text-left;
    }
  }
}

@media screen and (orientation: portrait) and (max-width: 999px) {
  .modal_announcement_custom {
    .deposit-tab {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
