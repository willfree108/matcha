<template>
  <!--Container-->
  <div class="container">

    <!--Wrapper-->
    <div class="row">

      <!--Introduction
      <p class="caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porta lectus vel tincidunt elementum. Suspendisse feugiat felis purus, et malesuada est mollis sit amet. Nunc in consectetur lorem, in efficitur odio. Aenean fringilla, neque eget blandit lacinia, nulla metus pharetra odio, quis molestie ligula diam quis odio. Aliquam erat volutpat. In aliquet pretium nulla in tincidunt. Proin porttitor dolor mollis nunc tristique, sed sollicitudin risus efficitur.</p>
  -->
      <!--Title-->
      <h1 class="header center">Sign in</h1>
      <div class="divider"></div>
      <!--Forms-->
      <div class="row">
          <form class="col l12 m12 s12">
            <div class="row">
              <div class="input-field col s12 m12 l12">
                <input id="username" type="text" data-length="20" class="validate" v-model="username">
                <label for="username">Username</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12 m12 l12">
                <input id="password" type="password" class="validate" v-model="password">
                <label for="password">Password</label>
              </div>
            </div>
            <div class="container">
              <div class="row" >
                <button @click.stop.prevent="submit" @keyup.enter.stop.prevent="submit" class="col s12 m12 l12 btn waves-effect waves-light">Log in<i class="material-icons right">input</i></button>
                <router-link to="/Sign_up" class="col s12 m12 l12 btn waves-effect waves-light">New user ?</router-link>
                <router-link to="/Recover" class="col s12 m12 l12 btn waves-effect waves-light">Forget your password ?</router-link>
              </div>
            </div>
          </form>
        </div>

    <!--End Wrapper-->
    </div>
  <!--End Container-->
  </div>
  <!--End Main-->
</template>

<script>

export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    submit () {
      var creds = {
        username: this.username,
        password: this.password
      }
      this.$store.dispatch('login', {ctx: this, creds})
    }
  },
  mounted () {
    require('../../static/js/form.js')()
    require('../../static/js/app.js')()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
