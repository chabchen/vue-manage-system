<template>
    <div :style="{width:widthData}" class="line-box" v-loading="loading">
        <div class="echart-ex1">
            <div v-if = "selectData.title" class="line-title">
                <p>{{selectData.title}}</p>
                <div v-show="selectData.showDetail" class="line-select">
                    <router-link :to="{ path: 'index', query: { reportId: selectData.detailId }}">
                        查看原因
                    </router-link>
                </div>
                <div v-show="selectData.showSelect" class="line-select">
                    {{selectData.label}}
                    <el-select v-model="selectData.value" placeholder="请选择">
                        <el-option v-for="item in selectData.options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
            </div>
            <ve-pie width=100% height="460px" style="top:25px" :data="chartData" :settings="chartSettings"></ve-pie>
        </div>
    </div>
</template>

<script>
    export default {
        props: { prop: Object },
        data() {
            return {
                loading: true,
                selectData: {},
                widthData: '50%',
                chartData: {},
                chartSettings: {},
                params: "",
                url: "",
                reportType: "dayReport",
                divDayFlag: false,//是否需要除以天数
                days: "",
            }
        },
        created() {
            this.loading = false;
            this.selectData = this.prop.config.selectData;
            this.chartData = this.prop.config.chartData;
            this.chartSettings = this.prop.config.chartSettings;
            if(this.prop.config.widthData){
                this.widthData = this.prop.config.widthData;
            }
        },
        computed: {
            changeParams() {
                return this.prop.params;
            }
        },
        watch: {
            changeParams(newValue) {
                if(!newValue){return;}
                this.params = newValue;
                this.loadReportData(newValue);
                this.prop.params = "";
            }
        },
        methods: {
            getParams(params) {
                if (!params || (!params.searchSelect && !params.searchDate)) { return ""; }
                let param = "";
                if (params.searchSelect) {
                    for (let obj of params.searchSelect) {
                        if (!obj.value || !obj.value.length) { continue; }
                        if(obj.tableField == "reportType"){
                            this.reportType = obj.value == "日报" ? "dayReport" : "monthReport";
                        }
                        if (obj.type && obj.tableField && Array.isArray(obj.value)) {
                            param += " " + obj.type + " " + obj.tableField + " in " + " ('" + obj.value.join("','") + "')";
                        }
                        if (obj.type && obj.tableField && !Array.isArray(obj.value)) {
                            param += " " + obj.type + " " + obj.tableField + " " + obj.operation + "'" + obj.value + "'";
                        }
                    }
                }
                if (!params.searchDate) { return param }
                for (let obj of params.searchDate) {
                    if (!obj.value) { continue; }
                    if(obj.value instanceof Array){
                        param += " " + obj.type + " " + obj.tableField + " >= " + obj.value[0];
                        param += " " + obj.type + " " + obj.tableField + " <= " + obj.value[1];
                        this.getDays(obj.value);
                    }else{
                        param += " " + obj.type + " " + obj.tableField + " " + obj.operation + " " + obj.value;
                    }                    
                }
                return param;
            },
            getDays(dates){//获取选中的日期天数
                let start = dates[0];
                let end = dates[1];
                let startDate;
                let endDate
                if(this.reportType == "dayReport"){//日报
                    this.lastDay = end;
                    startDate = new Date(start.substring(0,4),parseInt(start.substring(4,6))-1,start.substring(6,8));
                    endDate = new Date(end.substring(0,4),parseInt(end.substring(4,6))-1,end.substring(6,8));
                }else{//月报
                    startDate = new Date(start.substring(0,4),parseInt(start.substring(4,6))-1);
                    endDate = new Date(end.substring(0,4),end.substring(4,6));
                    let day = new Date(endDate.getTime() - 86400000).getDate();
                }           
                let days = endDate.getTime() - startDate.getTime(); 
    　　        this.days = parseInt(days / (1000 * 60 * 60 * 24))+1;
            },
            loadReportData(params) {
                let sql = this.prop.sqls;
                let param = this.getParams(params);
                if(param){sql += param;}
                if (!sql || !this.url) { this.loading = false;return; }
                this.$requestData(this.url, 'post', { params: sql }).then(res => {
                    this.loading = false;
                    if(!res.datas){return;}
                    console.log(res.datas);
                   // this.data = res.datas;
                }).catch(() => {
                    this.loading = false;
                });
            },
            setData(datas){
                this.chartData.rows = [];
                let fields = this.chartData.fields;
                for(let obj of datas){
                    let row = {key:"",value:""};
                    for(let field in fields){
                        row.key = fields[field];
                        row.value = obj.field / this.days;
                    }
                    this.chartData.rows.push(row);
                }
            }
        }
    }
</script>
<style scoped>
    .line-title {
        font-family: 'Arial Normal', 'Arial';
        font-weight: 600;
        font-style: normal;
        font-size: 20px;
        letter-spacing: normal;
        vertical-align: none;
        line-height: 50px;
        text-transform: none;
        padding-left: 15px;
        margin: 10px 0 10px 0;
        background: rgba(242, 242, 242, 1);
        color: #333333;
    }

    .echart-ex1 {
        display: inline-block;
        width: 99.6%;
        margin: 2% auto;
        border-width: 0px;
        background: inherit;
        background-color: rgba(255, 255, 255, 1);
        border: none;
        border-radius: 0px;
        -moz-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        -webkit-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-sizing: border-box;
    }

    .line-title p {
        display: inline-block;
    }

    .line-select {
        float: right;
        margin-right: 15px;
    }

    .line-box {
        box-sizing: border-box;
        display: inline-flex;
    }
</style>