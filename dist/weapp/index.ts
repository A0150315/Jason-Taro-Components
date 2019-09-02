import Taro from '@tarojs/taro'

Taro.initPxTransform({ designWidth: 750 })

export { default as Tab } from './components/tab'
export { default as TabPanel } from './components/tab/tab-panel'
