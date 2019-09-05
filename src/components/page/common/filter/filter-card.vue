<template>
    <div class="wrapper">
        <div class="wrap" style="height: 120px;">
            <div class="item" style="margin: auto">
                <div class="c_title" style="text-align: center">
                    {{data.label}}
                    <i v-if="data.showChecked" class="checkbox" style="float: right;margin: 10px 25px 0 -25px;">
                        <el-checkbox v-model="data.checked" />
                    </i>
                </div>
                <div style="text-align: center">
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
                data: {
                }
            }
        },
        created() {
            this.data = this.prop.config.items;
        }
    }
</script>


<style scoped>
    .wrapper {
        width: 25%;
        /* margin: 20px; */
        padding: 5px;
        display: inline-block;
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
</style>