import { Component } from 'vue/types';
import _ from 'lodash'

export interface Content {
  type: string;
  children: Array<Content>;
  style?: Array<string>;
  props: {[k in string]: any};
}

export interface Manifest {
  container: boolean
  path: string
  component?: Component
}

export const manifest: { [k: string]: Manifest } = {
  container: {
    path: "default/container",
    container: true,
  },
  logo: {
    path: "default/logo",
    container: false,
  }
}

Object.keys(manifest).forEach(k => {
  manifest[k].component = <Component>require(`./${manifest[k].path}/index.vue`).default
});


export const getProps = x => {
  let comp = manifest[x].component as any;
  let p = typeof comp === "function" ? comp.options.props : comp.props;
  let ret = _.pick(p, _.keys(p));
  return ret;
};