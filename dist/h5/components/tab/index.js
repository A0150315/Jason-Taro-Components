import Nerv from "nervjs";
import { useState, useCallback, useEffect, useMemo } from "@tarojs/taro-h5";
import { View, Text, Image, ScrollView } from '@tarojs/components';
import classNames from 'classnames';
import { getEnv } from "../../utils/utils";
import styles from './index.scss';
let startPosition = 0;
const standard = 100;
let hasMoved = false;

class Tab extends Taro.Component {
  render() {
    const {
      children: children
    } = this.props;
    const { fixable = false, hasTop = false, className, style, tab = [], getIndex } = this.props;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isShowMore, setIsShowMore] = useState(false);
    const containerStyles = classNames(styles.container, className);
    const selectorStyles = useMemo(() => classNames(styles.selector, {
      [styles.selector_fix]: fixable,
      [styles.selector_paddingTop]: hasTop
    }), [fixable, hasTop]);
    const outerScrollViewStyles = useMemo(() => classNames(styles.outerScrollView, {
      [styles.outerScrollView_padding]: fixable
    }), [fixable]);
    const maskStyles = useMemo(() => classNames(styles.mask, {
      [styles.mask_show]: isShowMore
    }), [isShowMore]);
    const moreBgStyles = useMemo(() => classNames(styles.moreBg, {
      [styles.moreBg_show]: isShowMore
    }), [isShowMore]);
    const tabTextStyles = useCallback(index => classNames(styles.tabText, {
      [styles.tabText__highLight]: index === currentIndex
    }), [currentIndex]);
    const moreTextStyles = useCallback(index => classNames(styles.moreTabText, {
      [styles.moreTabText__highLight]: index === currentIndex
    }), [currentIndex]);
    const showMask = useCallback(() => setIsShowMore(true), []);
    const hideMask = useCallback(() => setIsShowMore(false), []);
    useEffect(() => {
      if (getEnv() !== 'WEAPP' && document.querySelector(`#tab${currentIndex}`)) document.querySelector(`#tab${currentIndex}`).scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
      if (getIndex) getIndex(currentIndex);
      // eslint-disable-next-line
    }, [currentIndex]);
    return <View className={containerStyles} style={style}>
      
      
      <View className={maskStyles} onClick={hideMask} />
      <View className={moreBgStyles}>
        <View className={styles.moreHeader}>
          <Text className={styles.title}>全部分类</Text>
          <Image onClick={hideMask} className={styles.arrowIcon} src="https://jiayixueyuan.oss-cn-shenzhen.aliyuncs.com/h5/arrow_close.svg" />
        </View>
        <View className={styles.moreMain}>
          {tab.map((title, index) => <View className={moreTextStyles(index)} onClick={() => {
            hideMask();
            setCurrentIndex(index);
          }} key={`tab:${index}`}>
              {title}
            </View>)}
        </View>
      </View>
      
      
      <View className={selectorStyles}>
        <ScrollView scrollIntoView={`tab${currentIndex}`} scrollX className={styles.tabWrapper}>
          {tab.map((title, index) => <Text id={`tab${index}`} className={tabTextStyles(index)} onClick={() => setCurrentIndex(index)} key={`tab:${index}`}>
              {title.length > 4 ? `${title.substr(0, 4)}...` : title}
            </Text>)}
        </ScrollView>
        {!!tab.length && <Image onClick={showMask} className={styles.arrowIcon} src="https://jiayixueyuan.oss-cn-shenzhen.aliyuncs.com/h5/arrow_expand.svg" />}
      </View>
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
        
        <View className={styles.scrollXBlock} style={{
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