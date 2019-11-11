<template>
    <div class="inline_block" :style="{width:searchData.conditionWidth}" v-loading="loading">
        <div class="inline_block ml_25" v-for="(ieo,index) in searchData.searchDate" :key="index">
            <div class="grid-content bg-purple" v-if="ieo.dataShow">
                <div class="block">
                    <div class="demonstration">{{ieo.title}}</div>
                    <el-date-picker class="rangeDate" v-model="ieo.value" :type="ieo.dateType" :format="ieo.showFormat" :value-format="ieo.valueFormat"
                        range-separator="至" start-placeholder="开始" end-placeholder="结束" placeholder="选择日期" :style="{width:ieo.dateType == 'date' || ieo.dateType == 'month' ? '158px' : '220px' }"
                    />
                </div>
            </div>
        </div>
        <div class="inline_block ml_25" v-for="(item,index) in data" :key="index+10">
            <div class="grid-content bg-purple" v-if="item.dataShow">
                <div class="block">
                    <div class="demonstration">{{item.title}}</div>
                    <async-load-comp :app="appUrl" :prop="{searchDatas:searchData.searchSelect,data:item,dataFlag:dataFlag,currentcomp:currentcomp}" />
                </div>
            </div>
        </div>
        <div class="inline_block" :style="{width:searchData.divWidth}"></div>
        <div class="inline_block select_posion" v-if="!searchData.hideSearchBtn">
            <el-button class="ax-search" type="primary" @click="searchEvent" icon="el-icon-search">查询</el-button>
        </div>
    </div>
</template>

<script>
    import filterSelect from './filter-select.vue'
    import asyncLoadComp from '../asyncLoadComp.vue'
    import { requestData } from '@/api/RequestData';
    export default {
        components: { asyncLoadComp },
        props: { prop: Object },
        data() {
            return {
                loading: true,
                currentcomp: "",
                dataFlag: false,
                appUrl: "",
                searchData: {},
                data: [],
                params: "",
                radioFlag: false,
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
                this.changeRadio(newValue);
                this.prop.params = "";
            }
        },
        created() {
            this.searchData = this.prop.config.searchData;
            this.initFilterData();
        },
        methods: {
            getPatrams(condition, data) {
                if (Array.isArray(data.value)) {
                    let inValue = " ('" + data.value.join("','") + "') ";;
                    condition += " and " + data.tableField + " in " + inValue;
                } else {
                    condition += " and " + data.tableField + " = '" + data.value + "' ";
                }
                return condition;
            },
            parentSearchEvent(param) {
                for (let obj of this.data) {
                    if (!obj.sql || !obj.url || !obj.relationField) { continue; }
                    if (param.field == obj.field) { continue; }
                    if (param.relationField && param.relationField.indexOf(obj.field) > -1) { continue; }
                    this.currentcomp = param.field+","+param.relationField; 
                    let condition = "";
                    if (param.value && param.value.length) {
                        condition += this.getPatrams(condition, param);
                    } else {
                        for (let obj2 of this.data) {
                            if (!obj2.value || !obj2.value.length || obj.relationField.indexOf(obj2.field) == -1) { continue;}
                            if (obj2.field == obj.field) { continue; }
                            condition += this.getPatrams(condition, obj2);
                        }
                    }
                    obj.value = "";
                    let str = obj.sql.split("1=1");
                    let sql = str[0] + "1=1 " + condition + str[1];
                    this.dataFlag = !this.dataFlag;
                    requestData(obj.url, 'post', { params: sql }).then(res => {
                        if (!res.datas || !res.datas.length) { return; }
                        let options = [];
                        for (let data of res.datas) {
                            if (!data || !data.VAL) { continue; }
                            options.push({ label: data.VAL, value: data.VAL });
                        }
                        obj.options = options;
                        this.dataFlag = !this.dataFlag;
                    });
                }
                
            },
            //切换维度触发方法
            changeRadio(params) {
                for (let obj of params.searchSelect) {
                    if (obj.tableField != "reportType") { continue; }
                    if (obj.value == "月报") {
                        for (let item of this.searchData.searchDate) {
                            item.dateType = item.dateType == 'date' ? 'month' : 'monthrange';
                            item.showFormat = 'yyyy-MM'
                            item.valueFormat = 'yyyyMM'
                        }
                    }
                    if (obj.value == "日报") {
                        for (let item of this.searchData.searchDate) {
                            item.dateType = item.dateType == 'month' ? 'date' : 'daterange';
                            item.showFormat = 'yyyy-MM-dd'
                            item.valueFormat = 'yyyyMMdd'
                        }
                    }
                    if (obj.value == "年报") {
                        for (let item of this.searchData.searchDate) {
                            item.dateType = 'year';
                            item.showFormat = 'yyyy'
                            item.valueFormat = 'yyyy'
                        }
                    }
                }
            },
            initFilterData: async function () {
                this.initDate();
                for (let obj of this.searchData.searchSelect) {
                    if (!obj.sql || !obj.url) {
                        if (obj.value && obj.options.length) { obj.value = obj.options[0].value; }
                        continue;
                    }
                    await requestData(obj.url, 'post', { params: obj.sql }).then(res => {
                        if (!res.datas || !res.datas.length) { return; }
                        let options = [];
                        for (let data of res.datas) {
                            if (!data || !data.VAL) { continue; }
                            options.push({ label: data.VAL, value: data.VAL });
                        }
                        obj.options = options;
                        if (obj.value.length) { obj.value = res.datas[0].VAL; }
                    });
                }
                
                this.loading = false;
                //通过懒加载加载组件
                this.data = this.searchData.searchSelect;
                this.appUrl = "filter/filter-select";
                if(!this.searchData.hideSearchBtn){
                    this.searchEvent();
                }
                
            },
            searchEvent() {
                let param = {};
                let searchSelect = this.concatParams(this.searchData.searchSelect, this.params.searchSelect);
                let searchDate = this.concatParams(this.searchData.searchDate, this.params.searchDate);
                param.searchSelect = searchSelect;
                param.searchDate = searchDate;
                this.$parent.$parent.parentSearchEvent(param);
            },
            concatParams(sourceParams, targetParams) {
                if (!sourceParams) { return; }
                let concatArr = [];
                concatArr = sourceParams.concat(targetParams ? targetParams : []);
                let temp = {};   //用于tableField判断重复
                let result = [];  //最后的新数组
                concatArr.map(function (item, index) {
                    if (item.tableField && !temp[item.tableField]) {
                        result.push(item);
                        temp[item.tableField] = true;
                    }
                });
                return result;
            },
            //初始化设置时间
            initDate() {
                let now = new Date();
                let nowYear = now.getMonth() == 0 ? now.getFullYear() - 1 : now.getFullYear();
                if (!this.searchData.searchDate) { return; }
                for (let obj of this.searchData.searchDate) {
                    if (obj.dateType == "date" || obj.dateType == "daterange") {
                        let date = new Date(now.getTime() - 86400000);//减去一天获取前一天日期
                        let nowMonth = date.getMonth() + 1;
                        let nowDay = date.getDate();
                        nowMonth = nowMonth < 10 ? '0' + nowMonth : nowMonth;
                        nowDay = nowDay < 10 ? '0' + nowDay : nowDay;
                        if (obj.dateType == "date") { obj.value = nowYear + "" + nowMonth + "" + nowDay; continue; }
                        obj.value = [nowYear + "" + nowMonth + "" + nowDay, nowYear + "" + nowMonth + "" + nowDay];
                    }
                    if (obj.dateType == "month" || obj.dateType == "monthrange") {
                        let nowMonth = now.getMonth() == 0 ? 12 : now.getMonth();
                        nowYear = now.getMonth() == 0 ? nowYear - 1 : nowYear;
                        nowMonth = nowMonth < 10 ? '0' + nowMonth : nowMonth;
                        if (obj.dateType == "month") { obj.value = nowYear + "" + nowMonth; continue; }
                        obj.value = [nowYear + "" + nowMonth, nowYear + "" + nowMonth];
                    }
                    if(obj.dateType == "year"){
                        obj.value = [now.getFullYear() - 1,now.getFullYear() - 1];
                    }
                }
            },
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
    }

    .inline_block {
        display: inline-block;
    }

    .ml_25 {
        margin-left: 15px;

    }

    .rangeDate {
        height: 28px !important;
    }

    .el-range-editor.el-input__inner {
        padding: 0.1px;
    }

    .el-input--small .el-input__inner {
        height: 28px;
        line-height: 28px;
    }

    .select_posion {
        float: right;
        margin-top: 40px;
        margin-left: 30px;
        margin-bottom: 10px;
    }
</style>