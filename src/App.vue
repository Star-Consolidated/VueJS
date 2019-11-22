<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app >
      <v-list dense>

        <template v-for="item in items">          
          <v-list-item :key="item.text" link router :to=item.to>
            <v-list-item-action >
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark >
      
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4" >
        <span class="hidden-sm-and-down">{{project}}</span>
      </v-toolbar-title> 
           
      <v-spacer />
      <v-btn icon>
        <v-icon>apps</v-icon>
      </v-btn>      

    </v-app-bar>

    <v-content>

      <v-container class="fill-height" fluid >
        <v-slide-y-transition mode="out-in">
          <router-view/>   
        </v-slide-y-transition>
      </v-container>

    </v-content>
    
  </v-app>
</template>

<script>

export default {
  name: 'App',

  props: {
    source: String,
  },

  data: () => ({
    drawer: null,
    project: 'PuffleShop',
    items: [
      { icon: 'home', title: 'Home', to: '/' },
      { icon: 'store_mall_directory', title: 'Tiendas', to: '/tiendas' },
      { icon: 'pets', title: 'Productos', to: '/productos' },
      { icon: 'shopping_cart', title: 'Mi carrito', to: '/carritos' },
      { icon: 'settings', title: 'Configuracion', to: '/config' },
      { icon: 'grade', title: 'Rate Us', to: '/rateus'},
      
    ],
  }),
};
</script>