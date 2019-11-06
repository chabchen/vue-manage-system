<template>
    <div :style="{width:widthData}" class="line-box" v-loading="loading">
        <div class="echart-ex1">
            <div v-if = "selectData.title" class="line-title">
                <p>{{selectData.title}}</p>
                <div v-show="selectData.showSelect" class="line-select">
                    {{selectData.label}}
                    <el-select v-model="selectData.value" placeholder="请选择">
                        <el-option v-for="item in selectData.options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
            </div>
            <ve-line width=100% height="460px" style="top:25px" :data="chartData" :extend="chartExtend" :colors="chartSettings.chartColor" :loading="loading"
                :settings="chartSettings" />
        </div>
    </div>
</template>
<script>
    export default {
        props: { prop: Object },
        data() {
            return {
                selectData: {},
                chartData: {},
                chartExtend: {},
                chartSettings: {},
                loading: true,
                widthData: '100%',
                params: '',
                reportType: "dayReport",
                sql2: "",
            }
        },
        created() {
            this.selectData = this.prop.config.selectData;
            this.chartData = this.prop.config.chartData;
            this.chartExtend = this.prop.config.chartExtend;
            this.chartSettings = this.prop.config.chartSettings;
            this.sql2 = this.prop.config.sql2;
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
                    if(Array.isArray(obj.value)){
                        param += " " + obj.type + " " + obj.tableField + " >= " + obj.value[0];
                        param += " " + obj.type + " " + obj.tableField + " <= " + obj.value[1];
                    }else{
                        param += " " + obj.type + " " + obj.tableField + " " + obj.operation + " " + obj.value;
                    }                    
                }
                return param;
            },
            loadReportData(params) {
                let sql = this.prop.sqls;
                if(!sql || !this.url){this.loading = false;return;}
                let param = this.getParams(params);
                let groupby = '';
                if(this.reportType == "monthReport" && this.sql2){
                    groupby = this.sql2.split("groupby")[1];
                    sql = this.sql2.split("groupby")[0];
                }else{
                    groupby = sql.split("groupby")[1]
                    sql = sql.split("groupby")[0];
                }
                //判断是否存在groupby
                if (groupby) {
                    groupby = ' group by' + groupby;
                }
                this.$requestData(this.url , 'post', { params: sql + param + groupby }).then(res => {
                    this.loading = false;
                    if (!res.datas) {return;}
                    this.setData(res.datas);
                }).catch(() => {
                    this.loading = false;
                });
            },
            setData(datas){
                this.chartData.rows = [];
                let fields = this.chartData.fields;
                this.chartData.columns = this.chartData.columns2;
                if(this.reportType == "monthReport"){
                    fields = this.chartData.fields2;
                    this.chartData.columns = this.chartData.columns3;
                }                
                for(let obj of datas){
                    let row = {};
                    for(let field in fields){
                        row[fields[field]] = obj.field;
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
        width: 100%;
        margin: 0 auto;
        border-width: 0px;
        background: inherit;
        background-color: rgba(255, 255, 255, 1);
        border: none;
        border-radius: 0px;
        -moz-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        -webkit-box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.105882352941176);
        box-sizing: border-box;
        overflow: hidden
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
        display: inline-block;
        margin: 0;
    }
</style>