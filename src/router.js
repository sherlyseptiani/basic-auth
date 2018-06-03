import Vue from 'vue'
import VueRouter from 'vue-router'

import { default as UserSignUp } from './components/user/signUp.vue'
import { default as UserSignIn } from './components/user/signIn.vue'
import { default as PenjualTerpilih } from './components/penjualTerpilih/info.vue'
import { default as PenjualTerpilihSignUp } from './components/penjualTerpilih/signUp.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: PenjualTerpilih },
  { path: '/signUp', component: UserSignUp },
  { path: '/signIn', component: UserSignIn },
  { path: '/penjualTerpilih/signUp', component: PenjualTerpilihSignUp },
  { path: '*', redirect: '/' }
]

export default new VueRouter({mode: 'history', routes})