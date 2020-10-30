<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        style="margin-top: 6px;"
        size="small"
        label-width="100px"
        class="demo-ruleForm"
        v-if="form.mailCommodity"
      >
        <div class="pageTitle">提交信息</div>
        <el-form-item label="商品名" prop="mailCommodity.name">
          <el-input v-model="form.mailCommodity.name" class="widthP40" />
        </el-form-item>
        <el-form-item label="商品卖点">
          <el-input v-model="form.mailCommodity.sellingPoint" class="widthP40" />
        </el-form-item>
        <el-form-item label="分享描述">
          <el-input v-model="form.mailCommodity.shareDesc" class="widthP40" />
        </el-form-item>
        <el-form-item label="商品图" prop="mailCommodity.images">
          <p class="cRed">*第一张图片作为展示图片 (建议尺寸：800x800)</p>
          <ul class="overflow">
            <li
              class="lft overflow img108 relative"
              style="margin-right:1px;margin-bottom:1px"
              v-for="(item,index) in form.mailCommodity.images"
              :key="index"
            >
              <div class="whP100 absolute flex flexC z991 imgHover">
                <i
                  class="el-icon-delete-solid cRed fs24 z992 imgcHover pointer"
                  @click="imgDel(index)"
                ></i>
              </div>
              <el-image :src="item" class="whP100 imgBorder" fit="cover" alt></el-image>
            </li>
          </ul>
          <p class="top5">
            <cropper :share="shareF" @feedback="feedbackF"></cropper>
          </p>
        </el-form-item>
        <el-form-item label="主要视频">
          <div class="pic_img">
            <div class="pic_img_box">
              <el-upload
                :headers="myHeaders"
                class="avatar-uploader"
                :action="this.baseApi + '/upload'"
                v-bind:data="{FoldPath:'上传目录',SecretKey:'安全验证'}"
                v-bind:on-progress="uploadVideoProcess"
                v-bind:on-success="handleVideoSuccess"
                v-bind:before-upload="beforeUploadVideo"
                v-bind:show-file-list="false"
              >
                <video
                  style="max-height: 500px"
                  v-if="form.mailCommodity.video && !videoFlag"
                  v-bind:src="form.mailCommodity.video"
                  class="avatar video-avatar"
                  controls="controls"
                >您的浏览器不支持视频播放</video>
                <el-button type="primary" v-if="!form.mailCommodity.video  && !videoFlag">添加视频</el-button>
                <p v-if="!(!form.mailCommodity.video && !videoFlag)">
                  <el-button type="primary">重新上传</el-button>
                  <span class="inline-block pad5"></span>
                  <el-button
                    type="danger"
                    @click.stop="form.mailCommodity.video = null"
                    style="z-index:99999"
                  >删除视频</el-button>
                </p>
                <el-progress
                  v-if="videoFlag == true"
                  type="circle"
                  v-bind:percentage="videoUploadPercent"
                  style="margin-top:7px;"
                ></el-progress>
              </el-upload>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="商品品类" v-if="selects" prop="mailCommodity.commodityCategory">
          <el-select v-model="form.mailCommodity.commodityCategory" placeholder="请选择">
            <el-option
              v-for="item in selects.category"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
              :disabled="item.isDisplay != 0"
            ></el-option>
          </el-select>
          <el-button
            :disabled="$permissionButton('/mail/category/all')"
            class="mL10"
            type="primary"
            @click="categoryGo"
          >修改品类</el-button>
        </el-form-item>
        <el-form-item label="商品分组" prop="mailCommodity.commodityGroup">
          <el-select v-model="form.mailCommodity.commodityGroup" placeholder="请选择">
            <el-option
              v-for="item in selects.group"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
              :disabled="item.isDisplay != 0"
            ></el-option>
          </el-select>
          <el-button
            :disabled="$permissionButton('/mail/commodity/group/all')"
            class="mL10"
            type="primary"
            @click="groupGo"
          >修改分组</el-button>
        </el-form-item>

        <div class="pageTitle">商品规格</div>
        <el-form-item label="商品规格" prop="mailCommodityPrice">
          <ul>
            <li
              v-for="(item,index) in form.mailCommodityPrice"
              :key="index"
              class="lft bottom5 mR10"
            >
              <el-row class="bottom5">
                <el-input v-model="item.specsName" class="inputW" size="mini" placeholder="请输入规格"></el-input>
              </el-row>
              <el-row class="flex bottom5">
                <el-image :src="item.specsImage" fit="cover" class="img80"></el-image>
                <div class="img80 inline-flex flexC">
                  <i
                    class="el-icon-delete-solid cRed fs24 z992 imgcHover pointer"
                    @click="sizeDel(index)"
                  ></i>
                </div>
              </el-row>
              <cropper
                :share="sizeShareF"
                @feedback="sizeFeedbackF"
                v-on:click.native="sizeImg(index)"
              ></cropper>
            </li>
            <li class="lft">
              <el-button type="primary" size="mini" @click="addSize()">添加规格</el-button>
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="规格明细" required>
          <el-table :data="form.mailCommodityPrice" style="width:100%">
            <el-table-column prop="specsName" label="名字" :render-header="renderHeader" width></el-table-column>
            <el-table-column prop="price" label="价格（元）" :render-header="renderHeader" width>
              <template slot-scope="scope">
                <el-input v-model="scope.row.price" />
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="库存" :render-header="renderHeader" width>
              <template slot-scope="scope">
                <el-input v-model="scope.row.stock" />
              </template>
            </el-table-column>
            <el-table-column prop="weight" label="重量" width>
              <template slot-scope="scope">
                <el-input v-model="scope.row.weight" />
              </template>
            </el-table-column>
            <el-table-column prop="specsCode" label="规格编码" width>
              <template slot-scope="scope">
                <el-input v-model="scope.row.specsCode" />
              </template>
            </el-table-column>
            <el-table-column prop="integral" label="孝心值" width>
              <template slot-scope="scope">
                <el-input v-model="scope.row.integral" />
              </template>
            </el-table-column>
            <el-table-column prop="isDisplay" label="显示隐藏" width>
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.isDisplay"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <div class="pageTitle">物流信息</div>
        <el-form-item
          label="快递运费"
          :prop="form.mailCommodity.freightType == 1?'mailCommodity.freightPrice':'mailCommodity.freightTypeGuid'"
        >
          <el-radio-group v-model="form.mailCommodity.freightType" @change="freightChange">
            <el-row class="bottom5">
              <el-radio :label="1">
                1 统一邮费
                <span>（元）</span>
              </el-radio>
              <el-input
                v-model="form.mailCommodity.freightPrice"
                class="inputW"
                placeholder="输入邮费"
                :disabled="form.mailCommodity.freightType != 1"
              />
            </el-row>
            <el-row>
              <el-radio :label="2">
                2 邮费模板
                <span style="visibility:hidden">（元）</span>
              </el-radio>

              <el-select
                v-model="form.mailCommodity.freightTypeGuid"
                placeholder="请选择"
                class="inputW"
                :disabled="form.mailCommodity.freightType != 2"
              >
                <el-option
                  v-for="item in expressTemplates"
                  :key="item.freightTypeGuid"
                  :label="item.name"
                  :value="item.freightTypeGuid"
                  :disabled="item.isDisplay != 0"
                ></el-option>
              </el-select>

              <el-button
                :disabled="$permissionButton('/mail/freight/all')"
                class="mL10"
                type="primary"
                @click="freightGo"
              >修改邮费模板</el-button>
            </el-row>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="富文本">
          <el-button
            class="bottom5"
            type="primary"
            @click="fwbBool = !fwbBool"
          >{{fwbBool?'关闭富文本':'查看富文本'}}</el-button>
          <quill-editor
            v-if="fwbBool"
            v-model="form.mailCommodity.commodityInfo"
            ref="myQuillEditor"
            :options="editorOption"
          />
        </el-form-item>
        <el-form-item label class="top50">
          <el-button
            style="margin-left:0"
            class="filter-item mR15"
            size="mini"
            @click="closeFun()"
          >取消</el-button>
          <el-button
            :disabled="guid?$permissionButton('/mail/commodity/update'):$permissionButton('/mail/commodity/add')"
            style="margin-left:0"
            class="filter-item"
            size="mini"
            type="primary"
            @click="save('form')"
          >保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import {
  commodityInfo,
  categoryGet,
  commodityGroupGet,
  freightGet,
  commodityUpdate,
  commodityAdd,
} from "@/api/shopping/manage.js";

import cropper from "@/components/vueCropper";
import { mapGetters } from "vuex";

// 富文本
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor, Quill } from "vue-quill-editor";
import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";
Quill.register("modules/ImageExtend", ImageExtend);

const mailCommodity = {
  name: "", //商品名
  shareDesc: "", //分享描述
  commodityCategory: "", //商品分类
  commodityGroup: "", //商品分组
  freightType: 1, //邮费类型 1 统一邮费 2 邮费模板
  freightPrice: 0, //邮费价格
  freightTypeGuid: "", //邮费模板的Guid
  sellingPoint: "", //卖点
  images: [], //商品的图片
  video: null, //商品的视频
  sort: null,
  commodityInfo: "", //商品的详情
};

export default {
  name: "manage_child",
  data() {
    return {
      myHeaders: {
        Authorization: getToken(),
      },
      form: {
        mailCommodity: null,
        mailCommodityPrice: null,
      },

      rules: {
        "mailCommodity.name": [
          { required: true, message: "请输入商品名！", trigger: "blur" },
        ],
        "mailCommodity.images": [
          { required: true, message: "请传入商品图！", trigger: "blur" },
        ],
        "mailCommodity.commodityCategory": [
          { required: true, message: "请选择商品品类！", trigger: "blur" },
        ],
        "mailCommodity.commodityGroup": [
          { required: true, message: "请选择商品分组！", trigger: "blur" },
        ],
        mailCommodityPrice: [
          { required: true, message: "请添加商品规格！", trigger: "blur" },
        ],
        "mailCommodity.freightPrice": [
          { required: true, message: "请输入邮费！", trigger: "blur" },
        ],
        "mailCommodity.freightTypeGuid": [
          { required: true, message: "请选择邮费模板！", trigger: "blur" },
        ],
      },
      shareF: {
        // 裁剪
      
      },
      sizeShareF: {
        // 裁剪
      
      },
      sizeNum: 0, //商品规格下标
      cropperVal: null, //vueCropper 反馈
      formMovie: {
        posterURL: "",
      },

      videoFlag: false,
      //是否显示进度条
      videoUploadPercent: "",
      //进度条的进度，
      isShowUploadVideo: false,
      //显示上传按钮
      videoForm: {
        showVideoPath: "",
      },
      selects: {
        category: [],
        group: [],
      },

      expressPrice: 0, //统一邮费
      expressTemplates: [], //邮费模板

      //富文本
      fwbBool: false,
      editorOption: {},
    };
  },
  watch: {
    guid(val) {
      this.load();
    },
  },
  created() {
    this.load();
    this.loads();
  },
  props: ["guid"],
  computed: {
    ...mapGetters(["baseApi"]),
  },
  components: { cropper, quillEditor },
  methods: {
    load() {
      this.guid
        ? this.commodityInfoFun()
        : ((this.form.mailCommodity = mailCommodity),
          (this.form.mailCommodityPrice = []));
      console.log(this.form);
    },
    commodityInfoFun() {
      commodityInfo({ guid: this.guid }).then((res) => {
        // this.form = res;
        this.form.mailCommodity = res.mailCommodity;
        this.form.mailCommodityPrice = res.mailCommodityPrice;
        res.mailCommodity.video &&
          (this.videoForm.showVideoPath = res.mailCommodity.video);

        this.form.mailCommodityPrice.map((item) => {
          item.price = (item.price / 100).toFixed(2);
        });
        this.form.mailCommodity.freightPrice = (
          this.form.mailCommodity.freightPrice / 100
        ).toFixed(2);
      });
    },

    loads() {
      categoryGet().then((res) => {
        this.selects.category = res;
      });
      commodityGroupGet().then((res) => {
        this.selects.group = res;
      });
      freightGet().then((res) => {
        this.expressTemplates = res;
        // this.form.mailCommodity.freightTypeGuid = res[0].freightTypeGuid;
      });
    },
    childFun2(data) {
      let that = this;
      that.child_val = data.pic_url;
    },
    // 商品图 裁剪
    feedbackF(opt) {
      // this.form.mailCommodity.images.push(opt.url);
      this.$hyUpload(opt.formData).then((res) => {
        this.form.mailCommodity.images.push(res.file_url + res.filename);
      });
    },
    // 规格图裁剪
    sizeFeedbackF(opt) {
      // this.form.mailCommodityPrice[num].specsImage = opt.url;
      this.$hyUpload(opt.formData).then((res) => {
        this.form.mailCommodityPrice[this.sizeNum].specsImage =
          res.file_url + res.filename;
      });
    },
    imgPreview(file, fileList) {
      let fileName = file.name;
      let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
      if (regex.test(fileName.toLowerCase())) {
        this.formMovie.posterURL = file.file_url + file.filename;
      } else {
        this.$message.error("请选择图片文件");
      }
    },
    //上传前回调
    beforeUploadVideo(file) {
      var fileSize = file.size / 1024 / 1024 < 50;
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb",
          "video/mov",
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!fileSize) {
        this.$message.error("视频大小不能超过50MB");
        return false;
      }
      this.isShowUploadVideo = false;
    },
    //进度条
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0) * 1;
    },
    //上传成功回调
    handleVideoSuccess(res, file) {
      this.isShowUploadVideo = true;
      this.videoFlag = false;
      this.videoUploadPercent = 0;

      //前台上传地址
      if (file.status == "success") {
        this.videoForm.showVideoPath = file.url;
      } else {
        this.$message("上传失败，请重新上传");
      }

      //后台上传地址
      if (res.code == 200) {
        this.videoForm.showVideoPath = res.data.file_url + res.data.filename;
        this.form.mailCommodity.video = res.data.file_url + res.data.filename;
      } else {
        this.$message.error(res.message);
      }
    },
    imgDel(num) {
      this.form.mailCommodity.images.splice(num, 1);
    },
    //改变邮费
    freightChange() {
      if (this.form.mailCommodity.freightType == 1) {
        this.form.mailCommodity.freightTypeGuid = null;
      } else {
        this.form.mailCommodity.freightPrice = null;
      }
    },
    addSize() {
      this.form.mailCommodityPrice.push({
        commodityGuid: null,
        weight: 0,
        price: 0,
        integral: 0,
        stock: 0,
        costPrice: 0,
        specsCode: null,
        specsName: null,
        sort: 0,
        createTime: null,
        isDisplay: 0,
        specsImage: null,
        images: [],
      });
      console.log(this.form.mailCommodityPrice);
    },
    sizeDel(index) {
      this.form.mailCommodityPrice.splice(index, 1);
    },
    sizeImg(index) {
      console.log(index);
      this.sizeNum = index;
    },
    save(form) {
      let sizeListBool = false;
      let data = {
        mailCommodity: JSON.parse(JSON.stringify(this.form.mailCommodity)),
        mailCommodityPrice: JSON.parse(
          JSON.stringify(this.form.mailCommodityPrice)
        ),
      };
      this.form.mailCommodityPrice.map((item) => {
        !item.specsName ? (sizeListBool = true) : (sizeListBool = false);
      });

      data.mailCommodityPrice.map((item) => {
        item.price = item.price * 100;
      });
      data.mailCommodity.freightPrice = data.mailCommodity.freightPrice * 100;
      console.log(data.mailCommodity);
      // if (!data.mailCommodity.name) {
      //   this.$message.error("商品名不能为空");
      // } else if (data.mailCommodity.images.length == 0) {
      //   this.$message.error("商品图不能为空");
      // } else if (!data.mailCommodity.commodityCategory) {
      //   this.$message.error("商品品类不能为空");
      // } else if (!data.mailCommodity.commodityGroup) {
      //   this.$message.error("商品分组不能为空");
      // } else if (data.mailCommodityPrice.length == 0 || sizeListBool) {
      //   this.$message.error("商品规格不能为空");
      // } else if (
      //   data.mailCommodity.freightPrice == null &&
      //   !data.mailCommodity.freightTypeGuid
      // ) {
      //   console.log(
      //     data.mailCommodity.freightPrice == null,
      //     !data.mailCommodity.freightTypeGuid
      //   );
      //   this.$message.error("商品快递不能为空");
      // } else {
      //   this.guid
      //     ? this.$refs[form].validate(valid => {
      //         if (valid) {
      //           commodityUpdate(data).then(res => {
      //             this.closeFun();
      //           });
      //         } else {
      //           console.log("error submit!!");
      //           return false;
      //         }
      //       })
      //     : this.$refs[formName].validate(valid => {
      //         if (valid) {
      //           commodityAdd(data).then(res => {
      //             this.closeFun;
      //           });
      //         } else {
      //           console.log("error submit!!");
      //           return false;
      //         }
      //       });
      // }
      this.guid
        ? this.$refs[form].validate((valid) => {
            if (valid) {
              commodityUpdate(data).then((res) => {
                this.$notify({
                  title: "修改成功",
                  type: "success",
                  duration: 1500,
                });
                this.closeFun();
              });
            } else {
              console.log("error submit!!");
              return false;
            }
          })
        : this.$refs[form].validate((valid) => {
            if (valid) {
              commodityAdd(data).then((res) => {
                this.$notify({
                  title: "添加成功",
                  type: "success",
                  duration: 1500,
                });
                this.closeFun();
              });
            } else {
              console.log("error submit!!");
              return false;
            }
          });
    },
    closeFun() {
      this.$emit("close", true);
    },
    goNext() {},
    goTemplate() {
      //查看所有模板
    },
    categoryGo() {
      this.$router.push("/shopping/category");
    },
    groupGo() {
      this.$router.push("/shopping/group");
    },
    freightGo() {
      this.$router.push("/shopping/freight");
    },
    renderHeader(h, { column }) {
      // h即为cerateElement的简写，具体可看vue官方文档
      return h("div", [
        h(
          "i",
          {
            style: "color:red;font-size:14px;margin-right:4px",
          },
          "*"
        ),
        h("span", column.label),
      ]);
    },
  },
  mounted() {
    //设置上传图片的地址

    this.editorOption = {
      modules: {
        ImageExtend: {
          loading: true,
          name: "file",
          headers: (xhr) => {
            xhr.setRequestHeader("authorization", getToken());
          },
          action: this.baseApi + "/upload",
          response: (res) => {
            if (res.code == 200) {
              this.$message.success("上传成功！");
              return res.data.file_url + res.data.filename;
            } else {
              this.$message.error("上传失败！");
            }
          },
          error: () => {
            console.log("error");
          }, // 可选参数 上传失败触发的事件
          success: () => {
            console.log("success");
          }, // 可选参数  上传成功触发的事件
        },
        toolbar: {
          container: container,
          handlers: {
            image: function () {
              QuillWatch.emit(this.quill.id);
            },
          },
        },
      },
    };
  },
};
</script>

<style scopde>
.imgHover .imgcHover {
  display: none;
}
.imgHover:hover .imgcHover {
  display: block;
}
</style>