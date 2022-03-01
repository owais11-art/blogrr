<template>
  <form class="new-blog" @submit.prevent="handleSubmit">
    <h2>{{mainText}}</h2>
    <label>Title:</label>
    <div class="form-control" :class="{error: v$.title.$error}">
      <input type="text" v-model="formData.title">
    </div>
    <div class="err-msg" v-if="v$.title.$error">
        <small v-for="err of v$.title.$errors" :key="err.$uid">{{err.$message}}</small>
    </div>
    <label>Author:</label>
    <div class="form-control" :class="{error: v$.author.$error}">
      <input type="text" v-model="formData.author">
    </div>
    <div class="err-msg" v-if="v$.author.$error">
        <small v-for="err of v$.author.$errors" :key="err.$uid">{{err.$message}}</small>
    </div>
    <label>Content:</label>
    <div class="form-control" :class="{error: v$.content.$error}">
      <textarea v-model="formData.content"></textarea>
    </div>
    <div class="err-msg" v-if="v$.content.$error">
        <small v-for="err of v$.content.$errors" :key="err.$uid">{{err.$message}}</small>
    </div>
    <div class="form-control">
      <input type="submit" :value="buttonText">
    </div>
  </form>
</template>
<script>
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import { computed } from '@vue/runtime-core';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
export default {
    name: 'ContentForm',
    props: [
      'mainText', 
      'buttonText', 
      'blogTitle', 
      'blogAuthor', 
      'blogContent'
    ],
    emits: ['sendData'],
  setup(props, { emit }) {
      const formData = ref({
      title: props.blogTitle || '',
      author: props.blogAuthor || '',
      content: props.blogContent || ''
    });
    const rules = computed(() => ({
      title: { required },
      author: { required },
      content: { required }
    }));
    const v$ = useVuelidate(rules, formData.value);
    const store = useStore();
    const theme = computed(() => store.state.theme);
    const handleSubmit = () => {
      v$.value.$validate()
      .then(validated => {
        if(!validated) return;
        emit('sendData', formData.value);
      })
    };
    return { formData, handleSubmit, theme, v$ }
  },
}
</script>
<style>
  .new-blog{
    width: 550px;
    margin: 1rem auto 0 auto;
    padding: 10px;
  }
  .new-blog h2{
        text-align: center;
        background: v-bind('theme.background');
        color: v-bind('theme.textColor');
        padding: 8px;
        margin-bottom: 7px;
        border-radius: 6px;
    }
  .new-blog label{
    display: inline-block;
    margin-bottom: 5px;
    margin-top: 10px;
    color: v-bind('theme.textColor');
    font-weight: bold;
    letter-spacing: 1px;
  }
  .new-blog .form-control{
    width: 100%;
  }
  .new-blog .form-control input,
  .new-blog .form-control textarea{
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 6px;
    outline: none;
    background: v-bind('theme.background');
    color: v-bind('theme.textColor');
    font-family: cursive;
  }
  .new-blog .form-control textarea{
    min-height: 250px;
  }
  .new-blog .form-control input[type="submit"]{
    background: rgb(19, 180, 19);
    font-weight: bold;
    letter-spacing: 1px;
    margin-top: 10px;
    cursor: pointer;
  }
  .new-blog .form-control.error{
    border: 1px solid orangered;
    border-radius: 6px
  }
  .new-blog .err-msg small{
    color: orangered;
  }
</style>