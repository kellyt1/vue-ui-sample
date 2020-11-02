<template>
    <div class="home">
        <b-container fluid>
            <h1>MN Body Art Licensing System</h1>
            <p v-html="welcomeText" style="margin-top:25px; margin-bottom:26px;"></p>

            <b-row>
                <b-col>
                    <b-button variant="primary" @click="login">Login or Create Account</b-button>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import axios from "axios"
    import axiosRetry from 'axios-retry'

    axiosRetry(axios, { retries: 3,
        retryDelay: axiosRetry.exponentialDelay  })

    export default {
        data: () => ({
            welcomeText: ''
        }),
        created() {
            this.loadWelcomeText()
        },
        methods: {
            login () {
               window.location.replace('/home')
            },
            loadWelcomeText() {
                axios.get(`${process.env.VUE_APP_API_BASE_URL}/settings/welcome`, { ignoreHeader: true })
                    .then(response => { this.welcomeText = response.data.value })
            },
        }
    }
</script>

<style>
</style>