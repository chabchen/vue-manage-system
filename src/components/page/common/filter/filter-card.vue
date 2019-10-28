<template>
    <div :style="{width:widthData,gridRow:'row-start 2 / row-end 3'}" class="wrapper" @click="routerTo">
        <div class="title_style">
            <span class="blue_span" v-if="data.card_title">  </span>
            <span>&nbsp&nbsp{{data.card_title}}</span>
        </div>
        <div class="wrap" style="height: 120px;">
            <div class="item" style="margin: auto">
                <div class="c_title" style="text-align: center">
                    {{data.label}}
                    <i v-if="data.showChecked" class="checkbox" style="float: right;margin: 10px 25px 0 -25px;">
                        <el-checkbox v-model="data.checked" />
                    </i>
                </div>
                <div style="text-align: center;min-height: 30px;">
                    <b>{{data.value}}</b>
                    <i>{{data.unit}}</i>
                </div>
                <div class="bottom">
                    <template v-for="item in data.details">
                        <P>
                            <template v-for="obj in item">
                                <span class="bottom-span">
                                    {{obj.label}}
                                    <b style="color:#ff9d1e">{{obj.value}}</b>
                                    <i style="color:#ff9d1e">{{obj.unit}}</i>
                                </span>
                            </template>
                        </P>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: { prop: Object },
        data() {
            return {
                widthData: "25%",
                data: "",
                params: "",
                url: "",
            }
        },
        created() {
            this.data = this.prop.config.items;
            this.url = this.prop.config.url;
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
                console.log(newValue);
                //this.loadReportData(newValue);
                this.prop.params = "";
            }
        },
        methods: {

            loadReportData(params) {
                let sql = this.prop.sqls;
                for (let obj of params.searchSelect) {
                    if (!obj.value) { continue; }
                    if (obj.operation != 'in') {
                        sql += " " + obj.type + " " + obj.tableField + obj.operation + "'" + obj.value + "' ";
                    }
                }
                if(!sql || !obj.url){return;}                
                this.$requestData(this.url, 'post', { params: sql }).then(res => {
                    this.data = res.datas;
                });
            },
            routerTo(){
                if(!this.prop.config.indexId){return;}
                this.$router.push({ path: 'index', query: { reportId: this.prop.config.indexId } });
            }
        }
    }
</script>


<style scoped>
    .wrapper {
        padding: 5px;
        display: inline-grid;
        box-sizing: border-box;
        margin: 5px auto;
    }

    .wrap {
        border-radius: 30px;
        border: 2px solid #0084D5;
        /* padding: 20px */
    }

    .bottom {
        overflow: hidden;

        border-top: 1px solid #0084D5;
        width: 100%;
        height: 100%;
        margin: auto;
        text-align: center;
    }

    .bottom-span {
        line-height: 25px;
        margin: 0 5px
    }
    .title_style{
        margin: 10px 0;
    }
    .blue_span{
        display: inline-block;
        background: #2d8cf0;
        width: 4px;
        height: 20px;
    }
    span{
        vertical-align: middle;
    }
</style>