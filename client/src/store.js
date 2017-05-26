import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from './router'
import io from 'socket.io-client'
const time = 3000

Vue.use(Vuex)

const state = {
  authentificated: false,
  id_token: '',
  id_user: '',
  user: {},
  socket: {},
  connected: [],
  message: []
}

const getters = {
  GET_USER: (state) => state.user,
  GET_AUTH: (state) => state.authentificated,
  GET_ID: (state) => state.id_user,
  GET_SOCKET: (state) => state.socket,
  GET_NB_NOTIF: (state) => state.user.nbNotification,
  GET_NOTIF: (state) => state.user.notification,
  GET_CONNECTED: (state) => state.connected,
  GET_MESSAGE: (state) => state.message
}

const mutations = {
  SET_USER: (state, { res, connected, dispatch, ctx }) => {
    localStorage.setItem('id_token', res.data.id_token)
    localStorage.setItem('id_user', res.data.user._id)
    state.authentificated = true
    state.id_user = res.data.user._id
    state.id_token = res.data.id_token
    state.user = res.data.user
    state.connected = connected
    state.socket = io.connect('http://localhost:3000/')
    window.Materialize.toast('Successfully logged!', time)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('id_token')
    state.socket.emit('login', {idUser: state.id_user, name: state.user.username, liked: state.user.liked})
    state.socket.on('notification', msg => {
      dispatch('sync', { ctx })
      if (msg) {
        window.Materialize.toast(msg, time)
      }
    })
    state.socket.on('message', msg => {
      if (msg.from !== state.id_user) {
        window.Materialize.toast('Your got a message!', time)
      }
      state.message.push(msg)
    })
    router.push('/Private')
  },
  DEL_USER: (state) => {
    state.socket.emit('logout', {name: state.user.username, liked: state.user.liked, id: state.id_user})
    state.authentificated = false
    state.id_user = false
    state.id_token = false
    localStorage.removeItem('id_token')
    localStorage.removeItem('id_user')
    window.Materialize.toast('Successfully unlogged!', time)
    delete axios.defaults.headers.common['Authorization']
    state.socket = {}
    state.user = {}
  },
  SYNC_USER: (state, { jwt, res, connected, ctx, redirect, refresh, dispatch }) => {
    state.user = res.data.user
    state.authentificated = true
    state.id_user = res.data._id
    state.id_token = jwt
    state.user = res.data
    connected = connected.filter(u => state.user.blocked.indexOf(u._id) === -1)
    state.connected = connected
    window.Materialize.toast('Successful Sync!', time)
    if (refresh) {
      state.socket = io.connect('http://localhost:3000/')
      state.socket.emit('login', {idUser: state.id_user, name: state.user.username, liked: state.user.liked})
      state.socket.on('notification', msg => {
        dispatch('sync', { ctx })
        if (msg) {
          window.Materialize.toast(msg, time)
        }
      })
      state.socket.on('message', msg => {
        if (msg.from !== state.id_user) {
          window.Materialize.toast('Your got a message!', time)
        }
        state.message.push(msg)
      })
    }
    if (redirect) router.push('/Private')
    if (ctx.user) ctx.user = state.user
  },
  UPDATE_USER: (state) => {
    window.Materialize.toast('Successfully updated!', time)
  },
  ADD_USER: (state, { ctx, res }) => {
    if (res.status === 201) {
      window.Materialize.toast('Your account was successfully created!\nPlease check your mails!', time)
      router.push('/Sign_in')
    } else {
      window.Materialize.toast('An error occured. Please Try again!', time)
    }
  },
  MESSAGE: (state, { from, to, message }) => {
    state.socket.emit('message', { from, to, message })
  }
}

var actions = {
  async login ({ commit, dispatch }, { ctx, creds }) {
    try {
      var res = await axios.post('auth', creds)
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.id_token
      var connected = await axios.get('tchat')
      commit('SET_USER', { ctx, res, connected: connected.data, dispatch })
    } catch (err) {
      if (err.message.substr(-3) === '406') window.Materialize.toast('Please activate your account!', time)
      else window.Materialize.toast('Invalid username or password. Please Try again!', time)
    }
  },
  logout ({ commit }) {
    commit('DEL_USER')
  },
  async sync ({ commit, dispatch }, { ctx, redirect, refresh }) {
    var jwt = localStorage.getItem('id_token')
    var id = localStorage.getItem('id_user')
    if (jwt && id) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
      try {
        var res = await axios.get('user/' + id)
        var connected = await axios.get('tchat')
        commit('SYNC_USER', { jwt, res, ctx, connected: connected.data, redirect, refresh, dispatch })
      } catch (err) {
        window.Materialize.toast('Initilization error. Please Try again!', time)
      }
    }
  },
  async update ({ commit }, {ctx, user}) {
    try {
      commit('UPDATE_USER', { ctx, res: await axios.put('user', user) })
    } catch (err) {
      window.Materialize.toast('An error occured. Please Try again!', time)
    }
  },
  async sign ({ commit }, { ctx, creds }) {
    try {
      var geo = await axios.get('http://freegeoip.net/json/')
      creds.localisation = {
        city: geo.data.city,
        latitude: geo.data.latitude,
        longitude: geo.data.longitude
      }
      commit('ADD_USER', { ctx, res: await axios.post('user', creds) })
    } catch (err) {
      window.Materialize.toast('An error occured. Please Try again!', time)
    }
  },
  async raz ({ dispatch }, {ctx, redirect}) {
    try {
      await axios.get('notif')
      dispatch('sync', {ctx, redirect})
    } catch (err) {
      window.Materialize.toast('An error occured. Please Try again!', time)
    }
  },
  message ({ commit }, { from, to, message }) {
    commit('MESSAGE', { from, to, message })
  }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

if (process.env.NODE_ENV !== 'production') {
  window.store = store
}

export default store
