<template>
  <main>
    <Navbar/>
    <router-view :key="$router.path"/>
  </main>
</template>
<script>
import { computed } from '@vue/runtime-core';
import {useStore} from 'vuex';
import Navbar from './components/Navbar.vue';
export default {
  components:{
    Navbar
  },
  setup() {
    const store = useStore();
    store.commit('changeTheme');
    const theme = computed(() => store.state.theme);
    const currentUser = JSON.parse(localStorage.getItem('current_user')) || null;
    if(currentUser){
      store.commit('updateCurrentUser', currentUser);
    }
    return {
      theme
    }
  },
}
</script>

<style>
  *{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  body{
    width: 100vw;
    height: 100vh;
    font-family: sans-serif;
    overflow-x: hidden;
  }
  main{
    width: 100vw;
    min-height: 100vh;
    background: v-bind("theme.body");
  }
  ::-webkit-scrollbar{
    width: 0.8rem;
  }
  ::-webkit-scrollbar-track{
    background: rgb(243, 235, 235);
  }
  ::-webkit-scrollbar-thumb{
    background: rgb(180, 180, 180);
    width: 1rem;
    border-radius: 10px;
  }
</style>
