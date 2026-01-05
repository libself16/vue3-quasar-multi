<template>
  <div class="marquee-wrapper">
    <div class="marquee-icon">
      <i class="fa-solid fa-volume-high"></i>
      <span class="wave wave1"></span>
      <span class="wave wave2"></span>
      <span class="wave wave3"></span>
    </div>
    <div class="marquee-container">
      <div class="marquee-text">Welcome to {{ companyName }} bonus 100% sign up & get reward!</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEnv } from "src/common/hooks/useEnv"

const { companyName } = useEnv()
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_paisa24/assets/css/_variable.scss";

.marquee-wrapper {
  @apply flex w-full h-[2.75rem] items-center p-[.3125rem];
  background: $primary-color;
  border-radius: 1.875rem;

  @include pad-large-width() {
    display: none;
  }
}

.marquee-icon {
  @apply flex w-10 h-10 items-center justify-center relative rounded-full;
  background: $pink-button-gradient;

  i {
    @apply relative z-10 text-white;
  }

  .wave {
    @apply absolute w-full h-full rounded-full opacity-0;
    border: 0.125rem solid #fff;
    animation: waveEffect 2s infinite;
    top: 0;
    left: 0;
  }

  .wave2 {
    animation-delay: 0.3s;
  }

  .wave3 {
    animation-delay: 0.6s;
  }
}

.marquee-container {
  @apply overflow-hidden w-full;
}

.marquee-text {
  @apply whitespace-nowrap text-base;
  animation: marquee 20s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes waveEffect {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  20% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}
</style>
