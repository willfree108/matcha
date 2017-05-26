<template>
  <!--Container-->
  <div class="container bot50">
    <div v-show="connectedExist" class="col s12 m12 l12">
      <div class="card-panel center-align">
        <span>You don't have any friends connected!</span>
      </div>
    </div>
    <!--Wrapper-->
    <div class="row list-user pad50">
      <div class="col l4 m12 s12 list-user">
        <div class="card-panel center-align  list-user">
          <div class="" v-for="connect in connected" :key="connect">
            <button @click.prevent.stop="talkingTo(connect)" type="button" name="button" class="btn waves-effect waves-light">{{ connect.username }}
              <i v-show="same(connect)" class="material-icons right">email</i></button>
          </div>
        </div>
      </div>
      <div class="col l8 m12 s12">
        <div class="card-panel list-user relative">
          <div class="relative heigth ">
            <div class="bottom heigth scroll" id="here">
              <div v-for="msg in messages" :key="msg" :class='align(msg)'>
                <span>{{ msg.message }}</span>
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="divider"></div>
            <input @keyup.enter="sendMessage" v-model="message" type="text" name="" value="" class="col offset-s1 offset-m1 offset-l1 s7 m7 l7">
            <button class="col s3 m3 l3 btn waves-effect waves-light" @click.stop.prevent="sendMessage">send
              <i class="material-icons right">input</i>
            </button>
          </div>
        </div>
      </div>
    <!--End Wrapper-->
    </div>
  <!--End Container-->
  </div>
</template>

<script>

export default {
  data () {
    return {
      to: '',
      message: ''
    }
  },
  methods: {
    talkingTo (connect) {
      this.message = ''
      this.to = connect
    },
    sendMessage () {
      if (this.to === '') {
        window.Materialize.toast('Please select an user', 3000)
      } else if (this.message === '') {
        window.Materialize.toast('Please enter a message', 3000)
      } else {
        this.$store.dispatch('message', {from: this.$store.getters.GET_ID, to: this.to._id, message: this.message})
        setTimeout(function () {
          var objDiv = document.getElementById('here')
          objDiv.scrollTop = objDiv.scrollHeight
        }, 100)
        this.message = ''
      }
    },
    same (connect) {
      return this.to === connect
    },
    align (connect) {
      return this.$store.getters.GET_ID === connect.to ? 'tleft' : 'tright'
    }
  },
  computed: {
    connected () {
      return this.$store.getters.GET_CONNECTED
    },
    messages () {
      var id = false
      if (this.to) {
        id = this.to._id
      }
      return id ? this.$store.getters.GET_MESSAGE.filter(m => m.to === id || m.from === id) : []
    },
    connectedExist () {
      return this.$store.getters.GET_CONNECTED.length === 0
    }
  },
  mounted () {
    this.$store.dispatch('sync', {ctx: this, redirect: false})
    require('../../static/js/form.js')()
    require('../../static/js/app.js')()
    var objDiv = document.getElementById('here')
    objDiv.scrollTop = objDiv.scrollHeight
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .relative {
    position: relative;
  }
  .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .pad50 {
    padding-top: 50px;
  }

  .bot50 {
    padding-bottom: 50px;
  }

  .heigth {
    height: 380px;
  }

  .scroll {
    overflow-y: scroll;
  }

  .tleft {
    text-align: left;
  }

  .tright {
    text-align: right;
    padding-right: 10px;
  }
</style>
