import Vue from 'vue'
import Vuex from 'vuex'
import authAxios from './axios/authAxios'
import dbAxios from './axios/dbAxios'
import router from './router'

Vue.use(Vuex)

const apiKey = 'AIzaSyBktb5y0gD07q2Gqtgmzrlldnjjo3LFbGA'

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    email: null,
    user: null
  },
  mutations: {
    authUser (state, userData) {
      state.idToken = userData.token
      state.userId = userData.userId
      state.email = userData.email
    },
    storeUser (state, user) {
      state.user = user
    },
    clearAuthData (state) {
      state.idToken = null
      state.userId = null
      state.email = null
    }
  },
  actions: {
    setLogoutTimer ({commit}, expirationTime) {
      setTimeout(() => {
        commit('clearAuthData')
      }, expirationTime * 1000)
    },
    signup ({commit, dispatch}, authData) {
      dispatch('logout')
      return authAxios.post('/signupNewUser?key=' + apiKey, {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          console.log(res)
          commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId,
            email: res.data.email
          })
          const now = new Date()
          const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          localStorage.setItem('email', res.data.email)
          localStorage.setItem('expirationDate', expirationDate)
          dispatch('setLogoutTimer', res.data.expiresIn)
          dispatch('storeUser', authData)
        })
    },
    login ({commit, dispatch}, authData) {
      dispatch('logout')
      return authAxios.post('/verifyPassword?key=' + apiKey, {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          console.log("sign in data :" , res)
          const now = new Date()
          const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          localStorage.setItem('email', res.data.email)
          localStorage.setItem('expirationDate', expirationDate)
          commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId,
            email: res.data.email
          })
          dispatch('setLogoutTimer', res.data.expiresIn)
        })
    },
    tryAutoLogin ({commit}) {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }
      const expirationDate = localStorage.getItem('expirationDate')
      const now = new Date()
      if (now >= expirationDate) {
        return
      }
      const userId = localStorage.getItem('userId')
      const email = localStorage.getItem('email')
      commit('authUser', {
        token: token,
        userId: userId,
        email: email
      })
    },
    logout ({commit}) {
      commit('clearAuthData')
      localStorage.removeItem('expirationDate')
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
    },
    storeUser ({commit, dispatch, state}, userData) {
      if (!state.idToken) {
        return
      }
      
      delete userData.password
      delete userData.konfirmasiPassword
      return dbAxios.post('/users.json' + '?auth=' + state.idToken, userData)
    },
    fetchUser ({commit, state}) {
      if (!state.idToken) {
        return
      }
      return dbAxios.get('/users.json' + '?auth=' + state.idToken + '&orderBy="email"&equalTo="' + state.email + '"')
        .then(res => {
          const data = res.data
          const users = []
          for (let key in data) {
            const user = data[key]
            user.id = key
            users.push(user)
          }
          commit('storeUser', users[0])
        })
    },
    signUpPenjualTerpilih ({state}, userData) {
      if (!state.idToken) {
        router.replace('/signin')
        return
      }
      return dbAxios.post('/preferredSellers.json' + '?auth=' + state.idToken, userData)
    },
  },
  getters: {
    user (state) {
      return state.user
    },
    isAuthenticated (state) {
      return state.idToken !== null
    }
  }
})