<template>
    <div class="wrapper">
        <div class="wrap" style="height: 100px;">
            <div class="item" style="margin: auto">
                <div class="c_title" style="text-align: center">
                    {{data.label}}
                    <i v-if = "data.showChecked" class="checkbox" style="float: right;margin: 10px 25px 0 -25px;">
                        <el-checkbox v-model="data.checked" />
                    </i>
                </div>
                <div style="text-align: center">
                    <b>{{data.value}}</b>
                    <i>{{data.unit}}</i>
                </div>
                <div class="bottom" >
                    <template v-for = "item in data.details">
                        <P>
                            <template v-for = "obj in item">
                                <span style="margin: 20px;" >
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
            return {data:{}}
        },
        created() {
            this.data = this.prop.config.items;
        }
    }
</script>


<style scoped>
    .wrapper {
        width: 380px;
        margin: 20px;
        display: inline-block;
    }

    .wrap {
        border-radius: 30px;
        border: 2px solid #0084D5;
    }

    .bottom {
        overflow: hidden;
        padding-bottom: 22px;
        border-top: 1px solid #0084D5;
        width: 80%;
        height: 30%;
        margin: auto;
        text-align: center;
    }
</style>