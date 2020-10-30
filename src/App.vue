<template>   
  <div id="app">
    <router-view v-if="keepAlive" />
  </div>
</template>

<script>
import Theme from './utils/theme';
import {mapState} from 'vuex';
export default {
  name: 'App',
  provide (){
    return {
      reload:this.reload
    }
  },
  data(){
    return {
      keepAlive:true
    }
  },
  computed: {
    ...mapState('settings', {
      theme: state => state.theme
    })
  },
  created () {
    Theme.changeTheme(this.theme);
  },
  methods:{
    reload(){
      this.keepAlive = false
      this.$nextTick(function(){
        this.keepAlive = true
      })
    }
  }
}
</script>
<style >
  @import '/css/index.css';
  @import '/css/fonts.css';

  .marT16{
    margin-top: 16px;
  }
  .padT16{
    padding-top: 16px;
  }
  
</style>
