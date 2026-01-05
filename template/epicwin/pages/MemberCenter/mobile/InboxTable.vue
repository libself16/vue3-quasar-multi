<template>
  <div class="tranc-table m-show">
    <div class="msg-inbox">
      <ul>
        <li v-for="(item, key) in mailState.list" :key="key">
          <div class="msg-iteam">
            <div class="msg-date">
              <span>{{ item.send_at }}</span>
            </div>
            <div class="msg-wrap msg-unread">
              <div class="msg-type">{{ item.mail_type }}</div>
              <div class="msg-tl">{{ item.mail_title }}</div>
              <div class="msg-cnt">
                <span v-html="item.mail_body"></span>
              </div>
              <button class="btn-mr" @click="emit('openDetail', item.id)">
                {{ $t("common.btn.readMore") }}
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
        color="white"
        active-color="purple"
        v-model="mailState.query.page"
        :max="totalPage"
        input-class="text-blue-10"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useMail } from "src/common/composables/useMail"
import { onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const { mailState, totalPage, getMailList, getMailDetail } = useMail()

const emit = defineEmits(["openDetail"])
const router = useRouter()
const route = useRoute()
const loading = ref(false)

const onRequest = async (query: any) => {
  const { page, rowsPerPage } = query
  if (loading.value) return
  loading.value = true

  await getMailList({ page: page, rowsPerPage: rowsPerPage })

  loading.value = false
}

onMounted(() => {
  // get initial data from server (1st page)
  const { page, rowsPerPage } = route.query
  if (route.query.page && route.query.rowsPerPage) {
    mailState.query.page = Number(page)
    mailState.query.rowsPerPage = Number(rowsPerPage)
  }
  onRequest(mailState.query)
})

watch(
  () => mailState.query.page,
  () => onRequest(mailState.query)
)
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'
@import 'src/common/css/loading.sass'
@import 'app/template/epicwin/css/table.sass'

.msg-pp .modal-content
  background: #021524
  border-radius: 8px
  border: 1px solid #086eb8

.swiper-slide img
  background: none

.msg-inbox ul
  padding: 0px
  list-style: none

.msg-wrap
  background: #08192b
  border: 1px solid #7a18a5
  border-radius: 5px
  padding: 15px

.msg-unread .msg-type
  font-weight: bold

.msg-date
  text-align: center
  margin-bottom: 5px

.msg-type
  color: #0c9bd5

.msg-tl
  color: #88c11a
  border-bottom: 1px solid #ffffff36
  padding-bottom: 5px

.msg-inbox
  padding: 10px

.msg-unread .msg-tl
  font-weight: bold

.msg-read .msg-tl
  color: #fff

.msg-inbox ul li
  margin-bottom: 20px

.msg-cnt
  padding-top: 10px
  overflow: hidden
  display: -webkit-box
  -webkit-line-clamp: 2
  line-clamp: 2
  -webkit-box-orient: vertical
  margin-bottom: 10px

.btn-mr
  background: linear-gradient(to bottom, rgba(169, 211, 32, 1) 0%,rgba(56, 131, 18, 1) 100%)
  color: #fff
  box-shadow: inset 0px 0px 3px 2px #79ba18
  border: none
  border-radius: 5px
  margin: 0px auto
  display: block
  padding: 5px 10px

.msg-l:first-child
  color: #52a0d0
</style>
