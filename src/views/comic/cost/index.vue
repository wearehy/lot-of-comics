<template>
  <el-tabs type="border-card">
    <el-tab-pane>
      <span slot="label"><i class="el-icon-setting"></i> 系统设置</span>
      <el-form
        ref="form"
        :rules="rules"
        v-permission="['btn:comic-admin:price:GET']"
        :model="form"
        style="margin-top: 6px"
        size="small"
        label-width="150px"
      >
        <el-form-item label="收费章节费用（元）" prop="price">
          <el-input-number v-model="form.price" style="width: 200px" />
          <!-- <span style="color: #c0c0c0; margin-left: 10px"></span> -->
        </el-form-item>
        <el-form-item label="">
          <el-button
            :disabled="$permissionButton('btn:comic-admin:price:PUT')"
            size="medium"
            type="primary"
            @click="mainEdit"
            >保存</el-button
          >
          <el-button
            :disabled="$permissionButton('btn:comic-admin:price:GET')"
            size="medium"
            type="warning"
            @click="mainList()"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { list, edit } from "@/api/comic/cost";

export default {
  name: "cost",
  data() {
    return {
      form: {
        price: 0,
      },
      rules: {
        price: [
          { required: true, message: "请输入收费章节费用", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.mainList();
  },
  methods: {
    mainList() {
      list().then((res) => {
        this.form.price =  res;
      });
    },
    mainEdit() {
        var formData = new FormData();
        formData.append('price',this.form.price);
        edit(formData).then((res) => {})
   
    },
  },
};
</script>

<style scoped>
</style>
