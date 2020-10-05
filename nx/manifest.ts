import { Component } from 'vue/types';
import _ from 'lodash/fp'

export interface Content {
  kind: string;
  children: Array<Content>;
  style?: Array<string>;
  props: {[k in string]: any};
}

export interface Manifest {
  name: string
  container: boolean
  path: string
  component?: Component
}

export const manifest: { [k: string]: Manifest } = {
  container: {
    name: "行容器",
    path: "default/row",
    container: true,
  },
  linear: {
    name: "列容器",
    path: "default/col",
    container: true,
  },
  txt: {
    name: "文本",
    path: "default/txt",
    container: false
  },
  img: {
    name: "图像",
    path: "default/img",
    container: false,
  },
}

Object.keys(manifest).forEach(k => {
  manifest[k].component = <Component>require(`./${manifest[k].path}/index.vue`).default
});


export const getProps = x => {
  let comp = manifest[x].component as any;
  let p = typeof comp === "function" ? comp.options.props : comp.props;
  let ret = _.pick(_.keys(p))(p);
  return ret;
};

export const getNode = path => src => {
  return path.length === 0 ? src : _(src).get(path)
}
