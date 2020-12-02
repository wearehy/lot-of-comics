<!--  App.vue  <link rel="icon" href="./vue-cropper/dist/index.js"> -->
<!--
  <cropper :share="shareF" @feedback="feedbackF"></cropper>

  import cropper from "@/components/vueCropper";

  components: { cropper },

  data(){
    return{
      shareF: {
        // 裁剪
        autoCropWidth: 200, //宽
        autoCropHeight: 200, //高
      },
    }
  }

  methods: {
    feedbackF(opt) {
      this.$hyUpload(opt.formData).then((res) => {
        this.form.image = res.file_url + res.filename;
      });
    },
  }
-->

<template>
  <div class="footerBtn" v-if="share">
    <img v-if="attach.laterUrl" style="width:200px;height:200px" />
    <el-button @click="dialogVisible=true" :size="btn.size" type="primary">{{btn.name}}</el-button>
    <!-- 弹出层-裁剪 -->
    <el-dialog
      title="编辑图片"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="600px"
      v-if="dialogVisible"
      append-to-body
    >
      <!-- <div>{{previews.url}}</div> -->
      <span>
        <el-row class="bottom15" style="margin-left: 80px">
          <el-switch v-model="options.autoCrop" active-text="裁剪" inactive-text="原图"></el-switch>
          <label
            class="el-button marginlr15 el-button--primary el-button--small is-round"
            for="uploads"
          >选择</label>
          <el-button class="marginlr15" type="primary" size="small" round @click="cut('blob')">确认</el-button>
          <el-button class="marginlr15" type="primary" size="small" round @click="handleClose">取消</el-button>
          <input
            type="file"
            id="uploads"
            accept="image/png, image/jpeg, image/gif, image/jpg"
            @change="uploadImg($event,1)"
            class="el-button"
            style="margin-bottom:15px;display:none"
          />
        </el-row>

        <el-row>
          <el-row>
            <!-- 裁剪 -->
            <vueCropper
              v-if="options.autoCrop"
              style="width:400px;height:400px;margin-left: calc(50% - 200px);"
              ref="cropper"
              :img="attach.customaryUrl"
              :autoCropWidth="options.autoCropWidth"
              :autoCropHeight="options.autoCropHeight"
              :outputSize="options.outputSize"
              :outputType="options.outputType"
              :info="options.info"
              :centerBox="options.centerBox"
              :canScale="options.canScale"
              :autoCrop="options.autoCrop"
              :fixedBox="options.fixedBox"
              :fixed="options.fixed"
              :fixedNumber="options.fixedNumber"
              :original="options.original"
              :full="options.full"
              :enlarge="options.enlarge"
              :mode="options.mode"
              @realTime="realTime"
            ></vueCropper>
            <vueCropper
              v-if="!options.autoCrop"
              style="width:400px;height:400px;margin-left: calc(50% - 200px);"
              ref="cropper"
              :img="attach.customaryUrl"
              :autoCropWidth="options2.autoCropWidth"
              :autoCropHeight="options2.autoCropHeight"
              :outputSize="options2.outputSize"
              :outputType="options2.outputType"
              :info="options2.info"
              :centerBox="options2.centerBox"
              :canScale="options2.canScale"
              :autoCrop="options2.autoCrop"
              :fixedBox="options2.fixedBox"
              :fixed="options2.fixed"
              :fixedNumber="options2.fixedNumber"
              :original="options2.original"
              :full="options2.full"
              :enlarge="options2.enlarge"
              :mode="options2.mode"
              @realTime="realTime"
            ></vueCropper>
            
          </el-row>
          <template v-if="options.autoCrop">
            <el-row>
              <h2 align="center">预览</h2>
            </el-row>
            <template
              v-if="share.autoCropWidth/share.autoCropHeight <= 1 && share.autoCropWidth <= 250"
            >
              <el-row>
                <el-col :span="24">
                  <div class="show-preview">
                    <div :style="previews.div" class="preview">
                      <img :src="previews.url" :style="[previews.img]" />
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="show-preview">
                    <div :style="previews.div" class="previewRect">
                      <img :src="previews.url" :style="previews.img" />
                    </div>
                  </div>
                </el-col>
              </el-row>
            </template>
            <template
              v-if="share.autoCropWidth/share.autoCropHeight > 1 || share.autoCropWidth > 250"
            >
              <el-row>
                <div class="show-preview">
                  <div :style="previews.div" class="preview">
                    <img :src="previews.url" :style="previews.img" />
                  </div>
                </div>
              </el-row>
              <el-row>
                <div class="show-preview">
                  <div :style="previews.div" class="previewRect">
                    <img :src="previews.url" :style="previews.img" />
                  </div>
                </div>
              </el-row>
            </template>
          </template>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
//数据库里需要存两份图片地址，一张为原图地址，一张为裁剪后的头像地址
export default {
  data() {
    return {
      dialogVisible: false,
      cBool: true,
     
      btn: {
        name: this.share.name || "上传图片",
        size: this.share.size || "mini",
      },
      options: {
        autoCropWidth: this.share.autoCropWidth || 400, //默认生成截图框宽度
        autoCropHeight: this.share.autoCropHeight || 400, //默认生成截图框高度
        info: typeof this.share.info === "boolean" ? this.share.info : true, //显示裁剪框的大小信息
        outputSize: this.share.outputSize || .8, //裁剪生成图片的质量 (0.1 - 1)
        outputType: this.share.outputType || "jpeg", //裁剪生成图片的格式
        centerBox:
          typeof this.share.centerBox === "boolean"
            ? this.share.centerBox
            : false, //截图框是否被限制在图片里面
        canScale:
          typeof this.share.canScale === "boolean" ? this.share.canScale : true, //图片是否允许滚轮缩放
        autoCrop:
          typeof this.share.autoCrop === "boolean" ? this.share.autoCrop : true, // 是否默认生成截图框, 只有自动截图开启 宽度高度才生效
        fixedBox:
          typeof this.share.fixedBox === "boolean"
            ? this.share.fixedBox
            : false, //  固定截图框大小 不允许改变
        fixed: typeof this.share.fixed === "boolean" ? this.share.fixed : true, // 开启宽度和高度比例
        fixedNumber: this.share.fixedNumber || [1, 1], //截图框的宽高比例
        enlarge: this.share.enlarge || '1', //图片根据截图框输出比例倍数
        original:
          typeof this.share.original === "boolean"
            ? this.share.original
            : false, // 上传图片按照原始比例渲染
        full: typeof this.share.full === "boolean" ? this.share.full : false, // 是否输出原图比例的截图

        canMove:
          typeof this.share.canMove === "boolean" ? this.share.canMove : true, //上传图片是否可以移动
        canMoveBox:
          typeof this.share.canMoveBox === "boolean"
            ? this.share.canMoveBox
            : true, //截图框能否拖动
        high: typeof this.share.high === "boolean" ? this.share.high : false, //是否按照设备的dpr 输出等比例图片
        infoTrue:
          typeof this.share.infoTrue === "boolean"
            ? this.share.infoTrue
            : true, //true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        maxImgSize: this.share.maxImgSize || 2000, //限制图片最大宽度和高度

        mode: this.share.mode || "fill", //图片展示方式(fill:宽高取最长设为100%<我的自定义方式>；contain:图片小为原比例，大时宽高取最长设为100%；cover:高度为100%；)
      },
      options2: {
        autoCropWidth: 400, //默认生成截图框宽度
        autoCropHeight: 400, //默认生成截图框高度
        info:  false, //显示裁剪框的大小信息
        outputSize: this.share.outputSize || .8, //裁剪生成图片的质量 (0.1 - 1)
        outputType: this.share.outputType || "jpeg", //裁剪生成图片的格式
        centerBox: false, //截图框是否被限制在图片里面
        canScale:false, //图片是否允许滚轮缩放
        autoCrop: false, // 是否默认生成截图框, 只有自动截图开启 宽度高度才生效
        fixedBox: false, //  固定截图框大小 不允许改变
        fixed:  true, // 开启宽度和高度比例
        fixedNumber: this.share.fixedNumber || [1, 1], //截图框的宽高比例
        enlarge: this.share.enlarge || 5, //图片根据截图框输出比例倍数
        original: true, // 上传图片按照原始比例渲染
        full:  true, // 是否输出原图比例的截图

        canMove: true, //上传图片是否可以移动
        canMoveBox: true, //截图框能否拖动
        high: typeof this.share.high === "boolean" ? this.share.high : false, //是否按照设备的dpr 输出等比例图片
        infoTrue: true, //true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        maxImgSize: this.share.maxImgSize || 2000, //限制图片最大宽度和高度

        mode:  "contain", //图片展示方式(fill:宽高取最长设为100%<我的自定义方式>；contain:图片小为原比例，大时宽高取最长设为100%；cover:高度为100%；)
      },

      previews: {}, //实时预览图数据
      attach: {
        //后端附件表
        id: "",
        userId: "",
        customaryUrl: "", //原图片路径
        laterUrl: "", //裁剪后图片路径  /static/logo.png
        attachType: "photo", //附件类型
      },
      fileName: "", //本机文件地址
      uploadImgRelaPath: "", //上传后图片地址
    };
  },
  watch: {
    "options.autoCrop": {
      handler: function () {
        this.cBool = false;
        setTimeout(() => {
          this.cBool = true;
        }, 10);
      },
    },
  },
  props: ["share","differ"],
  methods: {
    //控制弹出层关闭
    handleClose() {
      this.dialogVisible = false;
    },
    //实时预览
    realTime(data) {
      this.previews = data;
    },
    //加载头像信息
    find() {
      this.userId = sessionStorage.getItem("userId");
      // this.$axios.post("/api/attach/find", this.attach).then(res => {
      //   console.log(res);
      // });
    },
    //选择本地图片
    uploadImg(e, num) {
      var file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$message.error("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      //console.log(e.target.result);
      //fileReader 接口，用于异步读取文件数据
      var reader = new FileReader();
      reader.readAsDataURL(file); //重要 以dataURL形式读取文件
      reader.onload = (e) => {
        // data = window.URL.createObjectURL(new Blob([e.target.result])) 转化为blob格式

        let data = e.target.result;

        this.attach.customaryUrl = data;
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
      };
    },
    //确认截图,上传
    cut(type) {
      var formData = new FormData();
      this.$refs.cropper.getCropBlob((res) => {
        //res是裁剪后图片的bolb对象
        formData.append("file", res);
        formData.append("type",this.share.type)
        // console.log('裁剪',formData);
        var list = {
          formData: formData,
          url: this.previews.url,
        };
     
        if(this.differ){
          list.differ = this.differ
        }
        this.num && (list.num = this.num);

        if (res.size < 204800) {
          this.$emit("feedback", list);
          // this.$message.success("获取图片成功");
        } else {
          this.$message.error("图片不得大于2MB");
        }

        // this.$hyUpload(formData).then( res => {
        //   console.log(11111111,res)
        // });
        this.handleClose();
      });
    },
  },

  computed: {
    ...mapGetters(["imagesUploadApi"]),
  },
  mounted() {},
};
</script>

<style scoped>
/* 弹性布局 水平居中 */
.show-preview {
  display: flex;
  justify-content: center;
}

.preview {
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #cccccc;
  background: #cccccc;
}
.previewRect {
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #cccccc;
  background: #cccccc;
}
.footerBtn {
  /* display: flex;
  justify-content: start;
  margin-top: 15px; */
}
</style>
<style>
</style>
