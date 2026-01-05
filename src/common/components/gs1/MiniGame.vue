<template>
  <template v-if="isMiniGameIconShow">
    <div class="mini-game-wrapper" v-draggable>
      <button class="btn-close" @click="closeMiniGame">X</button>
      <div class="mini-game-content" @click="handleMiniGameIconClick">
        <q-img class="icon-wheel" :src="commonGifImg('mini-game-wheel')" loading="lazy"> </q-img>
      </div>
    </div>

    <div v-show="isMiniGameDialogShow" class="mani-game-dialog">
      <div class="iframe-content">
        <iframe
          v-if="isMiniGameDialogShow"
          id="myIframe"
          :src="iframeUrl"
          style="width: 100%; height: 100%; margin: 0; padding: 0"
          ref="miniGameIframeRef"
        >
        </iframe>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useGs1MiniGame } from "src/common/hooks/useGs1MiniGame"

const { commonGifImg } = useCommonImg()
const {
  isMiniGameIconShow,
  isMiniGameDialogShow,
  miniGameIframeRef,
  iframeUrl,
  closeMiniGame,
  handleMiniGameIconClick
} = useGs1MiniGame()
</script>

<style lang="scss">
.mani-game-dialog {
  .q-dialog__inner--minimized {
    padding: 0;
  }
}
</style>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.mini-game-wrapper {
  animation-name: floating;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  top: calc(90vh - 7.625rem);
  left: 0;
  position: absolute;
  z-index: 1000;
  display: flex;

  .btn-close {
    color: #fff;
    opacity: 1;
    z-index: 111;
    text-align: center;
    font-size: 27px;
    font-weight: 100;
    border-radius: 100%;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    border: none;
    font-weight: bold;
    text-shadow: 0px 2px 1px black;
  }
}

.mini-game-content {
  background: #0000008c;
  padding: 10px;
  border-radius: 10px;
  border: 4px solid #696cffc4;

  @keyframes floating {
    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(0.9375rem); /* 向上移動 10px */
    }
  }

  .icon-wheel {
    width: 6rem;
    height: 6rem;
  }
}

.mani-game-dialog {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9400;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
  background-color: rgba($color: #000000, $alpha: 0.5);

  .iframe-content {
    width: 100vw;
    height: 100%;
    max-width: 1000px;
    max-height: calc(100% - 3.5rem);
    margin: 1.75rem auto;
    display: flex;
    justify-content: center;
    align-items: center;

    @include iphone-width() {
      margin: 0.5rem;
      max-width: calc(100% - 1rem);
      max-height: calc(100% - 1rem);
    }

    iframe {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
