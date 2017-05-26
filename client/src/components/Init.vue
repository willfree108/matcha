<template>
  <div class="container">

    <!--Wrapper-->
    <div class="row">

      <!--Introduction
      <p class="caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porta lectus vel tincidunt elementum. Suspendisse feugiat felis purus, et malesuada est mollis sit amet. Nunc in consectetur lorem, in efficitur odio. Aenean fringilla, neque eget blandit lacinia, nulla metus pharetra odio, quis molestie ligula diam quis odio. Aliquam erat volutpat. In aliquet pretium nulla in tincidunt. Proin porttitor dolor mollis nunc tristique, sed sollicitudin risus efficitur.</p>
-->
      <!--Title-->
      <h1 class="header center">Reset your password!</h1>
      <div class="divider"></div>
      <!--Forms-->
      <div class="row">
        <form class="col s12">

          <div class="row">
            <div class="input-field col s12 m12 l12">
              <input id="username" type="text" class="validate" v-model="username">
              <label for="username">Username</label>
            </div>
            <div class="input-field col s12 m12 l12">
              <input id="username" type="password" class="validate" v-model="pass">
              <label for="username">New Password</label>
            </div>
            <div class="input-field col s12 m12 l12">
              <input id="username" type="password" class="validate" v-model="word">
              <label for="username">New Password Again</label>
            </div>
          </div>
          <div class="container">
            <div class="row">
              <button class="col s12 m12 l12 btn waves-effect waves-light" @click.stop.prevent="sendInit">send
                <i class="material-icons right">input</i>
              </button>
              <router-link to="/Sign_in" class="col s12 m12 l12 btn waves-effect waves-light">Already an account ?</router-link>
              <router-link to="/Sign_up" class="col s12 m12 l12 btn waves-effect waves-light">New user ?</router-link>
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
import axios from 'axios'

export default {
  data () {
    return {
      username: '',
      pass: '',
      word: ''
    }
  },
  methods: {
    sendInit () {
      if (this.pass !== this.word) {
        window.Materialize.toast('Password don\'t match!', 3000)
      } else {
        axios.post('init', {
          username: this.username,
          password: this.pass,
          token: this.$route.path.split('/')[2]
        })
          .then(res => {
            window.Materialize.toast('New Password set!', 3000)
            this.$router.push('/Sign_in')
          })
          .catch(() => {
            window.Materialize.toast('An error occured. Please try again.', 3000)
          })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
