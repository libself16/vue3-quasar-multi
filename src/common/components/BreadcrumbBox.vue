<template>
  <div class="breadcrumb">
    <ul>
      <li @click="router.push({ path: '/' })" class="breadcrumb-item">Home</li>
      <li
        v-for="(item, index) in routes"
        :key="`route-${index}`"
        class="breadcrumb-item"
        :class="{ 'cursor-defualt': index === routes.length - 1 }"
        @click="goRoute(item.routeName, index === routes.length - 1)"
      >
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, toRefs } from "vue"
import { useRouter } from "vue-router"
const router = useRouter()

type TypeRoute = {
  title: string
  routeName: string
}
const props = defineProps({
  routes: {
    type: Array<TypeRoute>,
    required: true,
    default: () => []
  }
})
const { routes } = toRefs(props)

const goRoute = (routeName: string, isLastOne: boolean) => {
  if (!isLastOne) {
    router.push({
      name: routeName
    })
  }
}
</script>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"

.breadcrumb
  display: flex
  width: 100%
  padding: 0 4vw
  margin: 2vw 0 4vw 0
  justify-content: flex-start
  align-items: center
  ul
    +setFlex
    margin: 0
    padding: 0
    li.breadcrumb-item
      +setFlex
      color: rgba(255, 255, 255, 0.70)
      font-family: "Century Gothic"
      font-size: 1rem
      font-style: normal
      font-weight: 700
      line-height: normal
      text-transform: uppercase
      list-style: none
      cursor: pointer
      +iphone-width
        font-size: 10px
      &:hover
        color: rgba(255, 255, 255, 1)
      &::before
        content: url(/src/common/assets/images/svg/arrow.svg)
        display: inline-block
        width: 20px
        height: 20px
      &.cursor-defualt
        cursor: default
        &:hover
        color: rgba(255, 255, 255, 0.70)
</style>
