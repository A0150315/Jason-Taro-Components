import Taro from '@tarojs/taro'

export { default as Tab } from './components/tab'
export { default as TabPanel } from './components/tab/tab-panel'

Taro.initPxTransform({ designWidth: 750 })
