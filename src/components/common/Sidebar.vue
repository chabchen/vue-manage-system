<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#222D32" text-color="#fff" active-text-color="#20a0ff" unique-opened>
            <!-- <div style="margin-top: 15px;width：90%;margin-left:5%;" v-show="!collapse">
                <el-input placeholder="请输入内容" v-model="iteminput">
                    <el-button slot="append" icon="el-icon-search" @click.native="iteminputs"></el-button>
                </el-input>
            </div> -->
            <div class="collapse-btn" @click="collapseChage">
                <div :class="collapse == false? 'shouqi_mul':'shouqi_muls'"></div>
                <!-- <img src="../../assets/shouqi_mul.png" style="float:right;width:14px;margin:8px 22px 8px 0;" /> -->
            </div>
            <template v-for="(item, index) in items">
                <template v-if="item.children.length != '0' && item.icon != 'hide'">
                    <el-submenu :key="index" :index="index+''">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>

                        <template v-for="(subItem,i) in item.children">
                            <template v-if="subItem.children.length != '0' && subItem.icon != 'hide'">
                                <el-submenu :key="i" :index="subItem.url" @click="openRouter">
                                    <template slot="title">
                                        {{ subItem.title }}
                                    </template>
                                    <el-menu-item v-for="(sub,j) in subItem.children" :key="j" :index="sub.url" text-color="#fff" class="side-menu-title" @click="openRouter" v-if="sub.icon != 'hide'">
                                        {{ sub.title }}
                                    </el-menu-item>
                                </el-submenu>
                            </template>
                            <template v-if="subItem.children.length == '0' && subItem.icon != 'hide'">
                                <el-menu-item :index="subItem.url" :key="i" class="side-menu-title" @click="openRouter">
                                    <i :class="subItem.icon"></i>
                                    <span slot="title">{{ subItem.title }}</span>
                                </el-menu-item>
                            </template>
                        </template>
                    </el-submenu>
                </template>
                <template v-if="item.children.length == '0' && item.icon != 'hide'">
                    <el-menu-item :index="item.url" :key="index" class="side-menu-title" @click="openRouter">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from "../common/bus";
export default {
    data() {
        return {
            collapse: false,
            iteminput: "",
            listt0: [], //处理过的
            items: []
        };
    },
    mounted() {
        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace("/", "");
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        // bus.$on("collapse", msg => {
        //     this.collapse = msg;
        // });
        this.getData();
        bus.$emit("collapse", this.collapse);
    },
    methods: {
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit("collapse", this.collapse);
        },
        iteminputs: function() {
            var _this = this;
            var tab = this.items;
            if (this.iteminput != "") {
                _this["listt0"] = [];
                for (var i in tab) {
                    if (tab[i].title.indexOf(_this.iteminput) >= 0) {
                        _this["listt0"].push(tab[i]);
                    }
                    for (var j in tab[i].subs) {
                        if (
                            tab[i].subs[j].title.indexOf(_this.iteminput) >= 0
                        ) {
                            _this["listt0"].push(tab[i].subs[j]);
                        }
                    }
                }
                this.items = _this["listt0"];
            }
            if (this.iteminput === "") {
                this.items = tabs;
            }
            this.iteminput = "";
        },
        getData() {
            this.$requestData('/sysMenu/menuForTree','get').then(res => {
                this.items = res.datas ? res.datas : [];
            });
        },
        openRouter(router) {
            if (router.index.indexOf("Message") > -1) {
                window.open("#" + router.index, "_blank");
            } else {
                this.$router.push(router.index);
            }
        }
    }
};
</script>

<style scoped>
.collapse-btn {
    padding: 0px;
    cursor: pointer;
    line-height: 30px;
    height: 20px;
    background: transparent;
    cursor: pointer;
}
.shouqi_mul{
    background-image: url("../../assets/img/shouqi_mul.png");
    float:right;width:14px;margin:8px 22px 8px 0;
    height: 17px;
    background-size: 100%;
    background-repeat: no-repeat;
}
.shouqi_muls{
    background-image: url("../../assets/img/shouqi_mul.png");
    float:right;width:14px;margin:8px 28px 8px 0;
    height: 12px;
    background-size: 100%;
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    transition: transform .5s;
    background-repeat: no-repeat;
}
.sidebar {
    padding-right: 20px;
    display: block;
    position: absolute;
    left: 0;
    top: 60px;
    bottom: 0;
    overflow-y: scroll;
    background-color: #7081fd;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
    background: #eef1f6;
}
.el-menu-item i {
    color: #fff;
}
.el-submenu__title i {
    color: #fff;
}
.el-submenu__title {
    color: #fff;
}
.el-icon-arrow-down:before {
    color: #fff !important;
}
.el-submenu__icon-arrow.el-icon-arrow-down {
    color: #fff;
}
.el-input__suffix {
    line-height: 32px;
}
.el-input-group {
    width: 90%;
}
</style>
