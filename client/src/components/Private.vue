<template>
  <!--Container-->
  <div class="container">

    <!--Wrapper-->
    <div class="row">

      <!--Title-->
      <h1 class="header center">Welcome {{ user.username }}</h1>
      <div class="divider"></div>

      <!--Forms-->
      <div class="row">
          <div class="col l4 m6 s12  relative">
            <div class="row">
              <div class="card">
                <div class="card-image">
                  <img :src="userAvatar">
                  <router-link :to="'Public/' + user._id" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">add</i></router-link>
                  <a class="btn-floating halfway-fab waves-effect waves-light green score"><div class="relative"><p>{{ scorePrivate }}</p></div></a>
                </div>
                <div class="card-content">
                  <span class="card-title">{{ user.username }}</span>
                  <p>{{ user.bio }}</p>
                </div>
              </div>
            </div>

            <div class="divider"></div>
            <h5 class="header center">Gallery</h5>
            <div class="divider"></div>
            <form method="post">
              <div class="row">
                <div class="col l6 m11 s11 relative" v-for="(image, index) in user.image" :key="image">
                  <a @click.stop.prevent="deleteImage(image)" class="btn-floating halfway-fab waves-effect waves-light grey delete"><i class="material-icons">delete</i></a>
                  <input :id="'test' + index" name="group1" type="radio" @click="saveIndex(index)"/>
                  <label :for="'test' + index">
                    <div class="relative"><img :src="image" class="materialboxed private"/></div>
                  </label>
                </div>
                  <button @click.prevent.stop="saveImage(index)" v-if="imageExist" class="btn waves-effect waves-light btn-img-save col offset-l1 offset-m1 l10 m10 s12">Save<i class="material-icons right">mode_edit</i></button>
              </div>
            </form>
            <div class="row">
              <div class="col l12 m12 s12">
                <form enctype="multipart/form-data">
                  <div class="file-field input-field">
                    <div class="btn"><span>UP</span>
                      <input type="file" accept="image/*" @change="upload($event)"/>
                    </div>
                    <div class="file-path-wrapper">
                      <input type="text" placeholder="Upload one or more files" class="file-path validate"/>
                    </div>
                    <button @click.prevent.stop="sendImage" class="btn waves-effect waves-light btn-img-save col offset-l1 offset-m1 l10 m10 s12">Send<i class="material-icons right">library_add</i></button>
                  </div>
                </form>
              </div>
            </div>

          </div>
          <form class="col l7 m6 s12 offset-s1 pad-form">
            <div class="row">
              <div class="input-field col s6 m6 l6">
                <input id="first_name" v-model="user.firstName" type="text" class="validate">
                <label for="first_name">First Name</label>
              </div>
              <div class="input-field col s6 m6 l6">
                <input id="last_name" v-model="user.lastName" type="text" class="validate">
                <label for="last_name">Last Name</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s6 m6 l6">
                <input id="email" v-model="user.email" type="email" class="validate">
                <label for="email">Email</label>
              </div>
              <div class="input-field col s6 m6 l6">
                <input id="age" v-model="user.age" type="number" class="validate">
                <label for="age">Age</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12 sexe">
                <select v-model="user.sexe">
                  <option disabled selected>Choose your option</option>
                  <option>Men</option>
                  <option>Women</option>
                </select>
                <label>Sexe</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12 orientation">
                <select v-model="user.orientation">
                  <option>Men</option>
                  <option>Women</option>
                  <option>Bi</option>
                </select>
                <label>Sexual Orientation</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <textarea id="textarea1" class="materialize-textarea" data-length="180" v-model="user.bio"></textarea>
                <label for="textarea1">Bio</label>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                 <label>Tags (Press enter to validate your tag)</label>
                <div class="chips chips-autocomplete chips-placeholder chips-initial">
                 Tag
                 <i class="close material-icons">close</i>
               </div>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s6 m6 l6">
                <input id="localisation" v-model="user.localisation.city" type="text" class="validate">
                <label for="localisation">Localisation</label>
              </div>
              <div class="right-align">
                <button class="btn waves-effect waves-light" @click.stop.prevent="save">Save
                  <i class="material-icons right">mode_edit</i>
                </button>
              </div>
            </div>
          </form>
      </div>

      <!--People who liked you-->
      <div v-if="usersLikedYouExist">
          <div class="divider"></div>
          <h3 class="header center">People who liked you</h3>
          <div class="divider"></div>
          <div class="row">
            <div class="col l4 m6 s12" v-for="user in usersLikedYou" :key="user">
              <div class="row">
                <div class="card marg">
                  <div class="card-image">
                    <img :src="userAvatarPublic(user)">
                    <router-link :to="'Public/' + user._id" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">add</i></router-link>
                    <a @click.stop.prevent="like(user)" class="btn-floating halfway-fab waves-effect waves-light blue like"><i class="material-icons">{{ thumb(user) }}</i></a>
                    <a class="btn-floating halfway-fab waves-effect waves-light green score"><div class="relative"><p>{{ score(user) }}</p></div></a>
                  </div>
                  <div class="card-content">
                    <span class="card-title"> {{ user.username }} </span>
                    <p> {{ user.bio }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!--People who looked you-->
      <div v-if="usersLookedYouExist">
        <div class="divider"></div>
        <h3 class="header center">People who looked you</h3>
        <div class="divider"></div>
        <div class="row">
          <div class="col l4 m6 s12" v-for="user in usersLookedYou" :key="user">
            <div class="row">
              <div class="card marg">
                <div class="card-image">
                  <img :src="userAvatarPublic(user)">
                  <router-link :to="'Public/' + user._id" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">add</i></router-link>
                  <a @click.stop.prevent="like(user)" class="btn-floating halfway-fab waves-effect waves-light blue like"><i class="material-icons">{{ thumb(user) }}</i></a>
                  <a class="btn-floating halfway-fab waves-effect waves-light green score"><div class="relative"><p>{{ score(user) }}</p></div></a>
                </div>
                <div class="card-content">
                  <span class="card-title"> {{ user.username }} </span>
                  <p> {{ user.bio }}</p>
                </div>
              </div>
            </div>
          </div>
           </div>
      </div>
    </div>
    <!--End Wrapper-->
    </div>
  <!--End Container-->
  </div>
</template>

<script>
import axios from 'axios'
const time = 3000

export default {
  data () {
    return {
      user: {},
      usersLookedYou: [],
      usersLikedYou: [],
      sexe: '',
      image: {},
      orientation: 'Bi',
      index: undefined,
      initialTags: []
    }
  },
  methods: {
    getPublicLink () {
      return 'public/' + this.$store.getters.GET_ID
    },
    save () {
      let sexe = document.querySelectorAll('.sexe > .select-wrapper > ul > li.active')
      let orientation = document.querySelectorAll('.orientation > .select-wrapper > ul > li.active')
      if (sexe && sexe[0]) this.user.sexe = sexe[0].innerText
      if (orientation && orientation[0]) this.user.orientation = orientation[0].innerText

      var geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ 'address': this.user.localisation.city }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          this.user.localisation.latitude = results[0].geometry.location.lat()
          this.user.localisation.longitude = results[0].geometry.location.lng()
          this.$store.dispatch('update', {ctx: this, user: this.user})
        } else {
          window.Materialize.toast('Your city was not located! It may cause some inaccuracy during your search!', time)
          window.Materialize.toast('Please use an another city a bit bigger!', time)
        }
      })
    },
    upload (e) {
      this.image = e.target.files[0]
    },
    sendImage () {
      var data = new FormData()
      data.append('image', this.image)
      axios.post('image/' + this.$store.getters.GET_ID, data)
        .then(res => {
          window.Materialize.toast(res.data, time)
          this.$store.dispatch('sync', {ctx: this})
        })
        .catch(() => {
          window.Materialize.toast('An error occured. Please try again!', time)
        })
    },
    deleteImage (url) {
      url = url.substr(28) // 32
      axios.delete('image/' + url)
        .then(res => {
          window.Materialize.toast(res.data, time)
          this.$store.dispatch('sync', {ctx: this})
        })
        .catch(() => {
          window.Materialize.toast('An error occured. Please try again!', time)
        })
    },
    saveImage () {
      if (this.index < 0) {
        window.Materialize.toast('Please select an image!', time)
      } else {
        axios.patch('image/' + this.index)
          .then(res => {
            window.Materialize.toast(res.data, time)
            this.$store.dispatch('sync', {ctx: this})
          })
          .catch(() => {
            window.Materialize.toast('An error occured. Please try again!', time)
          })
      }
    },
    saveIndex (index) {
      this.index = index
    },
    like (user) {
      var self = this
      axios.post('like/' + user._id)
        .then(function (res) {
          if (res.status === 200) {
            if (res.data === 'liked') {
              user.likedYou.push(self.$store.getters.GET_ID)
              window.Materialize.toast(`You liked ${user.username} !`, 3000)
            } else if (res.data === 'liked back') {
              user.likedYou.push(self.$store.getters.GET_ID)
              window.Materialize.toast(`You liked ${user.username} back !`, 3000)
            } else {
              user.likedYou.splice(user.likedYou.indexOf(self.$store.getters.get_id), 1)
              window.Materialize.toast(`You disliked ${user.username} !`, 3000)
            }
          }
        })
        .catch(function (err) {
          if (err.response.status === 401) window.Materialize.toast(`You can't like yourself!`, 3000)
          if (err.response.status === 500 && err.response.data === 'image') window.Materialize.toast(`You need to upload at least 1 image to like someone!`, 3000)
          else window.Materialize.toast(`An error occured. Please try again!`, 3000)
        })
    },
    score (user) {
      return user.likedYou.length
    },
    thumb (user) {
      return user.likedYou.indexOf(this.$store.getters.GET_ID) === -1 ? 'thumb_up' : 'thumb_down'
    },
    userAvatarPublic (user) {
      return user.image[user.avatar] || 'http://hdwallsource.com/img/2016/10/golden-retriever-dog-widescreen-wallpaper-49689-51367-hd-wallpapers.jpg'
    }
  },
  computed: {
    usersLookedYouExist () {
      return this.usersLookedYou.length
    },
    usersLikedYouExist () {
      return this.usersLikedYou.length
    },
    scorePrivate () {
      return this.user.likedYou.length
    },
    imageExist () {
      return this.user.image.length
    },
    userAvatar () {
      return this.user.image[this.user.avatar] || 'http://hdwallsource.com/img/2016/10/golden-retriever-dog-widescreen-wallpaper-49689-51367-hd-wallpapers.jpg'
    }
  },
  beforeMount () {
    this.user = this.$store.getters.GET_USER
    var self = this
    axios.get('user')
    .then(res => {
      self.usersLookedYou = res.data.filter(e => this.user.lookedYou.indexOf(e._id) >= 0)
      self.usersLikedYou = res.data.filter(e => this.user.likedYou.indexOf(e._id) >= 0)
      res.data.forEach(u => this.initialTags.push(...u.tag))
    })
  },
  mounted () {
    var self = this
    setTimeout(function () {
      var complete = self.initialTags.reduce((acc, value) => {
        acc[value] = null
        return acc
      }, {})
      var initial = self.user.tag.reduce((acc, value) => {
        acc.push({tag: value})
        return acc
      }, [])
      window.$('.chips').material_chip()

      window.$('.chips-autocomplete').material_chip({
        placeholder: 'Enter a tag',
        secondaryPlaceholder: '+Tag',
        data: initial,
        autocompleteOptions: {
          data: complete,
          limit: Infinity,
          minLength: 1
        }
      })
      window.$('.chips').on('chip.add', function (e, chip) {
        self.user.tag.push(chip.tag)
      })

      window.$('.chips').on('chip.delete', function (e, chip) {
        self.user.tag.splice(self.user.tag.indexOf(chip.tag), 1)
      })
    }, 1000)
    require('../../static/js/form.js')()
    require('../../static/js/app.js')()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
