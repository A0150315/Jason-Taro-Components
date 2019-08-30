import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import TabPanel from '../../components/tab/tab-panel'
import Tab from '../../components/tab'
import styles from './index.scss'

export default class Index extends Component {
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
      <View className={styles.wrapper}>
        <Tab
          // hasTop
          // fixable
          tab={[1, 2, 3, 2, 3, 4, 5, 62, 3, 4, 5, 64, 5, 6]}
          getIndex={getIndex => {
            console.log('getIndex', getIndex)
          }}
        >
          {[1, 2, 3, 4, 5].map((item, idx) => {
            return (
              <TabPanel
                key={idx}
                onPullDown={() => {
                  console.log(2)
                }}
                onScrollToLower={() => console.log(1)}
              >
                {[
                  1,
                  2,
                  3,
                  2,
                  3,
                  ,
                  2,
                  3,
                  1,
                  2,
                  ,
                  2,
                  3,
                  ,
                  4
                ].map((item, idx) => (
                  <View>{item}111</View>
                ))}
              </TabPanel>
            )
          })}
        </Tab>
      </View>
    )
  }
}
