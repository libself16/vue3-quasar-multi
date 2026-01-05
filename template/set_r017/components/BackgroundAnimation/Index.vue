<template>
  <div class="background-animation-wrapper">
    <div class="ballA ball1"></div>
    <div class="ballB ball2"></div>
    <!-- <div class="ball ball3"></div> -->
  </div>
</template>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/_variable.scss";

.background-animation-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.ballA {
  position: absolute;
  width: 812px;
  height: 817px;
  border-radius: 50%;
  opacity: 0.36;
  background: #8139ff;
  filter: blur(80.4px);
  animation: floatBall 20s infinite ease-in-out;
}

.ballB {
  position: absolute;
  width: 812px;
  height: 817px;
  border-radius: 50%;
  opacity: 0.36;
  background: #d000ff;
  filter: blur(80.4px);
  animation: floatBall 20s infinite ease-in-out;
}

/* 個別球動畫稍作隨機偏移與速度 */
.ball1 {
  top: -50%;
  left: -10%;
  animation-delay: 0s;
  animation-duration: 3s;
}

.ball2 {
  top: 30%;
  left: 50%;
  animation-delay: 5s;
  animation-duration: 3s;
}

.ball3 {
  top: 60%;
  left: 20%;
  animation-delay: 2s;
  animation-duration: 3s;
}

@keyframes floatBall {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(50px, -100px) rotate(15deg) scale(1.2);
  }
  50% {
    transform: translate(-50px, 50px) rotate(-10deg) scale(1.5);
  }
  75% {
    transform: translate(100px, 100px) rotate(10deg) scale(1.2);
  }
  100% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
}

//footer End
</style>
