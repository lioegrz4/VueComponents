import Vue from 'vue'

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const importDir = (requireComponent, handleFileName) => {
  let hfn = handleFileName || (x => x)
  requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName)
    const componentName = fileName.replace(/\.\/(.+)\/index.vue$/g, "$1")
    Vue.component(hfn(componentName), componentConfig.default || componentConfig)
  })
}

importDir(require.context( '../widgets', true, /index\.vue$/ ))
importDir(require.context( '../components', true, /index\.vue$/ ))
