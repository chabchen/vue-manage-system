<template>
    <div>
        <div>
            <div class="kpi_list">
                <div class="kpi_item"  v-for="(item, index) in items">
                    <div class="item-compare">
                        <p class="pro_kpi_title">{{item.key}}</p>
                        <p class="kpi_content">{{item.value}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import {requestData} from '@/api/RequestData';

export default {
    props: {prop: Object},
    data() {
        return {
            items:[]
        }
    },
    created() {
        this.items = this.prop.config.items;
    }
}
</script>

<style scoped>
.kpi_list {
    display: flex;
    flex-direction: row;
}

.kpi_list .kpi_item {
    display: flex;
    flex-direction: column;
    -ms-flex: 1;
    -webkit-box-flex: 1;
    -webkit-box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
    -webkit-box-sizing: border-box;
    background: #fff;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
    box-sizing: border-box;
    flex: 1;
    text-align: center;
    min-height: 74px;
}

.kpi_list .kpi_item .item-compare {
    display: flex;
    flex-direction: row;
    flex: 1;
    align-items: center;
}


.kpi_list .kpi_item .kpi_content{
	flex: 1;
	color: #888;
	font-weight: 700;
	padding: 5px;
	font-size: 20px;
	margin: 0;
	white-space: nowrap;
}

.pro_kpi_title{
	font-size: 14px;
	white-space: nowrap;
	margin-left: 5px;
	color: rgb(61, 122, 183);
	font-weight: 700;
	min-width: 80px;
	width: 80px;
	padding: 5px;
	margin: 0px;
}
</style>
      