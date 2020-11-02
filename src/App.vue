<template>
  <div id="app">
    <header>
      <div id="nav">
        <b-navbar toggleable="lg" type="light" variant="mdh">
          <b-navbar-brand href="#">
            <img src="./assets/logo-reverse.png" style="height:38px;" alt="Minnesota Department of Health Logo"/>
          </b-navbar-brand>
          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
              <b-nav-item href="/home">Home</b-nav-item>
              <b-nav-item href="/licenseSearch">License Search</b-nav-item>

              <b-nav-item-dropdown id="menu_admin" text="Admin"
                                   v-if="authenticated">
                <b-dropdown-item href="/reviewList">Submitted Applications</b-dropdown-item>
                <b-dropdown-item href="/claim">Claim My Licenses</b-dropdown-item>

                <b-dropdown-item href="/certificateSettings">Manage Certificate Settings</b-dropdown-item>
                <b-dropdown-item href="/feeSettings">Manage Fee Settings</b-dropdown-item>
                <b-dropdown-item href="/emailSettings">Manage Email Setttings</b-dropdown-item>
                <b-dropdown-item href="/welcomeSettings">Manage Welcome Page</b-dropdown-item>
              </b-nav-item-dropdown>



               <b-nav-item @click="logout" v-if="authenticated">Log out</b-nav-item>
               <b-nav-item @click="login" v-if="!authenticated">Log in</b-nav-item>
            
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>
    </header>

    <main id="main-content">
      <b-container fluid>
              <router-view/>
      </b-container>
    </main>

<div class="mt-5">
  <hr/>
		<div class="fluid-container footer">
			<p class="text-center" style="font-size:.85em;">For questions, please email <a style="" href="mailto:TBD@state.mn.us">TBD@state.mn.us</a>  - v{{appVersion}}</p>
		</div>
	</div>

  </div>
</template>

<script>
  import LocalStorageService from '@/common/LocalStorageService';
  import {version} from '../package.json';

  export default {
    metaInfo: {
      title: 'Welcome',
      htmlAttrs: {
        lang: 'en',
        amp: true
      }
    },
    computed: {
      authenticated: function() {
        if (this.$keycloak) {
          return this.$keycloak.authenticated;
        } else {
          return false;
        }
      },
      appVersion: function() {
        return version;
        }
    },


    methods: {
      login () {
        const localStorageService = LocalStorageService.getService();
        localStorageService.clearAuthTokens();    
        const loginUrl = this.$keycloak.createLoginUrl()
        window.location.replace(loginUrl)  
      },
      logout() {
        const localStorageService = LocalStorageService.getService()
        localStorageService.clearAuthTokens()
        this.$store.dispatch('resetState')
        this.$keycloak.clearToken()
        this.$keycloak.logoutFn()
      },
      hasRole(roles) {
        if (this.$keycloak) {
          return this.$keycloak.hasResourceRole(roles)
        } else {
          return false;
        }
      }
    },
  }
</script>

<style lang="scss">

  @import "assets/_custom.scss";
  @import "vue-select/src/scss/vue-select.scss";
  @import "~bootstrap/scss/bootstrap.scss";
  @import '~bootstrap-vue/dist/bootstrap-vue.css';
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
#app {
  font-family: 'Roboto', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

h1 {
  font-size: 30px;
  font-weight: 600;
}

h2 {
  font-size: 24px;
  font-weight: 600;
}

h3 {
  font-size: 18px;
  font-weight: 600;
}

button {
  margin-right: 18px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.bg-mdh {
  background-color: rgb(0, 56, 101);
}

#nav {
  padding-bottom: 30px;
}

#nav a {
  font-weight: normal;
  color: white;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#nav  a.dropdown-item {
  color: black !important;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
.sr-only-focusable:active,
.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  margin: 0;
  overflow: visible;
  clip: auto;
}

.colWidth40 {
  width: 40%;
}

.is-invalid .d-block {
    color: #ef0000;
}

.label-required::after {
  color: #0a8927;
  font-size: .7em;
  text-transform: uppercase;
  margin-left: 19px;
  content:" required";

}

.wizard-card-footer div span {
  outline: none;
}

.wizard-card-footer div span:focus button {
  -webkit-box-shadow: 0 0 0 0.2rem rgba(155, 89, 182, 0.25);
  box-shadow: 0 0 0 0.2rem rgba(155, 89, 182, 0.25);
}

.wizard-nav li:has(.disabled) {
  user-focus: none;
 }

</style>
