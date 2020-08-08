<template>
  <div label="打印项偏移校正">
    <div style="position: absolute; top: 3rem; left: -6rem; display: flex; flex-flow: column nowrap;">
      <div><span>对齐到网格</span><el-checkbox v-model="grid.enable"></el-checkbox></div>
      <div><span>横向</span><input type="number" v-model="grid.x" style="width: 2rem"></div>
      <div><span>纵向</span><input type="number" v-model="grid.y" style="width: 2rem"></div>
    </div>
    <drag-container v-model="pos"
                    :grid="grid.enable && grid"
                    :style="imgStyle">
        <div v-for="item in pis" :key="item.code"
             class="x-delivery-message-box" :style="item.styleObject">
          <span>{{item.name}}</span>
          <a @click="item.is_selected=false" class="close-btn" href="javascript:void(0);"
             title="删除">×</a>
        </div>
    </drag-container>
  </div>
</template>

<script>
import dragContainer from "@c/DragContainer/index.vue";
import _ from "lodash/fp";

export default {
  name: "delivery-printInfo",
  components: {
    dragContainer,
  },
  data() {
    return {
      grid: { x: 30, y: 50, enable: false },
      payload: {
        name             : "",                                       //运单模板名称
        size_length      : 0,                                        //运单尺寸（长）
        size_width       : 0,                                        //运单尺寸（宽）
        upper_offset     : 0,                                        //上偏移量
        left_offset      : 0,                                        //下偏移量
        img              : "",                                       //模板图片
        print_item       : [{ code: "", name: "", is_selected: 0 }], //打印项
        print_item_offset: ""                                        //打印项偏移校正
      }
    };
  },
  computed: {
    size() {
      return {
        height: this.payload.size_length + "px",
        width: this.payload.size_width + "px"
      };
    },
    imgStyle() {
      return Object.assign(
        {
          border: "grey 1px solid",
          backgroundImage: `url(${this.payload.img})`,
          backgroundRepeat: "no-repeat"
        },
        this.size
      );
    },
    pis() {
      return _.flow([
        s => s.map((x, ix) => { x.ix = ix; return x; }),
        _.filter({ is_selected: true })
      ])(this.payload.print_item);
    },
    pos: {
      get() {
        return _.map(({ left, top, ix}) => [left || 0, top || 0, ix])( this.pis );
      },
      set(v) {
        for (let i of v) {
          let [left, top, ix] = i
          let t = this.payload.print_item[ix]
          this.$set(t, 'left', left)
          this.$set(t, 'top', top)
        }
      }
    }
  },
};
</script>