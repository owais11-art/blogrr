<template>
  <div class="alert" :class="type">
        {{message}}
        <div class="cancel">
            <i class="bi bi-x-circle-fill" @click="handleClick"></i>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from '@vue/runtime-core';
export default {
    name: 'Alert',
    props: ['message', 'type'],
    emits: ['handleClick'],
    setup(props, { emit }){
        const store = useStore();
        const handleClick = () => emit('handleClick');
        const theme = computed(() => store.state.theme);
        return { handleClick, theme }
    }

}
</script>

<style>
    .alert{
        position: relative;
        width: 100%;
        padding: 15px 8px;
        margin-bottom: 12px;
        border-left: 10px solid;
        color: v-bind('theme.textColor');
    }
    .alert .cancel{
        position: absolute;
        top: 3px;
        right: 3px;
        display: grid;
        place-content: center;
    }
    .alert .cancel .bi-x-circle-fill{
        font-size: 1.2rem;
        cursor: pointer;
    }
    .alert.success{
        background: rgb(25, 202, 25);
        border-color: green;
    }
    .alert.danger{
        background: #ff4d4d;
        border-color: #ff0000;
    }
    .alert.warning{
        background: #f5d000;
        border-color: #ffff0a;
        color: rgb(51, 45, 45);
    }
</style>