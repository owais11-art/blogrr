<template>
  <nav>
      <div class="container">
          <h2>Blogr📝</h2>
          <ul class="nav-items">
              <li class="nav-item">
                <router-link :to="{name: 'Home'}">Home</router-link>
              </li>
              <li class="nav-item">
                <router-link :to="{name: 'NewBlog'}">New Blog</router-link>
              </li>
              <li class="nav-item" v-if="!currentUser">
                <router-link :to="{name: 'Login'}">Login</router-link>
              </li>
              <li class="nav-item" v-else @click="handleLogout">
                <button class="btn">Logout</button>
              </li>
              <li class="nav-item" @click="toggleTheme" v-if="!lightMode">
                <i class="bi bi-brightness-high-fill"></i>
              </li>
              <li class="nav-item" v-else @click="toggleTheme">
                <i class="bi bi-moon-fill"></i>
              </li>
          </ul>
      </div>
  </nav>
</template>

<script>
import { computed, ref } from '@vue/runtime-core';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default {
    name: 'Navbar',
    setup(){
        const store = useStore();
        const router = useRouter();
        const currentUser = computed(() => store.state.currentUser);
        const lightMode = ref(false);
        const theme = computed(() => store.state.theme);
        const toggleTheme = () => {
            lightMode.value = !lightMode.value;
            store.commit('changeTheme', lightMode.value);
        };
        const handleLogout = () => {
          localStorage.removeItem('current_user');
          store.commit('updateCurrentUser', false);
          router.push({name: 'Login'});
        }
        return { theme, toggleTheme, lightMode, currentUser, handleLogout }
    }
}
</script>

<style>
    nav{
        position: sticky;
        top: 0;
        width: 100vw;
        background: v-bind('theme.background');
        z-index: 10;
    }
    nav .container{
        width: 90%;
        margin: auto;
        padding: 15px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    nav .container h2{
      color: v-bind('theme.textColor');  
    }
    nav .container .nav-items{
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
    }
    nav .container .nav-items .nav-item{
        list-style-type: none;
    }
    nav .container .nav-items .nav-item .bi{
        color: v-bind('theme.textColor');
        font-size: 1.2rem;
        cursor: pointer;
    }
    nav .container .nav-items .nav-item a{
        text-decoration: none;
        font-weight: bold;
        color: v-bind('theme.textColor');
    }
    nav .container .nav-items .nav-item a.router-link-exact-active{
        color: rgb(7, 155, 247);
    }
    nav .container .nav-items .nav-item .btn{
        border: none;
        padding: 5px;
        background: orangered;
        color: v-bind('theme.textColor');
        font-weight: bold;
        border-radius: 5px;
        cursor: pointer;
    }
    nav .container .nav-items .nav-item .btn:hover{
        background: rgb(221, 65, 8);
    }
</style>