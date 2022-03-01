import { createStore } from 'vuex'

export default createStore({
  state: {
    theme: {},
    currentUser: false,
    alert: {
      message: '',
      type: ''
    },
    nextPage: 'Home',
    blogDetail: {}
  },
  mutations: {
    changeTheme(state, lightMode){
      if(!lightMode){
        state.theme.body = '#2c3e50';
        state.theme.background = 'hsl(235, 24%, 19%)';
        state.theme.textColor = 'rgb(226, 210, 210)';
        state.theme.textColorGray = '#2c3e50';
        state.theme.modalBackground = 'rgb(218, 208, 208, 0.1)'
      }else {
        state.theme.body = '#ccc';
        state.theme.background = 'rgb(243, 235, 235)';
        state.theme.textColor = '#2c3e50';
        state.theme.textColorGray = '#ccc';
        state.theme.modalBackground = 'rgb(0, 0, 0, 0.3)'
      }
    },
    updateNextPage(state, next){
      state.nextPage = next;
    },
    updateAlert(state, payload){
      state.alert.message = payload.message;
      state.alert.type = payload.msgType;
    },
    updateCurrentUser(state, payload){
      state.currentUser = payload;
    },
    updateBlogDetail(state, payload){
      state.blogDetail = payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
