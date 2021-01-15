<template ondragstart="return false">
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title mt-5">
            {{title}}
          </v-list-item-title>
          <v-list-item-subtitle class="mb-5">
            Life, simplified.
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense 
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.to"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      color="#fcb69f"
      dark
      shrink-on-scroll
      :src="require('../../assets/sky.jpg')"
      scroll-target="#scrolling-techniques-2"
      class="tall"
    >
      <template v-slot:img="{ props }">
        <v-img
        class="tall"
          v-bind="props"
          gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="title-container">
        <v-app-bar-title>Welcone, {{ displayName }} </v-app-bar-title>
        <Clock/>
      </div>
      
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Clock from "../Clock"
import moment from 'moment'
import liff from '@line/liff';
import { mapState } from 'vuex';
import store from "../../store/index"
const axios = require("axios");

export default {
  name: "Navbar",
  props: ['title'],  
  components: {
    Clock
  },
  computed: mapState({  
    name: function(state) {
      return state.lineProfile.displayName
    }
  }),
  mounted() {
    liff.init({ liffId: "1655572907-4aGkzOv5" })
    .then(()=> {
      console.log("TEST")
      if (liff.isLoggedIn()) {
        console.log("Logged in")
        liff.getProfile().then((profile)=> {
          this.$store.dispatch({type: 'setLine', value: profile})
          this.displayName = profile.displayName
          console.log(profile)
          axios
            .get(
              `https://self-manager-868b0-default-rtdb.firebaseio.com/user/${profile.userId}/todos.json`
            )
            .then((res) => {
              console.log(`https://self-manager-868b0-default-rtdb.firebaseio.com/user/${profile.userId}/todos.json`)
              this.$store.dispatch({ type: "setTasks", value: res.data });
              console.log(res);
            })
            .catch((err) => {
              console.log(err.response);
            });
        })
        .catch((err)=> {
          console.log("can't get profile")
          console.log(err)
        })
      } else {
        console.log("Not logged in")
        liff.login();
      }
      
    })
  },
  data: () => ({ 
    drawer: null,
    items: [
      { title: 'Todo', icon: 'mdi-format-list-checks', to: '/' },
      { title: 'Notes', icon: 'mdi-view-dashboard', to: '/notes' },
      { title: 'About', icon: 'mdi-help-box', to:'/about' },
    ],
    right: null,
    displayName: ""
  }),
};
</script>

<style lang="scss">
  .v-app-bar-title__placeholder, .v-app-bar-title__content {
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 200px !important;
    
  }
  .title-container {
    position: absolute;
    left: 20px;
    top: 50px;
    width: 100%;
    .v-app-bar-title__placeholder, .v-app-bar-title__content {
      width: 100% !important;
    }
    p{
      font-size: 12px;
    }
  }
  .tall {
    height: 200px !important;
  }
  .v-navigation-drawer {
    z-index: 300
  }
</style>