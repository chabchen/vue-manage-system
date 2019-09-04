<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <div class="block">
            <span class="demonstration">开始日期</span>
            <el-date-picker v-model="searchData.beginDate" type="date" placeholder="选择日期" />
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <div class="block">
            <span class="demonstration">结束日期</span>
            <el-date-picker v-model="searchData.endDate" type="date" placeholder="选择日期" />
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <span class="demonstration">大区</span>
          <el-select v-model="searchData.bigAreaName" placeholder="请选择">
            <el-option v-for="item in searchData.bigAreas" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <span class="demonstration">区域</span>
          <el-select v-model="searchData.regionName" placeholder="请选择">
            <el-option v-for="item in searchData.regions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <span class="demonstration">地区</span>
          <el-select v-model="searchData.cityName" placeholder="请选择">
            <el-option v-for="item in searchData.cities" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <span class="demonstration">牧场</span>
          <el-select v-model="searchData.pasture" placeholder="请选择">
            <el-option v-for="item in searchData.pastures" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <span class="demonstration">疾病类型</span>
          <el-select v-model="searchData.diseaseType" placeholder="请选择">
            <el-option v-for="item in searchData.diseaseTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <span class="demonstration">牛只类别</span>
          <el-select v-model="searchData.cowCategory" placeholder="请选择">
            <el-option v-for="item in searchData.cowCategorys" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <span class="demonstration">胎次类别</span>
          <el-select v-model="searchData.fetusCategory" placeholder="请选择">
            <el-option v-for="item in searchData.fetusCategorys" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <span class="demonstration">泌乳天数</span>
          <el-select v-model="searchData.lactationTimes" placeholder="请选择">
            <el-option v-for="item in searchData.lactations" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </el-col>
      <el-button class="ax-search" type="primary" @click="searchEvent" icon="el-icon-search">搜索</el-button>
    </el-row>
  </div>
</template>
<script>
  export default {
    props: { prop: Object},
    data() {
      return {
        pickerOptions: {
          disabledDate(time) { return time.getTime() > Date.now(); }
        },
        searchData: {},
      }
    },
    created() {
      this.searchData = this.prop.config.searchData;
    },
    methods: {
      searchEvent() {        
        this.$parent.$parent.parentSearchEvent(this.searchData);        
      }
    }
  }

  
</script>
<style scoped>
  .el-row {
    margin-bottom: 20px;
  }

  .el-col {
    border-radius: 4px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
  }

  .block .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }

  .demonstration {
    line-height: 40px
  }

  .ax-search {
    float: right;
    margin-right: 6px;
    margin-top: 39px;
  }
</style>