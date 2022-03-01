<template>
  <div class="card">
    <small class="date">Posted at: <span>{{date}}</span></small>
    <p class="author">{{item.author}}</p>
    <div class="break"></div>
    <h1 class="title">{{item.title}}</h1>
    <p class="description">{{description}}</p>
  </div>
</template>

<script>
import { computed } from '@vue/runtime-core';
import { useStore } from 'vuex';
export default {
    name: 'Card',
    props:['item'],
    setup(props){
      const store = useStore();
      const theme = computed(() => store.state.theme);
      const description = props.item.content.split(' ').slice(0, 21).join(' ') + ' ...';
      const dateIndex = props.item.date_posted.indexOf('T');
      const date = props.item.date_posted.slice(0, dateIndex);
      return{ description, theme, date }
    }
}
</script>

<style>
.card>*{
  margin-bottom: 10px;
}
  .card{
    width: 100%;
    background: v-bind('theme.background');
    color: v-bind('theme.textColor');
    padding: 25px;
    border-radius: 10px;
  }
  .card .date{
    display: inline-block;
    color: v-bind('theme.textColorGray');
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  }
  .card .date span{
    font-weight: bold;
    text-decoration: underline;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  }
  .card .description{
    font-family: cursive;
  }
  .card .author{
    font-family: monospace;
    font-size: 1.1rem;
    letter-spacing: 1px;
  }
  .card .title{
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .card .break{
    width: 100%;
    height: 1px;
    background: v-bind('theme.textColorGray');
  }
</style>