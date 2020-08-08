<script>
const drawGrid = (self, h) => {
  if (!(self && self.grid && self.$el)) return [];
  let { height, width } = self.$el.getBoundingClientRect();
  let xl = Math.floor(width / self.grid.x),
    yl = Math.floor(height / self.grid.y);
  let ret = [];
  for (let x = 0; x < self.grid.x; x++) {
    for (let y = 0; y < self.grid.y; y++) {
      ret.push(
        h("div", {
          'class': ["dragContainer_hint"],
          style: { left: xl * x + "px", top: yl * y + "px" }
        })
      );
    }
  }
  return ret;
};

export default {
  name: "DragContainer",
  props: ["value", "grid"],
  methods: {
    calcEnd(x, y) {
      let { height, width } = this.$el.getBoundingClientRect();
      return [x - x % (width / this.grid.x), y - y % (height / this.grid.y)];
    }
  },
  render(h) {
    if (!this.$slots.default) return h("div");
    let self = this;
    return h(
      "div",
      {
        style: {
          position: "relative",
          flex: "1 0 100%",
          alignSelf: "stretch"
        },
        on: {
          dragover: e => {
            e.preventDefault();
          },
          drop: e => {
            let { clientX, clientY } = e;
            let { ix, startX, startY } = JSON.parse(
              e.dataTransfer.getData("start")
            );
            let endX = self.value[ix][0] + (clientX - startX);
            let endY = self.value[ix][1] + (clientY - startY);
            if (self.grid) [endX, endY] = self.calcEnd(endX, endY);
            // 数组前两个元素表示位置。剩下的可自由添加
            self.$set(self.value, ix, [endX, endY, ...self.value[ix].slice(2)]);
            self.$emit("input", self.value);
          }
        }
      },
      [
        ...drawGrid(self, h),
        ...this.$slots.default.map((x, ix) => {
          if (!x.tag || !self.value[ix]) return x;
          let X = self.value[ix][0];
          let Y = self.value[ix][1];
          return h(
            "div",
            {
              'class': ["draggable-item"],
              style: {
                top: Y + "px",
                left: X + "px"
              },
              domProps: { draggable: true },
              on: {
                dragstart: e => {
                  let { clientX, clientY } = e;
                  e.dataTransfer.setData(
                    "start",
                    JSON.stringify({
                      startX: clientX,
                      startY: clientY,
                      ix
                    })
                  );
                }
              }
            },
            [x]
          );
        })
      ]
    );
  }
};
</script>
<style>
.draggable-item {
  position: absolute;
}

.dragContainer_hint {
  position: absolute;
  background-color: #888;
  border-radius: 1px;
  height: 2px;
  width: 2px;
}
</style>