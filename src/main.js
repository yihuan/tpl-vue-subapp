window.Vue = require('vue')
import App from './App.vue'

window.Vue.config.productionTip = false

import actions from './actions'
import store from './store'
import routes from './router'
const VueRouter = require('vue-router')

window.Vue.config.errorHandler = function (err, vm, info) {
  if (process.env.NODE_ENV !== 'production') {
      console.error('Error:', err)
  }
}

let instance = null
let router = null

function render(props = {}) {
  const { container, routerBase, routerBaseMap, updateParentStore } = props
  // 针对项目中 a 链接的跳转，添加前缀
  if (window.__POWERED_BY_QIANKUN__) {
      window.Vue.prototype.DOMAIN_PREFIX = routerBase;
      __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
      window.Vue.prototype.updateParentStore = updateParentStore
  }

  //
  window.Vue.prototype.getRealIWorkRouteBase = function (type) {
      if (!window.__POWERED_BY_QIANKUN__) return '/'

      if (!routerBaseMap || !routerBaseMap.IWORK) return '/'

      return `${routerBaseMap.IWORK[type]}` || '/'
  }

  router = new VueRouter({
      mode: 'history',
      base: window.__POWERED_BY_QIANKUN__ ? `${routerBase}` : '/',
      routes,
  })
  router.beforeEach((to, from, next) => {
      // 如果是嵌套在iframe中的页面则不显示头部
      window.top != window.self && (to.meta.showHead = false)
      document.title =
          to.meta && to.meta.title ? to.meta.title : '云效-组织效能';
      next()
  })

  instance = new window.Vue({
      router,
      store,
      render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app')
}

if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {
  console.log('EffectiveOrg app bootstraped')
}

export async function mount(props) {
  actions.setActions(props)
  render(props)
}

export async function unmount() {
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
  router = null
}
