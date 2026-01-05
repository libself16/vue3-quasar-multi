<template>
    <div class="web-information-content">
        <div class="type-show-area">
            <div v-for="item in informationList" :key="item.type" :class="['menu-item', activeType == item.type ? 'active' : '']" @click="activeType = item.type">
                {{ item.name }}
            </div>
        </div>
        <div class="information-show-area">
            <div class="information-content" v-show="activeType == '1'">
                <div class="information-title">About Us</div>
                <AboutUs></AboutUs>
            </div>
            <div class="information-content" v-show="activeType == '2'">
                <div class="information-title">Banking</div>
                <Banking></Banking>
            </div>
            <div class="information-content" v-show="activeType == '3'">
                <div class="information-title">Term & Condition</div>
                <TermAndCondition></TermAndCondition>
            </div>
            <div class="information-content" v-show="activeType == '4'">
                <div class="information-title">Privacy Policy</div>
                <PrivacyPolicy></PrivacyPolicy>
            </div>
            <div class="information-content" v-show="activeType == '5'">
                <div class="information-title">Responsible Gaming</div>
                <ResponsibleGaming></ResponsibleGaming>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue"
import "vue3-carousel/dist/carousel.css"
import AboutUs from "./AboutUs.vue"
import Banking from "./Banking.vue"
import TermAndCondition from "./TermAndCondition.vue"
import PrivacyPolicy from "./PrivacyPolicy.vue"
import ResponsibleGaming from "./ResponsibleGaming.vue"

interface InformationItem {
    type: string
    name: string
}

export default defineComponent({
    name: "HomeWebInformation",
    components: {
        AboutUs,
        Banking,
        TermAndCondition,
        PrivacyPolicy,
        ResponsibleGaming
    },
    setup() {
        let activeType = ref("1")

        let informationList: Ref<InformationItem[]> = ref([
            {
                type: "1",
                name: "About Us"
            },
            {
                type: "2",
                name: "Banking"
            },
            {
                type: "3",
                name: "Term & Condition"
            },
            {
                type: "4",
                name: "Privacy Policy"
            },
            {
                type: "5",
                name: "Responsible Gaming"
            }
        ])

        return {
            activeType,
            informationList
        }
    }
})
</script>

<style lang="sass" scoped>
@import 'src/common/css/_variable.sass'

.web-information-content
    +setFlex
    flex-direction: column
    cursor: pointer
    +phone-width
        padding-bottom: 100vw
    .type-show-area
        display: flex
        gap: 24px
        margin: 5vh 0
        +pad-width
            background: #333
            white-space: nowrap
            padding: 15px 10px
            max-width: 100vw
            overflow-x: auto
        .menu-item
            color: rgba(255, 255, 255, 0.70)
            font-family: "Century Gothic"
            font-size: 16px
            font-style: normal
            font-weight: 700
            line-height: normal
            text-transform: uppercase
            padding: 8px
        .active
            border-radius: 8px
            background: #FFC002
            color: #24262B
    .information-show-area
        background: #1C1E22
        border-radius: 12px
        min-height: 30vh
        width: 60vw
        +pad-width
            width: 90vw
        .information-content
            margin: 5vh 3vw
            .information-title
                color: #FFF
                font-family: "Century Gothic"
                font-size: 24px
                font-style: normal
                font-weight: 700
                line-height: normal
                text-transform: uppercase
                margin-bottom: 20px
    .type-show-area::-webkit-scrollbar
        display: none
</style>
