<template>
  <div class="container">
    <div class="login-page">
      <div class="form-layout-new">
        <div class="title">Login</div>
        <div class="login-form-validation">
          <div class="input-area">
            <label class="field-label" for="PrimaryLoginCred">Username</label>
            <div class="field-input">
              <input class="form-style" value="" />
            </div>
          </div>
          <div class="input-area">
            <label class="field-label" for="Password">Password</label>
            <div class="field-input">
              <input class="form-style" value="" />
            </div>
          </div>
          <div class="input-area">
            <span class="logi-text">
              Don't have an account? &nbsp; <router-link to="/Register">Register Now!</router-link>
            </span>
          </div>
          <div class="input-area">
            <span class="logi-text">
              <router-link to="/ForgotPass" class="btn-for"> Forgot login details? </router-link>
            </span>
          </div>
          <div class="input-area">
            <button class="btn-submit">Login</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from "vue"
  export default defineComponent({
    name: "LoginPage",
    components: {},
    setup() {
      return {}
    }
  })
</script>
