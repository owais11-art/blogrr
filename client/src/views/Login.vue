<template>
    <div class="form">
        <form class="login" @submit.prevent="handleSubmit">
        <Alert :message="alert.message" :type="alert.type" @handleClick="checkTimeOut" v-if="showAlert" />
        <h1>LOGIN</h1>
        <label>Email:</label>
        <div class="form-control" :class="{error: v$.email.$error}">
        <input type="text" v-model="formData.email">
        </div>
        <div class="err-msg" v-if="v$.email.$error">
            <small v-for="err of v$.email.$errors" :key="err.$uid">{{err.$message}}</small>
        </div>
        <label>Password:</label>
        <div class="form-control" :class="{error: v$.password.$error}">
        <input type="password" v-model="formData.password">
        </div>
        <div class="err-msg" v-if="v$.password.$error">
            <small v-for="err of v$.password.$errors" :key="err.$uid">{{err.$message}}</small>
        </div>
        <div class="form-control">
        <input type="submit" value="LOGIN">
        </div>
        <small>Need an account? <span class="reg">
            <router-link :to="{name: 'Register'}">Register</router-link>
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
import { required, email } from '@vuelidate/validators';
import { endpoints } from '../assets/endpoints.js';
import { useFetch } from '../composables/useFetch.js';
import Alert from '../components/Alert.vue';
export default {
    name: 'Login',
    components: {Alert},
    setup(props) {
      const router = useRouter();
    const formData = ref({
      email: '',
      password: ''
    });
    const rules = computed(() => ({
        email: { required, email },
        password: { required }
    }));
    const v$ = useVuelidate(rules, formData.value);
    const store = useStore();
    const theme = computed(() => store.state.theme);
    const alert = computed(() => store.state.alert);
    const showAlert = alert.value.message ? ref(true) : ref(false);
    const next = computed(() => store.state.nextPage);
    let timeStamp;
    const resetAlert = () => {
        store.commit('updateAlert', {
                  message: '',
                  msgType: ''
              });
              showAlert.value = !showAlert.value;
    }
    const checkTimeOut = () => {
        clearTimeout(timeStamp);
        resetAlert();
    }
    if(showAlert.value){
        timeStamp = setTimeout(resetAlert, 5000);
    }
    const handleSubmit = () => {
      v$.value.$validate()
      .then(validated => {
          if(!validated) return;
          useFetch(endpoints.login.path, endpoints.login.method, formData.value)
          .then(res => {
              localStorage.setItem('current_user', JSON.stringify(res));
              const currentUser = JSON.parse(localStorage.getItem('current_user'));
              store.commit('updateCurrentUser', currentUser);
              if(props.id){
                  router.push({name: next.value, params: {id: props.id}});
              }else router.push({name: next.value});
          })
          .catch(err => {
              store.commit('updateAlert', {
                  message: err.message,
                  msgType: 'danger'
              });
              showAlert.value = !showAlert.value;
              console.log(err.message);
          });
      })
    };
    return { formData, handleSubmit, theme, v$, alert, showAlert, checkTimeOut }
  },
}
</script>

<style>
    .form{
        margin-top: 8rem;
    }
    .form h1{
        text-align: center;
        background: v-bind('theme.background');
        color: v-bind('theme.textColor');
        padding: 8px;
        margin-bottom: 7px;
        border-radius: 6px;
    }
    .form .login{
        width: 550px;
        margin: 1rem auto 0 auto;
        padding: 10px;
    }
    .form .login .form-control.error{
        border: 1px solid orangered;
        border-radius: 6px
    }
    .form .login label{
        display: inline-block;
        margin-bottom: 5px;
        margin-top: 10px;
        color: v-bind('theme.textColor');
        font-weight: bold;
        letter-spacing: 1px;
    }
    .form .login .form-control{
        width: 100%;
    }
    .form .login .form-control input{
        width: 100%;
        padding: 10px;
        border: none;
        border-radius: 6px;
        outline: none;
        background: v-bind('theme.background');
        color: v-bind('theme.textColor');
        font-family: cursive;
    }
    .form .login .form-control input[type="submit"]{
        background: rgb(19, 180, 19);
        font-weight: bold;
        letter-spacing: 1.2px;
        margin-top: 1.3rem;
        cursor: pointer;
    }
    .form .login small{
        color: rgb(4, 123, 197)
    }
    .form .login small .reg a{
        color: rgb(7, 155, 247);
        font-weight: bold;
    }
    .form .login .err-msg small{
        color: orangered;
    }
</style>