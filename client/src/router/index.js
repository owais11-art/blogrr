import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NewBlog from '../views/NewBlog.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Details from '../views/Details.vue'
import UpdateBlog from '../views/UpdateBlog.vue'
import store from '../store/index.js' 

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/newblog',
    name: 'NewBlog',
    component: NewBlog,
    meta: {
      loginRequired: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/details/:id',
    name: 'Details',
    component: Details,
    children: [
      {
        path: 'update',
        name: 'UpdateBlog',
        component: UpdateBlog
      }
    ],
    props: true,
    meta: {
      loginRequired: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.loginRequired)){
    if(!store.state.currentUser){
      const payload = {
        message: 'You need to login for accessing this page',
        msgType: 'warning'
      };
      store.commit('updateNextPage', to.name)
      store.commit('updateAlert', payload)
      if(to.params.id){
        next({name: 'Login', params:{id: to.params.id}})
      }else next({name: 'Login'})
    }else next()
  }else next()
})

export default router
