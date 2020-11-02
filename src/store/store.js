import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from "vuex-persistedstate"
import SecureLS from "secure-ls";
var ls = new SecureLS({ isCompression: false });

Vue.use(Vuex)

const defaultState = {
        employees: [],
        userRole: {},
}

export const store = new Vuex.Store( {

    plugins: [
        createPersistedState({
            storage: {
              getItem: (key) => ls.get(key),
              setItem: (key, value) => ls.set(key, value),
              removeItem: (key) => ls.remove(key),
            },
          }),
    ],

    state: defaultState,

    actions: {
        loadEmployees({commit, state}) {
            console.log(state.employees)
            if (state.employees.length === 0) {
                axios.get(`${process.env.VUE_APP_API_BASE_URL}/meta/employee/search/a`)
                    .then((response) => {
                        commit('SET_EMPLOYEES', response.data)
                    })
            }
        },
        loadUserRole({commit, state}) {
            axios.get(`${process.env.VUE_APP_API_BASE_URL}/request/user`)
                    .then((response) => {
                        commit('SET_USER', response.data)
                    })
        },

        resetState({commit}) {            
            commit('RESET_STATE')
        }

      },

      mutations: {
        SET_EMPLOYEES(state, employees) {
            state.employees = employees
        },
        SET_USER(state, user) {
            state.userRole = user
        },
        RESET_STATE(state) {
            Object.assign(state, defaultState)
        }
      },
    
} )