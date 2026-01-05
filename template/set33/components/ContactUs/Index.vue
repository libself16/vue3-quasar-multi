<template>
  <div id="slide_right" class="slide_right_close srl_menu">
    <ul class="list_menu">
      <li>
        <div class="in-box">
          <a>
            <div class="side-ic">
              <i class="fas fa-phone"></i>
              <h4>PHONE</h4>
            </div>
            <div class="side-ifn">
              <p>+(6)012-9875 543</p>
            </div>
          </a>
        </div>
        <div class="in-box">
          <a>
            <div class="side-ic">
              <i class="fab fa-skype"></i>
              <h4>Skype</h4>
            </div>
            <div class="side-ifn">
              <p></p>
            </div>
          </a>
        </div>
        <div class="in-box">
          <a>
            <div class="side-ic">
              <i class="fab fa-whatsapp"></i>
              <h4>Whatsapp</h4>
            </div>
            <div class="side-ifn">
              <img :src="qrGsi" />
            </div>
          </a>
        </div>
        <div class="in-box">
          <a>
            <div class="side-ic">
              <i class="fas fa-envelope"></i>
              <h4>E-MAIL</h4>
            </div>
            <div class="side-ifn">
              <p>info@{{ nowHost }}</p>
            </div>
          </a>
        </div>
      </li>
    </ul>
    <button id="button_right" class="button sbutton">
      <img id="bsright" :src="contactUs" alt="" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/set33/hooks/useSiteImg"
import { useEnv } from "src/common/hooks/useEnv"

const { companyName, nowHost } = useEnv()
const { contactUs, qrGsi } = useSiteImg()
</script>

<style scoped>
.in-box {
  /* padding: 10px; */
  /* margin: 10px 15px; */
  background: #002236;
  display: flex;
  justify-content: center;
  padding: 5px 0px;
}

.side-ic {
  background: #1a2d38;
  display: flex;
  width: 166px;
  text-align: center;
  justify-content: center;
  padding: 8px 0px;
  align-items: center;
  border-radius: 20px 20px 0px 0px;
}

.side-ifn {
  background: #001521;
  width: 166px;
  text-align: center;
  border-radius: 0px 0px 20px 20px;
}
</style>
