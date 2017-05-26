<template>
  <div id="app">
    <!--Mobile Navbar-->
    <ul id="slide-out" class="side-nav">
        <li><router-link to="/" class="brand-logo center bg" exact>Matcha</router-link></li>
        <div class="divider"></div>
        <div v-if="GET_AUTH">
          <li><router-link to="/Tchat" exact>Tchat</router-link></li>
          <li><router-link to="/Notification" exact>Notification {{ GET_NB_NOTIF }}</router-link></li>
          <li><router-link to="/Private" exact>Private</router-link></li>
          <li><router-link :to="'/Public/' + $store.getters.GET_ID" exact>Public</router-link></li>
          <li><router-link to="/Suggested" exact>Suggested</router-link></li>
          <li><router-link to="/Search" exact>Search</router-link></li>
          <li><a href="#" class="logout" @click.stop="logout">Sign out</a></li>
        </div>
        <div v-else>
          <li><router-link to="/Sign_in">Sign In</router-link></li>
          <li><router-link to="/Sign_up">Sign Up</router-link></li>
          <li><router-link to="/Recover">Recover</router-link></li>
        </div>
      </ul>

    <!--Navbar-->
    <div class="navbar-fixed">
      <nav>
        <div class="nav-wrapper">
          <a href="#" data-activates="slide-out" class="button-collapse left"><i class="material-icons">menu</i></a>
          <router-link to="/" class="brand-logo pad30" exact>Matcha</router-link>
          <ul class="right hide-on-med-and-down">
            <div v-if="GET_AUTH">
              <li><router-link to="/Tchat" exact>Tchat</router-link></li>
              <li><router-link to="/Notification" exact>Notification {{ GET_NB_NOTIF }}</router-link></li>
              <li><router-link to="/Private" exact>Private</router-link></li>
              <li><router-link :to="'/Public/' + $store.getters.GET_ID" exact>Public</router-link></li>
              <li><router-link to="/Suggested" exact>Suggested</router-link></li>
              <li><router-link to="/Search" exact>Search</router-link></li>
              <li><a href="#" class="logout" @click.stop="logout">Sign out</a></li>
            </div>
            <div v-else>
              <li><router-link to="/Sign_in" exact>Sign In</router-link></li>
              <li><router-link to="/Sign_up" exact>Sign Up</router-link></li>
              <li><router-link to="/Recover" exact>Recover</router-link></li>
            </div>
         </ul>
        </div>
      </nav>
    </div>
    <main>
      <transition name="slide-fade" mode="out-in">
          <router-view></router-view>
      </transition>
    </main>
    <footer class="page-footer">
      <div class="container">
        <div class="row">
          <div class="col l6 s12">
            <h5 class="white-text">Footer Content</h5>
            <p class="grey-text text-lighten-4">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
          </div>
          <div class="col l4 offset-l2 s12">
            <h5 class="white-text">Content</h5>
            <ul>
              <div v-if="GET_AUTH">
                <li><router-link to="/Tchat" class="grey-text text-lighten-3" exact>Tchat</router-link></li>
                <li><router-link to="/Notification" class="grey-text text-lighten-3" exact>Notification {{ GET_NB_NOTIF }}</router-link></li>
                <li><router-link to="/Private" class="grey-text text-lighten-3" exact>Private</router-link></li>
                <li><router-link :to="'/Public/' + $store.getters.GET_ID" class="grey-text text-lighten-3" exact>Public</router-link></li>
                <li><router-link to="/Suggested" class="grey-text text-lighten-3" exact>Suggested</router-link></li>
                <li><router-link to="/Search" class="grey-text text-lighten-3" exact>Search</router-link></li>
                <li><a href="#" class="grey-text text-lighten-3 logout" @click.stop="logout">Sign out</a></li>
              </div>
              <div v-else>
                <li><router-link to="/Sign_in" class="grey-text text-lighten-3">Sign In</router-link></li>
                <li><router-link to="/Sign_up" class="grey-text text-lighten-3">Sign Up</router-link></li>
                <li><router-link to="/Recover" class="grey-text text-lighten-3">Recover</router-link></li>
              </div>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-copyright">
        <div class="container center">
        <a class="grey-text text-lighten-4" href="#!">Copyright Random Matcha (c) 2017 Copyright Holder All Rights Reserved.</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import store from './store'
store.dispatch('sync', {ctx: this, redirect: true, refresh: true})

export default {
  name: 'app',
  store,
  computed: {
    GET_AUTH () {
      return this.$store.getters.GET_AUTH
    },
    GET_NB_NOTIF () {
      return this.$store.getters.GET_NB_NOTIF
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style>

  .router-link-active {
    background-color: rgba(0,0,0,0.1);
  }

  #app {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  main {
    flex: 1;
  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter {
    transform: translateX(100px);
    opacity: 0;
  }
 .slide-fade-leave-to {
   transform: translateX(-100px);
   opacity: 0;
 }

 .fade-enter-active {
   transition: all .3s ease;
 }
 .fade-leave-active {
   transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
 }
 .fade-enter {
   opacity: 0;
 }
  .fade-leave-to {
    opacity: 0;
  }

  .flip-list-move {
    transition: transform 1s;
  }
</style>
