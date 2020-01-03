import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import TabPanel from "../../components/tab/tab-panel";
import Tab from "../../components/tab";
import "./index.scss";

export default class Index extends Component {
  state = {
    list: [1, 2, 3, 2, 3, 2, 3, 1, 3, 1, 2, 3, 2, 3, 1, 3],
    index: 2
  };
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "首页"
  };

  render() {
    const { list, index } = this.state;
    return (
      <View className='wrapper'>
        <Tab
          index={index}
          // hasTop
          // fixable
          tab={[
            "标签1",
            "标签2",
            "标签3",
            "标签4",
            "标签3",
            "标签4",
            "标签3",
            "标签4",
            "标签3",
            "标签4"
          ]}
          getIndex={getIndex => {
            console.log("getIndex", getIndex);
          }}
          mode='common'
        >
          {[1, 2, 3, 4].map((item, idx) => {
            return (
              <TabPanel
                // disableOnScrollToLower
                key={idx}
                onPullDown={() => {
                  this.setState({
                    list: [1, 2, 3, 2, 3, 2, 3, 1, 3, 1, 2, 3, 2, 3, 1, 3]
                  });
                }}
                // bottomText="11212"
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
                {/* <View style={{ height: 'calc(99vh - 98px)' }}>11</View> */}
                {list.map((item, idx) => (
                  <View className='item'>
                    <Image src='https://pic2.zhimg.com/80/v2-54d7a6ced12af679ed217c60b3195d95_hd.jpg' />{" "}
                    item{idx}
                  </View>
                ))}
              </TabPanel>
            );
          })}
        </Tab>
      </View>
    );
  }
}
