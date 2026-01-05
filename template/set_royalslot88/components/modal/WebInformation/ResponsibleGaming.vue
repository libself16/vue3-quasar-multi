<template>
  <div class="content-wrapper">
    <h5 class="info-title">{{ $t("home.responsible_gaming") }}</h5>
    <div v-for="item in informationList" :key="item.title" class="info-content">
      <div class="content-title">
        {{ item.title }}
      </div>
      <div v-for="(paragraph, index) in item.detail" :key="index">
        <div v-if="typeof paragraph === 'string'" class="detail">{{ paragraph }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue"
import { useEnv } from "src/common/hooks/useEnv"

const { companyName } = useEnv()

interface DetailItem {
  main: string
  subItems: string[]
}

interface InformationItem {
  title: string
  detail: (string | DetailItem)[]
}

const informationList: Ref<InformationItem[]> = ref([
  {
    title: "Social Responsibility",
    detail: [
      `${companyName} believes that gambling is a personal choice. Ensure that the decision to gamble is one that you personally made. Establish what constitutes an acceptable loss before starting to gamble.`
    ]
  },
  {
    title: "Never ever gamble if:",
    detail: [
      `You are not of the legal gambling age in your jurisdiction.`,
      `It distracts you from doing your work or fulfilling responsibilities.`,
      `You are recovering from addictive disorders or dependencies.`,
      `You are under the influence of alcohol or other substances.`,
      `You are attempting to make up for prior gambling losses.`,
      `If gambling is a habit beyond your control and is not something you want to do but rather something you need to do, we advise you to seek immediate professional help.`,
      `Many people view gambling as something recreational – a fun and harmless way to spend some leisure time and escape the monotony of everyday life. However, there is a small minority for whom gambling has become troublesome. Compulsive and addicted gamblers have tarnished the positive image and good name of fair online and land-based gaming. Like their land-based counterparts, the staff at ${companyName.value} have received training to spot and identify the signs of problem gambling in its players. Our goal is to provide a comfortable gaming environment that everyone can fully enjoy. At the same time, we also aim to help those in need of our assistance.${companyName.value} believes in being socially conscientious for the benefit of all players and for society in general.`,
      `Gamblers Anonymous is a popular organization that assists people with gambling addiction. They are a fellowship of men and women with one common trait, the desire to stop gambling compulsively. They pool their experiences, strengths, and hope to overcome their addictions. If you or someone you care about needs their help, please feel free to contact them at: www.gamblersanonymous.org.`
    ]
  }
])
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "../../../assets/css/webInfo.scss";
</style>
