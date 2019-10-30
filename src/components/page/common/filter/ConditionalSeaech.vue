<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6" v-for="(ieo,index) in searchData.searchSelect" :key="index">
        <div class="grid-content bg-purple" v-if="ieo.dataShow">
          <span class="demonstration">{{ieo.title}}</span>
          <el-select class="select_style" v-model="ieo.value" filterable clearable @change="searchEvent" placeholder="请选择">
            <el-option v-for="item in ieo.options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </el-col>
      <el-button class="ax-search" type="primary" @click="searchEvent" icon="el-icon-search">查询</el-button>
    </el-row>
  </div>
</template>
<script>

  export default {
    props: { prop: Object },
    data() {
      return {
        searchData: {},
        params: ""
      }
    },
    computed: {
      changeParams() {
        return this.prop.params;
      }
    },
    watch: {
      changeParams(newValue) {
        if (!newValue) { return; }
        this.params = newValue;
        this.changeSearchData(newValue);
        this.prop.params = "";
      }
    },
    created() {
      this.searchData = this.prop.config.searchData;
      this.initFilterData();
    },
    methods: {
      changeSearchData(data){
        if(!data.searchSelect){return;}
        for (let obj of this.searchData.searchSelect) {
          for (let obj2 of data.searchSelect) {
              if(obj.tableField != obj2.tableField){continue;}
              obj.value = obj2.value;
          }
        }
      },
      initFilterData: async function () {
        for (let obj of this.searchData.searchSelect) {
          if (obj.sourceType && obj.sourceType == "presto" && obj.sql) {
            await this.$requestData('/report/list', 'post', { params: obj.sql }).then(res => {
              if (!res.datas || !res.datas.length) { return; }
              for (let data of res.datas) {
                if (!data.value) { continue; }
                data.label = data.value.replace("H1", "上半年").replace("H2", "下半年");
              }
              obj.options = res.datas;
              if (obj.value) { obj.value = res.datas[0].value; }
            });
            continue;
          }
          await this.$requestData('/report/filter', 'get', { filterName: obj.field, param: obj.param }).then(res => {
            if (!res.datas || !res.datas.length) { return; }
            obj.options = res.datas;
            if (obj.value) { obj.value = res.datas[0].value; }
          });
        }
        this.searchEvent();
      },
      searchEvent() {
        let param = {};
        let concatArr = [];
        concatArr = this.searchData.searchSelect.concat(this.params.searchSelect ? this.params.searchSelect : []);
        let temp = {};   //用于tableField判断重复
        let result = [];  //最后的新数组
        concatArr.map(function (item, index) {
          if (item.tableField && !temp[item.tableField]) {
            result.push(item);
            temp[item.tableField] = true;
          }
        });
        param.searchSelect = result;
        if (this.params.markPointName) {
          param.markPointName = this.params.markPointName;
        }
        this.$parent.$parent.parentSearchEvent(param);
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
    height: 28px;
    width: 78px;
    float: right;
    margin-right: 6px;
  }

  .el-button--small,
  .el-button--small.is-round {
    padding: 7px 15px;
  }

  .select_style /deep/ .el-input--small .el-input__inner {
    height: 28px;
    width: 160px
  }
</style>