<template>
  <div>
    <!-- 文字 图片 video -->
    <div class="con_c">
      <div v-if="data.content">
        <div class="con_txt fw900 fs18" v-if="data.content.length < 18">
          {{ data.content }}
        </div>
        <div class="con_txt fw300 fs16 t_in" v-if="data.content.length >= 18">
          {{ data.content }}
        </div>
      </div>

      <div v-if="data.image && !data.video">
        <div class="con_img" v-for="(item, num) in data.image" :key="num">
          <img :src="item" alt="" />
        </div>
      </div>

      <div class="con_img" v-if="data.video">
        <!--在视频外面加一个容器-->
        <video-player
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
        ></video-player>
      </div>
    </div>
  </div>
</template>
<script >
export default {
  name: "imgTxtVideoShow",
  data() {
    return {
      image: null,
      video: null,
      video_img: null,
      content: null,
      // 视频播放
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], //可选择的播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "",
            src: this.data.video, //url地址
          },
        ],
        poster: "", //你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, //当前时间和持续时间的分隔符
          durationDisplay: true, //显示持续时间
          remainingTimeDisplay: false, //是否显示剩余时间功能
          fullscreenToggle: true, //全屏按钮
        },
      },
    };
  },
  
  props: ["data"],
  watch: {
    
  },

  methods: {},
  mounted: function () {},
};
</script>
<style scoped>
#myVideo {
  width: 100% !important;
  height: 220px !important;
}

.con_c {
  width: 100%;
  
  min-height: 300px;
  max-height: 500px;
  padding: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: -20px;
  border: 1px solid #e8eaec;
  border-radius: 10px;
}
.con_txt {
  margin-bottom: 20px;
}
.con_img {
  width: 100%;
  position: relative;
  height: auto;
}
.con_img img {
  width: 100%;
}
.t_in {
  text-indent: 32px;
}
</style>