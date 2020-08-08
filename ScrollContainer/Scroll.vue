<script lang="ts">
import Component from "vue-class-component"
import { Prop } from 'vue-property-decorator'
import ExVue from "vue"

export function isElementInViewport(el) {
    let rect = el.getBoundingClientRect();
    let H = window.innerHeight || document.documentElement.clientHeight
      , T = H / 2
      , B = T
    return (
        rect.bottom >= T && rect.top <= B
    );
}

let menu = (h, self) => h('div',
    {
        'class': ['scroll-menu', self.display && "display" ]
    },
    [
        h('div',
            self.$slots.default && self.$slots.default.map((x, ix) => {
                let title = x.componentOptions.propsData.value[self.titleProp]
                if (self.formatter) title = self.formatter(title)
                let order = ix + 1 + 'L'
                let result = self.active === ix || self.hover === ix ? title : order
                return h('div',
                    {
                        'class': ['scroll-menu-item'],
                        style: {
                            backgroundColor: self.hover === ix ? self.color : "transparent",
                            color: self.hover === ix ? "white" : self.active === ix ? self.color : "black"
                        },
                        on: {
                            click: function(ev) {
                                x.elm.scrollIntoView({ behavior: 'smooth' })
                            },
                            mouseenter: function(ev) {
                                self.hover = ix
                            },
                            mouseleave: function(ev) {
                                self.hover = null
                            },
                        }
                    },
                    [result])
            }))
    ])

@Component
export default class ScrollContainer extends ExVue {
    @Prop() titleProp: string
    @Prop() color    : string
    @Prop() formatter: (string) => string
    active           : number | null = null
    hover            : number | null = null
    display          : boolean       = false
    render(h) {
        let self = this
        return h('div',
            {
                'class': 'scroll-container',
            },
            [
                menu(h, self),
                h('div',
                    {
                        'class': ['column-stretch']
                    },
                    [
                        self.$slots.default
                    ])

            ])
    }
    // 检测当前滚动位置，高亮相应指示器
    created() {
        (window as any).addEventListener('scroll', this.handleScroll);
        (window as any).addEventListener('resize', this.handleScroll);
    }
    destroyed() {
        (window as any).removeEventListener('scroll', this.handleScroll);
        (window as any).removeEventListener('resize', this.handleScroll);
    }
    handleScroll(ev) {
        this.$slots.default && this.$slots.default.forEach((x, ix) => {
            if (isElementInViewport(x.elm)) {
                this.active = ix
            }
        })
        this.display = isElementInViewport(this.$el)
    }
}
</script>
<style>
.scroll-container {
    display: flex;
}

.scroll-menu {
    position: relative;
    left: -4em;
    opacity: 0;
    transition: all 0.5s ease;
}

.scroll-menu.display {
    opacity: 1;
}

.scroll-menu>div {
    position: fixed;
    display: flex;
    flex-flow: column nowrap;
    top: 20em;
}

.scroll-menu-item {
    padding: 6.5px 3px;
    transition: all 0.5s ease;
    cursor: pointer;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    background-image: url(../../static/images/left-bg.png);
}
.scroll-menu>div>div:first-child{
     background-image: none;
}
.scroll-menu-item:hover {
    background-color: rgba(50, 50, 50, 0.3)
}
</style>