import Vue from 'vue'
import Router from 'vue-router'
import Project from '@/components/Project'
import Config from '@/components/Config'
import Result from '@/components/Result'
import Topo from '@/components/Topo'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/Login',
      component: Login
    },
    {
      path: '/Project',
      component: Project
    },
    {
      path: '/Config/:id',
      component: Config,
      props: true
    },
    {
      path: '/Result/:id',
      component: Result,
      props: true
    },
    {
      path: '/Topo',
      component: Topo,
      props: (router) => ({
        id: router.query.id,
        projectID: router.query.projectID
      })
    }
  ]
})
