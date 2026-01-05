<template>
  <div class="info-wrapper">
    <h3>Social Responsibility</h3>
    <p>
      {{ companyName }} believes that gambling is a personal choice. Ensure that the decision to gamble is one that you
      personally made. Establish what constitutes an acceptable loss before starting to gamble.
    </p>

    <p>Never ever gamble if:</p>
    <ul>
      <li>You are not of the legal gambling age in your jurisdiction.</li>
      <li>It distracts you from doing your work or fulfilling responsibilities.</li>
      <li>You are recovering from addictive disorders or dependencies.</li>
      <li>You are under the influence of alcohol or other substances.</li>
      <li>You are attempting to make up for prior gambling losses.</li>
      <li>
        If gambling is a habit beyond your control and is not something you want to do but rather something you need to
        do, we advise you to seek immediate professional help.
      </li>
    </ul>
    <p>
      Many people view gambling as something recreational – a fun and harmless way to spend some leisure time and escape
      the monotony of everyday life. However, there is a small minority for whom gambling has become troublesome.
      Compulsive and addicted gamblers have tarnished the positive image and good name of fair online and land-based
      gaming. Like their land-based counterparts, the staff at {{ companyName }} have received training to spot and
      identify the signs of problem gambling in its players. Our goal is to provide a comfortable gaming environment
      that everyone can fully enjoy. At the same time, we also aim to help those in need of our assistance.
      {{ companyName }} believes in being socially conscientious for the benefit of all players and for society in
      general.
    </p>

    <p>
      Gamblers Anonymous is a popular organization that assists people with gambling addiction. They are a fellowship of
      men and women with one common trait, the desire to stop gambling compulsively. They pool their experiences,
      strengths, and hope to overcome their addictions. If you or someone you care about needs their help, please feel
      free to contact them at: www.gamblersanonymous.org.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useEnv } from "src/common/hooks/useEnv"

const { companyName } = useEnv()
</script>

<style lang="sass" scoped>
.info-wrapper
  margin-left: 1vw
  background: rgba(0, 0, 0, .5019607843)
  border-radius: 7px
  padding: 25px 30px
  margin-bottom: 30px
  min-height: 500px
  font-size: 0.9rem
  ul
    padding-left: 2rem
    list-style-type: disc
  h3
    font-size: calc(1.3rem + .6vw)
  p
    margin-bottom: 1rem
</style>
