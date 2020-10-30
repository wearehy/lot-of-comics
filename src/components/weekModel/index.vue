<template>
  <div>
    <el-input v-model="week" placeholder="请选择" class="bottom10"></el-input>
    <ul>
      <li v-for="num of 40" class="lft  pointer overflow" @click="week = (num - 1);$emit('weekNum',week)" :key="num">
        <div v-if="week == num - 1" class=" weekActive weekBtn imgBorder">{{num - 1}}</div>
        <div v-else class="imgColor weekBtn imgBorder">{{num - 1}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "weekModel",
  data() {
    return {
      week: null,
    };
  },
  methods:{
    
  }
};
</script>

<style scoped>
.weekBtn {
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  margin: 5px;
  border-radius: 4px;
}
.weekActive,.imgColor:hover{
  color: #409eff;
  border-color: #409eff;
}
</style>