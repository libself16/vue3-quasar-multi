<template>
  <div class="iframe-stack">
    <!-- 卡片式 -->
    <div class="saba-iframe-skeleton primary">
      <div class="skeleton-content">
        <div class="skeleton-header">
          <div class="skeleton-logo"></div>
          <div class="skeleton-nav">
            <div class="skeleton-nav-item"></div>
            <div class="skeleton-nav-item"></div>
            <div class="skeleton-nav-item"></div>
          </div>
        </div>
        <div class="skeleton-body">
          <div class="skeleton-sidebar">
            <div class="skeleton-menu-item" v-for="i in 6" :key="i"></div>
          </div>
          <div class="skeleton-main">
            <div class="skeleton-banner"></div>
            <div class="skeleton-cards">
              <div class="skeleton-card" v-for="i in 4" :key="i"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 經典式 -->
    <div class="saba-iframe-skeleton secondary">
      <div class="skeleton-content">
        <div class="skeleton-tabs">
          <div class="skeleton-tab"></div>
          <div class="skeleton-tab"></div>
          <div class="skeleton-tab"></div>
        </div>
        <div class="skeleton-table">
          <div class="skeleton-table-row" v-for="i in 5" :key="i">
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";

.iframe-stack {
  @apply flex flex-col gap-4;
}

// Loading Skeleton Styles
.saba-iframe-skeleton {
  @apply w-full relative overflow-hidden rounded-lg;
  background: linear-gradient(135deg, #f5f5f7 0%, #eeeef0 100%);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  animation: skeleton-pulse 2s ease-in-out infinite;

  &.primary {
    height: clamp(400px, 50vh, 800px);
    // 与实际iframe保持一致的高度
  }

  &.secondary {
    height: clamp(300px, 30vh, 600px);
    // 与实际iframe保持一致的高度
    animation-delay: 0.5s;
  }
}

.skeleton-content {
  @apply p-4 h-full;
}

.skeleton-header {
  @apply flex items-center justify-between mb-4;
}

.skeleton-logo {
  @apply w-24 h-8 rounded;
  background: linear-gradient(90deg, #e5e5e7 25%, #dadadc 50%, #e5e5e7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-nav {
  @apply flex gap-4;
}

.skeleton-nav-item {
  @apply w-16 h-6 rounded;
  background: linear-gradient(90deg, #e5e5e7 25%, #dadadc 50%, #e5e5e7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-body {
  @apply flex gap-4 h-full;
}

.skeleton-sidebar {
  @apply w-48 space-y-3;
}

.skeleton-menu-item {
  @apply w-full h-10 rounded;
  background: linear-gradient(90deg, #e5e5e7 25%, #dadadc 50%, #e5e5e7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  &:nth-child(odd) {
    animation-delay: 0.2s;
  }
}

.skeleton-main {
  @apply flex-1 space-y-4;
}

.skeleton-banner {
  @apply w-full h-32 rounded-lg;
  background: linear-gradient(90deg, #e5e5e7 25%, #dadadc 50%, #e5e5e7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-cards {
  @apply grid grid-cols-2 gap-4;
}

.skeleton-card {
  @apply h-24 rounded-lg;
  background: linear-gradient(90deg, #e5e5e7 25%, #dadadc 50%, #e5e5e7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  &:nth-child(even) {
    animation-delay: 0.3s;
  }
}

.skeleton-tabs {
  @apply flex gap-2 mb-4;
}

.skeleton-tab {
  @apply w-20 h-8 rounded;
  background: linear-gradient(90deg, #e5e5e7 25%, #dadadc 50%, #e5e5e7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-table {
  @apply space-y-2;
}

.skeleton-table-row {
  @apply flex gap-4;
}

.skeleton-cell {
  @apply flex-1 h-8 rounded;
  background: linear-gradient(90deg, #e5e5e7 25%, #dadadc 50%, #e5e5e7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  &:nth-child(2) {
    animation-delay: 0.1s;
  }

  &:nth-child(3) {
    animation-delay: 0.2s;
  }
}

// Animations
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.95;
  }
}

@include pad-large-width {
  .skeleton-body {
    @apply flex-col;
  }

  .skeleton-sidebar {
    @apply w-full;
  }

  .skeleton-cards {
    @apply grid-cols-1;
  }
}
</style>
