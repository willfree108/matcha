<template>
  <!--Container-->
  <div class="container">

    <!--Wrapper-->
    <div class="row">

      <!--Introduction
      <p class="caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porta lectus vel tincidunt elementum. Suspendisse feugiat felis purus, et malesuada est mollis sit amet. Nunc in consectetur lorem, in efficitur odio. Aenean fringilla, neque eget blandit lacinia, nulla metus pharetra odio, quis molestie ligula diam quis odio. Aliquam erat volutpat. In aliquet pretium nulla in tincidunt. Proin porttitor dolor mollis nunc tristique, sed sollicitudin risus efficitur.</p>
-->
      <!--Title-->
      <h1 class="header center">Welcome to {{ user.username }} </h1>
      <div class="divider"></div>

      <!--Forms-->
      <div class="row">
          <div class="col l4 m6 s12 relative">
            <div class="row">
              <div class="card">
                <div class="card-image">
                  <img :src="userAvatar">
                  <a v-if="sameID" @click.stop.prevent="block" class="btn-floating halfway-fab waves-effect waves-light grey delete"><i class="material-icons">delete</i></a>
                  <a v-if="sameID" @click.stop.prevent="report" class="btn-floating halfway-fab waves-effect waves-light grey report"><i class="material-icons">perm_identity</i></a>
                  <a v-if="sameID" @click.stop.prevent="like" class="btn-floating halfway-fab waves-effect waves-light blue like"><i class="material-icons">{{ thumb(user) }}</i></a>
                  <a class="btn-floating halfway-fab waves-effect waves-light green score"><div class="relative"><p>{{ score }}</p></div></a>
                </div>
                <div class="card-content">
                  <span class="card-title"> {{ user.username }} </span>
                  <p>{{ user.bio }}</p>
                </div>
              </div>
            </div>

            <div v-if="imageExist">
              <div class="divider"></div>
              <h5 class="header center">Gallery</h5>
              <div class="divider"></div>
            </div>

              <div class="row">
                <div class="col l6 m11 s11 relative" v-for="(image, index) in user.image" :key="image">
                      <img class="materialboxed" :src="image">
                </div>
              </div>
          </div>
          <form class="col l7 m6 s12 offset-s1 pad-form">
            <div class="row center">
              <h5>{{ user.date }}</h5>
              <div class="divider"></div>
            </div>
            <div class="row">
              <div class="input-field col s6 m6 l6">
                <input disabled id="first_name" :value="user.firstName" type="text" class="validate">
                <label for="first_name">First Name</label>
              </div>
              <div class="input-field col s6 m6 l6">
                <input disabled id="last_name" :value="user.lastName" type="text" class="validate">
                <label for="last_name">Last Name</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s6 m6 l6">
                <input disabled id="age" :value="user.age" type="number" class="validate">
                <label for="age">Age</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <select disabled v-model="user.sexe">
                  <option>Not choosed</option>
                  <option>Men</option>
                  <option>Women</option>
                  <option>Other</option>
                </select>
                <label>Sexe</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <select disabled v-model="user.orientation">
                  <option>Men</option>
                  <option>Women</option>
                  <option>Bi</option>
                </select>
                <label>Sexual Orientation</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <textarea disabled id="textarea1" class="materialize-textarea" data-length="180">{{ user.bio }}</textarea>
                <label for="textarea1">Bio</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <textarea disabled id="textarea2" class="materialize-textarea" data-length="180">{{ tagsExist }}</textarea>
                <label for="textarea2">Tags</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s6 m6 l6">
                <input disabled id="localisation" :value="localisationExist" type="text" class="validate">
                <label for="localisation">Localisation</label>
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
      user: {}
    }
  },
  methods: {
    report () {
      window.Materialize.toast('User has been reported!', 3000)
    },
    block () {
      axios.post('block/' + this.user._id)
        .then(res => {
          window.Materialize.toast('User has been blocked!', 3000)
        })
        .catch(() => {
          window.Materialize.toast('An error occured', 3000)
        })
    },
    like () {
      var self = this
      axios.post('like/' + this.user._id)
        .then(function (res) {
          if (res.status === 200) {
            if (res.data === 'liked') {
              this.user.likedYou.push(self.$store.getters.GET_ID)
              window.Materialize.toast(`You liked ${this.user.username} !`, 3000)
            } else if (res.data === 'liked back') {
              this.user.likedYou.push(self.$store.getters.GET_ID)
              window.Materialize.toast(`You liked ${this.user.username} back !`, 3000)
            } else {
              this.user.likedYou.splice(this.user.likedYou.indexOf(self.$store.getters.get_id), 1)
              window.Materialize.toast(`You disliked ${this.user.username} !`, 3000)
            }
          }
        })
        .catch(function (err) {
          if (err.response.status === 401) window.Materialize.toast(`You can't like yourself!`, 3000)
          if (err.response.status === 500 && err.response.data === 'image') window.Materialize.toast(`You need to upload at least 1 image to like someone!`, 3000)
          else window.Materialize.toast(`An error occured. Please try again!`, 3000)
        })
    },
    thumb (user) {
      if (user.likedYou) return user.likedYou.indexOf(this.$store.getters.GET_ID) === 0 ? 'thumb_up' : 'thumb_down'
      else return 'thumb_down'
    }
  },
  computed: {
    sameID () {
      return this.user._id !== this.$store.getters.GET_ID
    },
    score () {
      return this.user && this.user.likedYou ? this.user.likedYou.length : 0
    },
    userAvatar () {
      if (this.user.avatar === undefined || this.user.avatar < 0) return 'http://hdwallsource.com/img/2016/10/golden-retriever-dog-widescreen-wallpaper-49689-51367-hd-wallpapers.jpg'
      return this.user.image[this.user.avatar] || 'http://hdwallsource.com/img/2016/10/golden-retriever-dog-widescreen-wallpaper-49689-51367-hd-wallpapers.jpg'
    },
    imageExist () {
      if (!this.user.image) return 0
      return this.user.image.length
    },
    tagsExist () {
      return this.user.tag ? this.user.tag.join(' ') : ''
    },
    localisationExist () {
      return this.user.localisation ? this.user.localisation.city : ''
    }
  },
  beforeMount () {
    var id = this.$route.path.split('/')[2]
    var self = this
    axios.get('user/' + id)
      .then(function (res) {
        self.user = res.data
        window.Materialize.toast(`You looked!`, 3000)
      })
      .catch(() => {
      })
  },
  mounted () {
    require('../../static/js/form.js')()
    require('../../static/js/app.js')()
  },
  updated () {
    require('../../static/js/form.js')()
    require('../../static/js/app.js')()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
