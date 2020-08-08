import { Component } from 'vue/types';

export interface Content {
  type: string;
  children: Array<Content>;
  style?: Array<string>;
  value: any;
}

export interface Manifest {
  type: "ordinary" | "container";
  path: string;
  component?: Component
}

export const manifest: { [k: string]: Manifest } = {
  container: {
    path: "default/container",
    type: "container",
  },
  logo: {
    path: "default/logo",
    type: "ordinary",
  }
}

Object.keys(manifest).forEach(k => {
  manifest[k].component = <Component>require(`./${manifest[k].path}/index.vue`).default
});