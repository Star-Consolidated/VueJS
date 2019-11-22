import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Productos from '../components/Productos.vue'
import Tiendas from '../components/Tiendas.vue'
import Config from '../components/Config.vue'
import Rate from '../components/Rate.vue'
import Carrito from '../components/Carrito.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/productos',
    name: 'productos',
    component: Productos
  },
  {
    path: '/tiendas',
    name: 'tiendas',
    component: Tiendas

  },
  {
    path: '/carritos',
    name: 'carritos',
    component: Carrito
  },
  {
    path: '/rateus',
    name: 'rateus',
    component: Rate

  },
  {
    path: '/config',
    name: 'config',
    component: Config

  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
