<template>
  <div class="container">

    <!--Wrapper-->
    <div class="row">

      <!--Introduction
      <p class="caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porta lectus vel tincidunt elementum. Suspendisse feugiat felis purus, et malesuada est mollis sit amet. Nunc in consectetur lorem, in efficitur odio. Aenean fringilla, neque eget blandit lacinia, nulla metus pharetra odio, quis molestie ligula diam quis odio. Aliquam erat volutpat. In aliquet pretium nulla in tincidunt. Proin porttitor dolor mollis nunc tristique, sed sollicitudin risus efficitur.</p>
-->
      <!--Title-->
      <h1 class="header center">Sign up</h1>
      <div class="divider"></div>
      <!--Forms-->
      <transition name="fade" mode="in-out">
        <div class="row" v-show='flash'>
          <div class="col l12 m12 s12 center-align">
            <div class="card red lighten-2">
              <div class="card-content white-text">
                <span class="card-title">Error</span>
                <p>{{ flash }}</p>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <div class="row">
        <form class="col s12">
          <div class="row">
            <div class="input-field col s6 m6 l6">
              <input id="first_name" type="text" class="validate" v-model="firstName">
              <label for="first_name">First Name</label>
            </div>
            <div class="input-field col s6 m6 l6">
              <input id="last_name" type="text" class="validate" v-model="lastName">
              <label for="last_name">Last Name</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 m12 l12">
              <input id="username" type="text" class="validate" v-model="username">
              <label for="username">Username</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 m12 l12">
              <input id="password" type="password" class="validate" v-model="password">
              <label for="password">Password</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 m12 l12">
              <input id="email" type="email" class="validate" v-model="email">
              <label for="email">Email</label>
            </div>
          </div>
          <div class="container">
            <div class="row">
              <button class="col s12 m12 l12 btn waves-effect waves-light" @click.stop.prevent="submit">send
                <i class="material-icons right">input</i>
              </button>
              <router-link to="/Sign_in" class="col s12 m12 l12 btn waves-effect waves-light">Already an account ?</router-link>
              <router-link to="/Recover" class="col s12 m12 l12 btn waves-effect waves-light">Forget your password ?</router-link>
          </div>
          </div>

        </form>
        </div>

    <!--End Wrapper-->
    </div>
  <!--End Container-->
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      email: '',
      flash: ''
    }
  },
  methods: {
    submit () {
      var creds = {
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        password: this.password,
        email: this.email
      }
      this.$store.dispatch('sign', {ctx: this, creds})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
