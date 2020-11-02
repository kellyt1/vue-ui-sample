import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Index from '@/views/Index.vue'
import LocalStorageService from "@/common/LocalStorageService";

const localStorageService = LocalStorageService.getService();

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        requiresAuth: false
      },
      component: Index
    },
    {
      path: '/licenseSearch',
      name: 'licenseSearch',
      meta: {
        requiresAuth: false
      },
      component: () => import(/* webpackChunkName: "timeout" */ './views/LicenseSearch.vue')
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        requiresAuth: true
      },
      component: Home
    },
    {
      path: '/timeout',
      name: 'timeout',
      meta: {
        requiresAuth: false
      },
      component: () => import(/* webpackChunkName: "timeout" */ './views/Timeout.vue')
    },

    {
      path: "/application",
      name: 'application',
      meta: {
        requiresAuth: true,
      },
      component: () => import(/* webpackChunkName: "request" */ './views/EditApplication.vue')
    },

    {
      path: "/thanks",
      name: 'thanks',
      meta: {
        requiresAuth: false,
      },
      component: () => import(/* webpackChunkName: "thanks" */ './views/Thanks.vue')
    },

    {
      path: "/renewal/:token?",
      name: 'renewal',
      meta: {
        requiresAuth: true,
      },
      component: () => import(/* webpackChunkName: "renewal" */ './views/RenewalApplication.vue')
    },

    {
      path: "/view/:id",
      name: 'view',
      meta: {
        requiresAuth: true,
      },
      component: () => import(/* webpackChunkName: "request" */ './views/ViewApplication.vue')
    },
    {
      path: "/emailSettings",
      name: 'emailSettings',
      meta: {
        requiresAuth: true,
      },
      component: () => import(/* webpackChunkName: "admin" */ './views/admin/ManageEmails.vue')
    },
    {
      path: "/feeSettings",
      name: 'feeSettings',
      meta: {
        requiresAuth: true,
      },
      component: () => import(/* webpackChunkName: "admin" */ './views/admin/ManageFees.vue')
    },
    {
      path: "/welcomeSettings",
      name: 'welcomeSettings',
      meta: {
        requiresAuth: true,
      },
      component: () => import(/* webpackChunkName: "admin" */ './views/admin/ManageWelcome.vue')
    },
    {
      path: "/certificateSettings",
      name: 'certificateSettings',
      meta: {
        requiresAuth: true,
      },
      component: () => import(/* webpackChunkName: "admin" */ './views/admin/ManageCertificates.vue')
    },
    {
      path: "/claim",
      name: 'claim',
      meta: {
        requiresAuth: true,
      },
      component: () => import(/* webpackChunkName: "admin" */ './views/ClaimApplication.vue')
    },

    {
      path: '/unauthorized',
      name: 'unauthorized',
      meta: {
        requiresAuth: false
      },
      component: () => import(/* webpackChunkName: "unauthorized" */ './views/Unauthorized.vue')
    },

    {
      path: '*', 
      component: Home
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (router.app.$keycloak && router.app.$keycloak.authenticated) {
      if (to.meta.authRoles) {
        let hasRole = false
        for (var i = 0; i < to.meta.authRoles.length; i++) {
          if (router.app.$keycloak.hasResourceRole(to.meta.authRoles[i])) {
            hasRole = true;
          }
        }
        if (hasRole) {
          next()
        } else {
          router.push('unauthorized') 
        }
      } else {
        next();
      }
    } else {
      const url = localStorageService.getLoginUrl()
      window.location.replace(url)
    }
  } else {
    next()
  }
})

export default router