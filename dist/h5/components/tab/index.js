import Nerv from "nervjs";
import { useState, useCallback, useEffect, useMemo } from "@tarojs/taro-h5";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import classNames from "classnames";
import { getEnv } from "../../utils/utils";
import "./index.scss";
let startPosition = 0;
const standard = 100;
let hasMoved = false;

class Tab extends Taro.Component {
  render() {
    const {
      children: children
    } = this.props;
    const { fixable = false, hasTop = false, index = 0, className, style, tab = [], getIndex, mode } = this.props;

    const [currentIndex, setCurrentIndex] = useState(index);
    const [isShowMore, setIsShowMore] = useState(false);
    const [isShowArrow] = useState(mode !== "common");
    const containerStyles = classNames("container", className);
    const selectorStyles = useMemo(() => classNames("selector", {
      ["selector_fix"]: fixable,
      ["selector_paddingTop"]: hasTop
    }), [fixable, hasTop]);
    const outerScrollViewStyles = useMemo(() => classNames("outerScrollView", {
      ["outerScrollView_padding"]: fixable
    }), [fixable]);
    const maskStyles = useMemo(() => classNames("mask", {
      ["mask_show"]: isShowMore
    }), [isShowMore]);
    const moreBgStyles = useMemo(() => classNames("moreBg", {
      ["moreBg_show"]: isShowMore
    }), [isShowMore]);
    const tabWrapperStyles = useMemo(() => classNames("tabWrapper", {
      ["tabWrapper_common"]: !isShowArrow
    }), [isShowArrow]);
    const tabTextStyles = useCallback((index, canScroll = false) => classNames("tabText", {
      ["tabText__highLight"]: index === currentIndex,
      ["tabText__noMargin"]: !isShowArrow,
      ["tabText__canScroll"]: canScroll
    }), [currentIndex, isShowArrow]);
    const moreTextStyles = useCallback(index => classNames("moreTabText", {
      ["moreTabText__highLight"]: index === currentIndex
    }), [currentIndex]);
    const showMask = useCallback(() => setIsShowMore(true), []);
    const hideMask = useCallback(() => setIsShowMore(false), []);
    useEffect(() => {
      if (getEnv() !== "WEAPP" && document.querySelector(`#tab${currentIndex}`)) document.querySelector(`#tab${currentIndex}`).scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
      });
      if (getIndex) getIndex(currentIndex);
      // eslint-disable-next-line
    }, [currentIndex]);
    return <View className={containerStyles} style={style}>
      
      
      <View className={maskStyles} onClick={hideMask} />
      <View className={moreBgStyles}>
        <View className="moreHeader">
          <Text className="title">全部分类</Text>
          <Image onClick={hideMask} className="arrowIcon" src="https://jiayixueyuan.oss-cn-shenzhen.aliyuncs.com/h5/arrow_close.svg" />
        </View>
        <View className="moreMain">
          {tab.map((title, index) => <View className={moreTextStyles(index)} onClick={() => {
            hideMask();
            setCurrentIndex(index);
          }} key={`tab:${index}`}>
              {title}
            </View>)}
        </View>
      </View>
      
      
      {isShowArrow ? <View className={selectorStyles}>
          <ScrollView scrollIntoView={`tab${currentIndex}`} scrollX className={tabWrapperStyles} scrollWithAnimation>
            {tab.map((title, index) => <Text id={`tab${index}`} className={tabTextStyles(index, true)} onClick={() => setCurrentIndex(index)} key={`tab:${index}`}>
                {title.length > 4 ? `${title.substr(0, 4)}...` : title}
              </Text>)}
          </ScrollView>
          {!!tab.length && <Image onClick={showMask} className="arrowIcon" src="https://jiayixueyuan.oss-cn-shenzhen.aliyuncs.com/h5/arrow_expand.svg" />}
        </View> : <View className={selectorStyles}>
          <View className={tabWrapperStyles}>
            {tab.map((title, index) => <Text id={`tab${index}`} className={tabTextStyles(index)} onClick={() => setCurrentIndex(index)} key={`tab:${index}`}>
                {title.length > 4 ? `${title.substr(0, 4)}...` : title}
              </Text>)}
          </View>
        </View>}
      <View className={outerScrollViewStyles} onTouchStart={event => {
        startPosition = event.touches[0].pageX;
      }} onTouchMove={event => {
        if (event.touches[0].pageX - startPosition > standard && !hasMoved && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
          hasMoved = true;
        } else if (event.touches[0].pageX - startPosition < -100 && !hasMoved && currentIndex < tab.length - 1) {
          setCurrentIndex(currentIndex + 1);
          hasMoved = true;
        }
      }} onTouchEnd={() => {
        hasMoved = false;
      }}>
        
        <View className="scrollXBlock" style={{
          width: `${tab.length}00vw`,
          transform: `translate(-${currentIndex}00vw)`
        }}>
          {children}
        </View>
      </View>
    </View>;
  }

}

Tab.options = {
  addGlobalClass: true
};
export default Tab;