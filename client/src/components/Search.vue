<template>
  <!--Container-->
  <div class="container">
    <!--Title
    <h1 class="header center">Search</h1>
    <div class="divider"></div>-->
    <!--Filter-->
    <div class="row">
      <div class="row">

        <div class="col l8 m8 s12">
          <div class="row">
            <h2 class="header">Filter</h2>
            <div class="input-field col s12 sexe">
              <select>
                <option value="" selected>All</option>
                <option value="1">Men</option>
                <option value="2">Women</option>
              </select>
              <label>Sexe</label>
            </div>
            <div class="col l11 m12 s12">
              <span v-show="!brokenAge">Age</span>
              <div class="sliders" id="slider1"></div>
              <span id="lower-value1"></span>
              <span id="upper-value1"></span>
            </div>
            <div class="col l11 m12 s12">
              <span v-show="!brokenScore">Score</span>
              <div class="sliders" id="slider2"></div>
              <span id="lower-value2"></span>
              <span id="upper-value2"></span>
            </div>
            <div class="col l11 m12 s12">
              <span v-show="!brokenDistance">Distance</span>
              <div class="sliders" id="slider3"></div>
              <span id="lower-value3"></span>
              <span id="upper-value3"></span>
            </div>
            <div class="input-field col s8 m12 s12 center">
              <input type="text" id="autocomplete-input" class="autocomplete" v-model="localisation">
              <label for="autocomplete-input">Localisation</label>
            </div>
            <div class="row">
              <div class="col s8 m12 s12">
                 <label>Tags</label>
                <div class="chips chips-autocomplete chips-placeholder chips-initial">
                 Tag
                 <i class="close material-icons">close</i>
               </div>
              </div>
            </div>
            <button class="col offset-l1 offset-m1 l10 m10 s12 center btn waves-effect waves-light" @click.stop.prevent="filter">Filter
              <i class="material-icons right">search</i>
            </button>
          </div>
        </div>
        <div class="col l4 m4 s12">
          <div class="row center">
            <h2 class="header">Sort</h2>

            <div class="input-field col s12 sort">
              <select>
                <option value="" disabled selected>Choose your option</option>
                <option value="1">Age</option>
                <option value="2">Localisation</option>
                <option value="3">Score</option>
                <option value="3">Tags</option>
              </select>
              <label>Sort Select</label>
            </div>
            <div class="input-field col s12 cmp">
              <select>
                <option>Ascendant</option>
                <option>Descendant</option>
              </select>
              <label>Sort Select</label>
            </div>
            <button @click.stop="sort" class="col s12 btn waves-effect waves-light">Sort
              <i class="material-icons right">search</i>
            </button>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <!--Container-->
      <div class="row">
        <transition-group name="slide-fade" mode="in-out" tag="div">
        <div class="col l4 m6 s12" v-for="user in users" :key="user">
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
      </transition-group>
      </div>

    <!--End Wrapper-->
    </div>
  <!--End Container-->
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import noUiSlider from '../../static/js/nouislider'

function getDistanceFromLatLonInKm (lat1, lon1, lat2, lon2) {
  var R = 6371
  var dLat = deg2rad(lat2 - lat1)
  var dLon = deg2rad(lon2 - lon1)
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c
  return Math.floor(d * 100) / 100
}

function deg2rad (deg) {
  return deg * (Math.PI / 180)
}

let wNumb = window.wNumb

const asc = (a, b) => a < b
const desc = (a, b) => a > b

export default {
  data () {
    return {
      users: [],
      usersOriginal: [],
      localisation: '',
      tags: [],
      brokenAge: true,
      brokenDistance: true,
      brokenScore: true,
      initialTags: []
    }
  },
  methods: {
    sort () {
      let sort = document.querySelectorAll('.sort > .select-wrapper > ul > li.active')
      let cmp = document.querySelectorAll('.cmp > .select-wrapper > ul > li.active')
      if (sort && sort[0]) sort = sort[0].innerText
      cmp = cmp.length > 0 && cmp[0].innerText === 'Descendant' ? desc : asc
      if (!sort || sort.length === 0) window.Materialize.toast('Please select a option!', 3000)
      if (sort === 'Localisation') this.users = this.users.sort((a, b) => cmp(a.localisation.distance, b.localisation.distance))
      if (sort === 'Age') this.users = this.users.sort((a, b) => cmp(a.age, b.age))
      if (sort === 'Score') {
        this.users.forEach(e => { e.score = e.likedYou.length })
        this.users = this.users.sort((a, b) => cmp(a.score, b.score))
      }
      if (sort === 'Tags') {
        var user = this.$store.getters.GET_USER
        this.users.forEach(u => { u.nbTags = user.tag.filter(t => u.tag.indexOf(t) > -1).length })
        this.users = this.users.sort((a, b) => cmp(a.nbTags, b.nbTags))
      }
    },
    filter () {
      var [minAge, maxAge] = [
        document.getElementById('lower-value1').innerHTML.split(',')[0],
        document.getElementById('upper-value1').innerHTML.split(',')[0]
      ]
      var [minScore, maxScore] = [
        document.getElementById('lower-value2').innerHTML.split(',')[0],
        document.getElementById('upper-value2').innerHTML.split(',')[0]
      ]
      var [minDistance, maxDistance] = [
        document.getElementById('lower-value3').innerHTML.split(',')[0],
        document.getElementById('upper-value3').innerHTML.split(',')[0]
      ]

      let sexe = document.querySelectorAll('.sexe > .select-wrapper > ul > li.active')
      sexe = sexe && sexe.length > 0 ? sexe[0].innerText : false
      this.users = _.cloneDeep(this.usersOriginal)

      if (sexe && sexe !== 'All') {
        this.users = this.users.filter(u => u.sexe === sexe)
      }

      if (!this.brokenAge) {
        this.users = this.users
           .filter(u => u.age >= minAge)
           .filter(u => u.age <= maxAge)
      }

      if (!this.brokenScore) {
        this.users = this.users
          .filter(u => u.likedYou.length >= minScore)
          .filter(u => u.likedYou.length <= maxScore)
      }

      if (!this.brokenDistance) {
        this.users = this.users
          .filter(u => u.localisation.distance >= minDistance)
          .filter(u => u.localisation.distance <= maxDistance)
      }

      if (this.localisation !== '') {
        this.users = this.users.filter(u => u.localisation.city.toUpperCase().startsWith(this.localisation.toUpperCase()))
      }

      if (this.tags.length) {
        this.users = this.users.filter(u => this.tags.filter(tag => u.tag.indexOf(tag) > -1).length > 0)
      }
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
  beforeMount () {
    this.$store.dispatch('sync', {ctx: this, redirect: false})
  },
  mounted () {
    axios.get('user')
    .then(res => {
      let userID = this.$store.getters.GET_ID
      let la = this.$store.getters.GET_USER.localisation.latitude
      let ll = this.$store.getters.GET_USER.localisation.longitude
      this.users = res.data
        .filter(e => e._id !== userID)
        .filter(e => this.$store.getters.GET_USER.blocked.indexOf(e._id.toString()) < 0)
        .filter(e => e.age > 17)
        .map(e => {
          e.localisation.distance = getDistanceFromLatLonInKm(la, ll, e.localisation.latitude, e.localisation.longitude)
          return e
        })
      this.usersOriginal = _.cloneDeep(this.users)
      res.data.forEach(u => this.initialTags.push(...u.tag))
      var userAge = this.users.map(u => u.age)
      var userScore = this.users.map(u => u.likedYou.length)
      var userDistance = this.users.map(u => u.localisation.distance)
      var minAge = Math.min(...userAge)
      var maxAge = Math.max(...userAge)
      var minScore = Math.min(...userScore)
      var maxScore = Math.max(...userScore)
      var minDistance = Math.min(...userDistance)
      var maxDistance = Math.max(...userDistance)
      var slider1 = document.getElementById('slider1')
      var slider2 = document.getElementById('slider2')
      var slider3 = document.getElementById('slider3')

      if (minAge !== maxAge) this.brokenAge = false
      if (minScore !== maxScore) this.brokenScore = false
      if (minDistance !== maxDistance && Math.floor(minDistance) < Math.floor(maxDistance)) this.brokenDistance = false

      if (this.users.length === 0) {
        window.Materialize.toast(`Please insert more user`, 3000)
      } else {
        if (!this.brokenAge && slider1) {
          noUiSlider.create(slider1, {
            start: [minAge, maxAge],
            connect: true,
            step: 1,
            range: {
              'min': minAge,
              'max': maxAge
            },
            format: wNumb({
              decimals: 0
            })
          })

          var nodes1 = [
            document.getElementById('lower-value1'), // 0
            document.getElementById('upper-value1')  // 1
          ]

          slider1.noUiSlider.on('update', function (values, handle, unencoded, isTap, positions) {
            nodes1[handle].innerHTML = values[handle] + ', ' + positions[handle].toFixed(2) + '%'
          })
        }
        if (!this.brokenScore && slider2) {
          noUiSlider.create(slider2, {
            start: [minScore, maxScore],
            connect: true,
            step: 1,
            range: {
              'min': minScore,
              'max': maxScore
            },
            format: wNumb({
              decimals: 0
            })
          })

          var nodes2 = [
            document.getElementById('lower-value2'), // 0
            document.getElementById('upper-value2')  // 1
          ]

          slider2.noUiSlider.on('update', function (values, handle, unencoded, isTap, positions) {
            nodes2[handle].innerHTML = values[handle] + ', ' + positions[handle].toFixed(2) + '%'
          })
        }
        if (!this.brokenDistance && slider3) {
          noUiSlider.create(slider3, {
            start: [minDistance, maxDistance],
            connect: true,
            step: 1,
            range: {
              'min': minDistance,
              'max': maxDistance
            },
            format: wNumb({
              decimals: 2
            })
          })

          var nodes3 = [
            document.getElementById('lower-value3'), // 0
            document.getElementById('upper-value3')  // 1
          ]

          slider3.noUiSlider.on('update', function (values, handle, unencoded, isTap, positions) {
            nodes3[handle].innerHTML = values[handle] + ', ' + positions[handle].toFixed(2) + '%'
          })
        }
      }
      window.$('.chips').material_chip()

      var complete = this.initialTags.reduce((acc, value) => {
        acc[value] = null
        return acc
      }, {})
      var initial = this.initialTags.reduce((acc, value) => {
        acc.push({tag: value})
        return acc
      }, [])

      this.tags = [...this.initialTags]
      var self = this

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
        self.tags.push(chip.tag)
      })

      window.$('.chips').on('chip.delete', function (e, chip) {
        self.tags.splice(self.tags.indexOf(chip.tag), 1)
      })

      require('../../static/js/form.js')()
      require('../../static/js/app.js')()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
