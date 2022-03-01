<template>
  <div class="reg-form">
        <form class="register" @submit.prevent="handleSubmit">
        <h1>REGISTER</h1>
        <label>Email:</label>
        <div class="form-control" :class="{error: v$.email.$error}">
        <input type="text" v-model="formData.email">
        </div>
        <div class="err-msg" v-if="v$.email.$error">
            <small v-for="err of v$.email.$errors" :key="err.$uid">{{err.$message}}</small>
        </div>
        <label>Username:</label>
        <div class="form-control" :class="{error: v$.username.$error}">
        <input type="text" v-model="formData.username">
        </div>
        <div class="err-msg" v-if="v$.username.$error">
            <small v-for="err of v$.username.$errors" :key="err.$uid">{{err.$message}}</small>
        </div>
        <label>Password:</label>
        <div class="form-control" :class="{error: v$.password.$error}">
        <input type="password" v-model="formData.password">
        </div>
        <div class="err-msg" v-if="v$.password.$error">
            <small v-for="err of v$.password.$errors" :key="err.$uid">{{err.$message}}</small>
        </div>
        <label>Confirm Password:</label>
        <div class="form-control" :class="{error: v$.confirmPassword.$error}">
        <input type="password" v-model="formData.confirmPassword">
        </div>
        <div class="err-msg" v-if="v$.confirmPassword.$error">
            <small v-for="err of v$.confirmPassword.$errors" :key="err.$uid">{{err.$message}}</small>
        </div>
        <div class="form-control">
        <input type="submit" value="REGISTER">
        </div>
        <small>Already have an account? <span class="log">
            <router-link :to="{name: 'Login'}">Login</router-link>
            </span></small>
    </form>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import { computed } from '@vue/runtime-core';
import { useVuelidate } from '@vuelidate/core';
import { required, email, sameAs, minLength } from '@vuelidate/validators';
import { endpoints } from '../assets/endpoints.js';
import { useFetch } from '../composables/useFetch.js';
export default {
  setup() {
      const router = useRouter();
    const formData = ref({
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    });
    const rules = computed(() => ({
        email: { required, email },
        username: { required },
        password: { required, minLength: minLength(6) },
        confirmPassword: { sameAs: sameAs(formData.value.password) }
    }));
    const v$ = useVuelidate(rules, formData.value);
    const store = useStore();
    const theme = computed(() => store.state.theme);
    const handleSubmit = () => {
      v$.value.$validate()
      .then(validated => {
          if(!validated) return;
          useFetch(endpoints.register.path, endpoints.register.method, formData.value)
          .then(res => {
              store.commit('updateAlert', {
                  message: res.message,
                  msgType: 'success'
              });
              router.push({name: 'Login'});
          })
          .catch(err => {
              store.commit('updateAlert', {
                  message: err.message,
                  msgType: 'danger'
              });
          });

      })       
    };
    return { formData, handleSubmit, theme, v$ }
  },
}
</script>

<style>
    .reg-form{
        margin-top: 4rem;
    }
    .reg-form h1{
        text-align: center;
        background: v-bind('theme.background');
        color: v-bind('theme.textColor');
        padding: 8px;
        margin-bottom: 7px;
        border-radius: 6px;
    }
    .reg-form .register{
        width: 550px;
        margin: 1rem auto 0 auto;
        padding: 10px;
    }
    .reg-form .register label{
        display: inline-block;
        margin-bottom: 5px;
        margin-top: 10px;
        color: v-bind('theme.textColor');
        font-weight: bold;
        letter-spacing: 1px;
    }
    .reg-form .register .form-control{
        width: 100%;
    }
    .reg-form .register .form-control.error{
        border: 1px solid orangered;
        border-radius: 6px
    }
    .reg-form .register .form-control input{
        width: 100%;
        padding: 10px;
        border: none;
        border-radius: 6px;
        outline: none;
        background: v-bind('theme.background');
        color: v-bind('theme.textColor');
        font-family: cursive;
    }
    .reg-form .register .form-control input[type="submit"]{
        background: rgb(19, 180, 19);
        font-weight: bold;
        letter-spacing: 1.2px;
        margin-top: 1.3rem;
        cursor: pointer;
    }
    .reg-form .register small{
        color: rgb(4, 123, 197)
    }
    .reg-form .register small .log a{
        color: rgb(7, 155, 247);
        font-weight: bold;
    }
    .reg-form .register .err-msg small{
        color: orangered;
    }
</style>