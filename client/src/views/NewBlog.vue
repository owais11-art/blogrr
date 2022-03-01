<template>
  <ContentForm 
  :mainText="MAIN_TEXT" 
  :buttonText="BUTTON_TEXT" 
  @sendData="createNewBlog"/>
</template>
<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed } from '@vue/runtime-core';
import { endpoints } from '../assets/endpoints.js';
import { useFetch } from '../composables/useFetch.js';
import ContentForm from '../components/ContentForm.vue';
export default {
  name: 'New Blog',
  components: {ContentForm},
  setup() {
    const store = useStore();
    const router = useRouter();
    const currentUser = computed(() => store.state.currentUser);
    const MAIN_TEXT = 'CREATE NEW BLOG';
    const BUTTON_TEXT = 'POST BLOG';
    const createNewBlog = body => {
      body.owner = currentUser.value.id;
      useFetch(
        endpoints.createBlog.path,
        endpoints.createBlog.method,
        body,
        currentUser.value.token
      )
      .then(res => {
        console.log(res);
        router.push({name: 'Home'})
        })
      .catch(err => console.log(err));
    }
    return{ MAIN_TEXT, BUTTON_TEXT, createNewBlog }
  }
}
</script>