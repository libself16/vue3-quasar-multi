<template>
  <div v-for="item in informationList" :key="item.title" class="card">
    <div class="title">
      {{ item.title }}
    </div>
    <div v-for="(paragraph, index) in item.detail" :key="index">
      <div v-if="typeof paragraph === 'string'" class="detail">{{ paragraph }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue"
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

export default defineComponent({
  name: "ResponsibleGaming",
  setup() {
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

    return {
      informationList
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.card {
  background: #fff;
  box-shadow: rgba(#a2a2b4, 0.1) 0px 3px 10px;
  border-radius: 8px;
  margin: 10px 0px;
  padding: 10px 20px;

  @include pad-large-width {
    border-radius: 0px;
  }

  .title {
    font-family: serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    color: #414655;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #e5ebf2;

    @include pad-large-width {
      font-family: OpenSans;
      font-weight: 700;
      font-size: 16px;
    }

    &::before {
      content: "";
      display: inline-block;
      width: 3px;
      height: 16px;
      background-color: var(--primary-01);
      margin-right: 5px;
    }
  }

  .detail {
    font-family: OpenSans;
    font-size: 14px;
    line-height: 24px;
    font-weight: 400;
    color: #535d76;
    margin-bottom: 15px;
  }
}
</style>
