<template>
  <!--Container-->
  <div class="container">

    <!--Wrapper-->
    <div class="row">

      <h1 class="header center">Notifications</h1>
      <div class="divider"></div>

      <div class="row" v-for="notification in notifications" :key=notification>
      <div class="col s12 m12 l12">
        <div class="card-panel center-align">
          <span> {{ notification }}</span>
        </div>
      </div>
    </div>
    <div v-show="notificationsExist" class="col s12 m12 l12">
      <div class="card-panel center-align">
        <span>You don't have any notification</span>
      </div>
    </div>
    <!--End Wrapper-->
    </div>
  <!--End Container-->
  </div>
</template>

<script>

export default {
  computed: {
    notifications () {
      return this.$store.getters.GET_NOTIF.reverse()
    },
    notificationsExist () {
      return this.$store.getters.GET_NOTIF.length === 0
    }
  },
  mounted () {
    this.$store.dispatch('raz', {ctx: this, redirect: false})
    require('../../static/js/form.js')()
    require('../../static/js/app.js')()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
