<script>
export default {
    render (h, cxt) {
        return h(require(`./${this.app}.vue`).default, {props: {prop: this.prop}})
    },
    props: {app: String,prop: Object}
}
</script>