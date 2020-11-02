<template>
  <b-container fluid>
    <b-row>
      <b-col class="text-center">
        <h1 style="margin-top:25px;">Thank you for submitting your application today.</h1>
        <h2> MDH Staff will review the application and take the appropriate action.</h2>
        
        <div style="margin-top:45px; font-weight:700">
          <router-link :to="{name: 'index'}">
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
     setTimeout( () => this.$router.push({ path: '/home'}), 10000);
  }
}
</script>