import { importComponents, importVuex, importRouter } from './webpackImportCtx'

importComponents(require.context('../widgets', true, /index\.vue$/))
importComponents(require.context('../components', true, /index\.vue$/))

export const store = importVuex(require.context('../store', true, /.+\.js/))

store.dispatch('ws/listen')

// export const router = importRouter({}, require.context('../pages', true, /(index\.vue|info\.yml)$/))