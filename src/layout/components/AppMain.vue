<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <div v-if="$store.state.settings.showFooter" id="el-main-footer">
      <span>{{ copyRight }}</span>
      <span> ⋅ </span>
      <a href="http://www.beian.miit.gov.cn" target="_blank">{{ caseNumber }}</a>
    </div>
  </section>
</template>

<script>
import { config } from '@/api/system/system'
export default {
  name: 'AppMain',
  data(){
    return{
      caseNumber:this.$store.state.tagsView.cachedViews,
      copyRight:this.$store.state.settings.footerTxt
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  },
  mounted(){
    this.config();
  },
  methods:{
      config(){
        config().then(res=>{
          this.caseNumber = res.caseNumber
          this.copyRight = res.copyRight
        })
      }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
