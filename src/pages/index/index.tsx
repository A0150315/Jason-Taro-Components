import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import TabPanel from '../../components/tab/tab-panel'
import Tab from '../../components/tab'
import './index.scss'

export default class Index extends Component {
  state = {
    list: [1, 2, 3, 2, 3, 2, 3, 1, 3, 1, 2, 3, 2, 3, 1, 3]
  }
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  }

  render() {
    return (
      <View className='wrapper'>
        <Tab
          // hasTop
          // fixable
          tab={['标签1', '标签2', '标签3', '标签4']}
          getIndex={getIndex => {
            console.log('getIndex', getIndex)
          }}
          mode='common'
        >
          {[1, 2, 3, 4].map((item, idx) => {
            return (
              <TabPanel
                key={idx}
                onPullDown={() => {
                  this.setState({
                    list: [1, 2, 3, 2, 3, 2, 3, 1, 3, 1, 2, 3, 2, 3, 1, 3]
                  })
                }}
                onScrollToLower={() =>
                  this.setState({
                    list: [
                      ...this.state.list,
                      1,
                      1,
                      1,
                      1,
                      1,
                      1,
                      1,
                      1,
                      1,
                      1,
                      1,
                      1
                    ]
                  })
                }
              >
                {this.state.list.map((item, idx) => (
                  <View className='item'>item{idx}</View>
                ))}
              </TabPanel>
            )
          })}
        </Tab>
      </View>
    )
  }
}
