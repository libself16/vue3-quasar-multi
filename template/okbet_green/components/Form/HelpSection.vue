<template>
  <div :class="`${$q.platform.is.mobile ? 'h5' : 'pc'}`">
    <div class="form-bottom">
      <div class="terms-container">
        <div class="term-row">
          <span> 1. You are at least 21 years old. </span>
        </div>
        <div class="term-row">
          <span>
            2. You are not a government official, employed by any government agency, listed in the NDRP database, or
            affiliated with the Armed Forces of the Philippines (Army, Navy, or Air Force) or the Philippine National
            Police.
          </span>
        </div>
        <div class="term-row">
          <span> 3. You do not hold a Gaming Employment License (GEL).</span>
        </div>
        <div class="term-row">
          <span>4. Playing in public or open spaces is strictly prohibited.</span>
        </div>
        <div class="term-row">
          <span>
            5. You agree to the
            <router-link :to="{ name: 'WebInformationCms', params: { id: 22 } }" target="_blank" class="text-primary">
              terms of use of {{ companyName }}
            </router-link>
            .
          </span>
        </div>
        <div class="term-row">
          <span>
            6. {{ companyName }} reserves the right to suspend unverified accounts. In case of ineligibility, any funds
            or credits may be forfeited by the government.
          </span>
        </div>
      </div>
      <div class="agree-container">
        <!-- $q.platform.is.mobile -->
        <q-checkbox
          v-if="$q.platform.is.mobile"
          v-model="modelValue"
          checked-icon="check_circle"
          unchecked-icon="radio_button_unchecked"
          color="term"
          size="xs"
          :disable="isLoading"
        />
        <q-checkbox v-else v-model="modelValue" color="term" size="xs" :disable="isLoading" />

        <span class="agree-text">{{ $t("member.terms.agreeTerms") }} </span>
      </div>
      <div class="help-container">
        <p class="help-row">
          <span>{{ $t("member.login.needHelp") }} ? </span>
          <span class="contact-us" @click="handleOpenLiveChat">
            <div class="contact-icon">
              <img :src="svgIcon('service')" alt="phone-number" />
            </div>
            {{ $t("home.contact_us") }}
          </span>
        </p>
        <img :src="loginImg('pagcor.png')" alt="pagcor" class="game-responsibly" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEnv } from "src/common/hooks/useEnv"
import { useSiteImg } from "app/template/okbet_green/hooks/useSiteImg"
import { useLiveChat } from "src/common/hooks/useLiveChat"

const { companyName } = useEnv()
const { loginImg, svgIcon } = useSiteImg()
const { handleOpenLiveChat } = useLiveChat()

// 使用 defineModel 來定義雙向綁定的 modelValue
const modelValue = defineModel<boolean>({
  default: false
})

// 其他 props
defineProps<{
  isLoading?: boolean
}>()
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/okbet_green/assets/css/_variable.sass";

.pc {
  .form-bottom {
    padding-top: 0.625rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .terms-container {
      width: 25rem;
      height: 8.75rem;
      border: 1px solid $border-gray-color;
      border-radius: 0.375rem;
      overflow-y: scroll;
      padding: 0.5rem 0.375rem;
      margin-bottom: 0.5rem;
      &::-webkit-scrollbar {
        display: block;
        width: 2px;
        height: 1.5rem;
        background-color: transparent;
        border-radius: 2.1875rem;
        appearance: inherit;
      }
      &::-webkit-scrollbar-thumb {
        background-color: $background-medium-gray-color;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
        box-shadow: none;
        -webkit-box-shadow: none;
      }
      .term-row {
        color: $text-steel-blue-color;
        font-family: "Open Sans";
        font-size: 0.75rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.13rem;
        display: flex;
        -webkit-box-pack: start;
        justify-content: flex-start;
        align-items: flex-start;
      }
    }
    .agree-container {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .agree-text {
        margin: 0;
        padding: 0;
        color: rgba($text-dark-color, 0.88);
        font-size: 0.875rem;
        line-height: 1;
        list-style: none;
        position: relative;
        white-space: nowrap;
        cursor: pointer;
        border-radius: 0.25rem;
        align-self: center;
      }
    }
    .help-container {
      position: absolute;
      right: 0;
      bottom: -5rem;
      left: 0;
      padding-bottom: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      .help-row {
        color: $text-night-sky-color;
        font-size: 0.875rem;
        font-weight: 600;
        overflow-wrap: break-word;
        margin: 0.75rem 0;
        display: flex;
        align-items: center;
        .contact-us {
          height: 1.5rem;
          display: flex;
          align-items: center;
          font-weight: 410;
          color: $primary-color;
          cursor: pointer;
          .contact-icon {
            margin: 0 0.625rem;
            img {
              width: 1rem;
              height: 1rem;
            }
          }
        }
      }
      .game-responsibly {
        width: 4.6875rem;
        height: 1.5625rem;
      }
    }
  }
}

.h5 {
  .form-bottom {
    width: 100%;
    margin-top: 1rem;
    color: $text-charcoal-gray-color-light;
    border-radius: 16px;
    border: 0.5px solid $border-misty-blue-color;
    backdrop-filter: blur(20px);
    .terms-container {
      width: 100%;
      height: 8.75rem;
      border: 1px solid $border-gray-color;
      border-radius: 0.375rem;
      overflow-y: scroll;
      padding: 0.625rem;
      .term-row {
        width: 100%;
        color: $text-charcoal-gray-color-light;
        line-height: 1.13rem;
        font-size: 0.75rem;
        text-transform: capitalize;
        text-align: left;
        font-weight: 400;
        font-family: Helvetica;
      }
    }
    .agree-container {
      width: 100%;
      padding-top: 0.5rem;
      box-shadow: rgba($box-shadow-deep-slate-color, 0.06) 0px -4px 6px;
      .agree-text {
        font-size: 0.8269rem;
        line-height: 1.125rem;
      }
    }
    .help-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 0.625rem;
      .help-row {
        display: flex;
        align-items: center;
        margin-top: 0.5rem;
        color: $text-steel-blue-color;
        line-height: 1.125rem;
        letter-spacing: -0.02em;
        font-size: 0.8125rem;
        .contact-us {
          display: flex;
          align-items: center;
          font-weight: 410;
          color: $primary-color;
          cursor: pointer;
          .contact-icon {
            margin: 0 2px;
            img {
              width: 1.25rem;
              height: 1.25rem;
            }
          }
        }
      }
      .game-responsibly {
        margin-top: 1rem;
        width: 8rem;
      }
    }
  }
}
</style>
