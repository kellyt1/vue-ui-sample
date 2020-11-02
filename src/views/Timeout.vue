<template>
  <b-container fluid>
    <b-row>
      <b-col class="text-center">
        <h1 style="margin-top:25px;">Your session has expired.</h1>
        <h2 style="margin-top:10px;">Please sign in again to start a new session.</h2>

        <div style="margin-top:45px; font-weight:700">
          <router-link :to="{name: 'home'}">
            <b-button id="btnHome" variant="primary">Return Home</b-button>
          </router-link>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

export default {
  name: 'timeout',

  created() {
      this.interval = setInterval(
          function () {
              this.$router.push({path: "/"});
          }.bind(this),
          4000
      );
  }
}
</script>
