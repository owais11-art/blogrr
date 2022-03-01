<template>
<div class="home">
  <div class="cards" v-for="item in data" :key="item._id">
    <router-link :to="{name: 'Details', params:{id: item._id}}">
    <Card :item=item />
    </router-link>
  </div>
</div>
</template>

<script>
import { ref } from 'vue-demi';
import Card from '../components/Card.vue';
import { useFetch } from '../composables/useFetch.js';
import { endpoints } from '../assets/endpoints.js';
// import { useStore } from 'vuex';
export default {
  name: 'Home',
  components: {
    Card
  },
  setup(){
    const data = ref([]);
    useFetch(
      endpoints.getBlogs.path,
      endpoints.getBlogs.method,
    )
    .then(res => data.value = res)
    .catch(err => console.log(err));
    return{ data }
  }
}
</script>

<style>
.home{
    width: 65%;
    margin: 1rem auto 0 auto;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
}
  .home .cards{
    cursor: pointer;
    width: 100%;
  }
  .home .cards a{
    text-decoration: none;
  }
</style>