<template>
  <ContentForm 
  :mainText="MAIN_TEXT" 
  :buttonText="MAIN_TEXT" 
  :blogTitle="blog.title"
  :blogAuthor="blog.author" 
  :blogContent="blog.content" 
  @sendData="updateThisBlog"/>
</template>
<script>
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { computed } from '@vue/runtime-core';
import { endpoints } from '../assets/endpoints.js';
import { useFetch } from '../composables/useFetch.js';
import ContentForm from '../components/ContentForm.vue';
export default {
  name: 'UpdateBlog',
  components: {ContentForm},
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const id = route.params.id;
    const blog = computed(() => store.state.blogDetail);
    const currentUser = computed(() => store.state.currentUser);
    const MAIN_TEXT = 'UPDATE BLOG';
    const updateThisBlog = body => {
      useFetch(
        endpoints.updateBlog.path,
        endpoints.updateBlog.method,
        body,
        currentUser.value.token,
        id
      )
      .then(res => {
        console.log(res);
        router.push({name: 'Home'})
        })
      .catch(err => console.log(err));
    }
    return{ MAIN_TEXT, blog, updateThisBlog }
  }
}
</script>