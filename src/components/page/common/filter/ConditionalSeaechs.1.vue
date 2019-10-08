
<!-- <template>
    <div style="position: absolute;left: 20%;top:15px">
      <el-row :gutter="8">
        <el-col :span="3" v-for="(ieo,index) in searchData.searchSelect">
            <div class="grid-content bg-purple" v-if="ieo.dataShow">
              <div class="block">
                <span class="demonstration">{{ieo.title}}</span>
                <el-date-picker v-model="ieo.beginDate" :type='ieo.beginDateType' placeholder="选择日期" />
              </div>
            </div>
          </el-col>
        <el-col :span="3" v-for="(ieo,index) in searchData.seachSelect" :key="index">
          <div class="grid-content bg-purple" v-if="ieo.dataShow">
            <span class="demonstration">{{ieo.title}}</span>
            <el-select v-model="ieo.value" filterable clearable @change="searchEvent" placeholder="请选择">
              <el-option v-for="item in ieo.options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </el-col>
        <el-button class="ax-search" type="primary" @click="searchEvent" icon="el-icon-search">搜索</el-button>
      </el-row>
    </div>
  </template>
  <script>
    import { requestData } from '@/api/RequestData';
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
          this.prop.params = "";
        }
      },
      created() {
        this.searchData = this.prop.config.searchData;
        this.initFilterData();
      },
      methods: {
        initFilterData: async function () {
          for (let obj of this.searchData.seachSelect) {
            if (obj.sourceType && obj.sourceType == "presto" && obj.sql) {
              await requestData('/report/list', 'post', { params: obj.sql }).then(res => {
                if (!res.datas || !res.datas.length) { return; }
                obj.options = res.datas;
                if (obj.value) { obj.value = res.datas[0].value; }
              });
              continue;
            }
            await requestData('/report/filter', 'get', { filterName: obj.field, param: obj.param }).then(res => {
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
          concatArr = this.searchData.seachSelect.concat(this.params.seachSelect ? this.params.seachSelect : []);
          let temp = {};   //用于tableField判断重复
          let result = [];  //最后的新数组
          concatArr.map(function (item, index) {
            if (item.tableField && !temp[item.tableField]) {
              result.push(item);
              temp[item.tableField] = true;
            }
          });
          param.seachSelect = result;
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
      /* float: right; */
      margin-right: 6px;
      /* margin-top: 39px; */
    }
  </style> -->