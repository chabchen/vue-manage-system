<template>
    <div v-loading="loading" v-show="showFrom" style="width: 42%;float: right;vertical-align: top">
        <div v-show="title2" class="head-title2">
            <p>{{title2}}</p>
        </div>
        <div v-show="title" class="head-title">
            <p>{{title}}</p>
        </div>
        <div class="temp-form" :label-position="labelPosition" :model="formData">
            <template v-for="(item, index) in formLabel">
                <div class="temp-form-item1" :style="index % 2 == 0 ? item1Style : item2Style">
                    <p style="padding: 3px;">{{item.label}}</p>
                </div>
                <div class="temp-form-item2" :style="index % 2 == 0 ? item1Style : item2Style">
                    <p style="padding: 3px;">{{formData[item.value]}}</p>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        props: { prop: Object },
        data() {
            return {
                loading: false,
                reportId: '',
                labelPosition: 'right',
                title: '',
                title2: '',
                formLabel: [],
                formData: {},
                initFormData: {},
                params: '',
                labelWidth: '',
                showFrom: false,
                exclude: '',
                style: "",
                item1Style: {},
                item2Style: {},
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
                this.title2 = this.prop.config.title2 ? newValue.markPointName : "";
                if (newValue.markPointName) {
                    this.showFrom = !this.prop.config.showFrom;
                } else {
                    this.showFrom = this.prop.config.showFrom;
                }
                if (this.showFrom) {
                    this.loadReportData(this.params);
                }
                this.prop.params = "";
            }
        },
        created() {
            this.formLabel = this.prop.config.items;
            this.showFrom = this.prop.config.showFrom;
            this.exclude = this.prop.config.exclude;
            this.style = this.prop.config.style;
            if (this.prop.config.items2) {
                this.formLabel = this.prop.config.items2;
            }
            if (this.style) {
                this.item1Style = { background: 'rgba(245,245,245,1)' };
                this.item2Style = { background: 'rgba(235,235,235,1)' };
                for (let field in this.style) {
                    this.item1Style[field] = this.style[field];
                    this.item2Style[field] = this.style[field];
                }
            }
            this.title = this.prop.config.title;
            this.title2 = this.prop.config.title2;
            this.labelWidth = this.prop.config.labelWidth;
            this.params = this.prop.params;
            this.initData();
        },
        methods: {
            initData() {
                for (let obj of this.formLabel) {
                    this.initFormData[obj.value] = "";
                }
            },
            loadReportData(params) {
                let region = "全国";
                let sql = this.prop.sqls;
                let groupby = sql.split("groupby")[1];
                if (groupby) {
                    sql = sql.split("groupby")[0];
                }
                sql = sql.replace(region, "'" + region + "'");

                for (let obj of params.searchSelect) {
                    if (!obj.value) { continue; }
                    if (obj.tableField == "city") {
                        obj.value = obj.value.replace("市", "");
                    }
                    //后续需要改进
                    if (sql.indexOf("region") > -1 && (obj.tableField == "province" || obj.tableField == "city")) {
                        sql = sql.replace(region, obj.value);
                        region = obj.value;
                    }
                    if (obj.operation != 'in') {
                        if (this.exclude && this.exclude.indexOf(obj.tableField) > -1) { continue; }
                        sql += " " + obj.type + " " + obj.tableField + " = '" + obj.value + "'";
                    }
                }
                if (groupby) {
                    groupby = ' group by ' + groupby;
                    sql += groupby;
                }
                this.$requestData('/report/list', 'post', { params: sql }).then(res => {
                    let data = res.datas && res.datas.length && res.datas[0] ? res.datas[0] : this.initFormData;
                    for (let obj of this.formLabel) {
                        data[obj.value] = typeof (data[obj.value]) == 'number' && obj.type != 'int' ? this.$setFinanceVal((data[obj.value]).toFixed(2)) : data[obj.value];
                        data[obj.value] = data[obj.value] ? data[obj.value] : 0;
                    }
                    this.formData = data;
                });
            }
        }
    }
</script>
<style scoped>
    .head-title2 {
        font-family: 'Arial Normal', 'Arial';
        font-weight: 600;
        font-style: normal;
        font-size: 16px;
        letter-spacing: normal;
        color: #0084d5;
        vertical-align: none;
        line-height: 25px;
        text-transform: none;
        background: #66B5E6;
        padding-left: 15px;
        margin: 1px 0 1px 0;
        text-align: left;
        width: 150px;
    }

    .head-title {
        font-family: 'Arial Normal', 'Arial';
        font-weight: 600;
        font-style: normal;
        font-size: 16px;
        letter-spacing: normal;
        color: #0084d5;
        vertical-align: none;
        line-height: 25px;
        text-transform: none;
        background: rgba(201, 200, 199, 1);
        padding-left: 15px;
        margin: 1px 0 1px 0;
        text-align: center;
    }

    .head-title p {
        display: inline-block;

    }

    .temp-form-item1 {
        background-color: #f1f2f7;
        border: 1px solid #fff;
        color: #0084d5;
        display: inline-block;
        line-height: 20px;
        text-align: right;
        width: 32%;
        margin: 0;
        font-style: normal;
        font-size: 12px;
    }

    .temp-form-item2 {
        background-color: #f1f2f7;
        border: 1px solid #fff;
        color: #0084d5;
        display: inline-block;
        line-height: 20px;
        text-align: left;
        width: 17.22%;
        margin: 0;
        font-style: normal;
        font-size: 12px;
    }

    .temp-form div{
        background: rgba(245,245,245,1)
    }
    .temp-form div:nth-of-type(8n+1){
        background: rgba(235,235,235,1)
    }
    .temp-form div:nth-of-type(8n+2){
        background: rgba(235,235,235,1)
    }
    .temp-form div:nth-of-type(8n+3){
        background: rgba(235,235,235,1)
    }
    .temp-form div:nth-of-type(8n+4){
        background: rgba(235,235,235,1)
    } 
</style>