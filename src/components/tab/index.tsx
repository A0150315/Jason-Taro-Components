import { CSSProperties } from 'react'
import Taro, {
  FunctionComponent,
  useState,
  useCallback,
  useEffect,
  useMemo
} from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import classNames from 'classnames'
import { getEnv } from 'utils/utils'
import './index.scss'

interface TabProps {
  className?: string
  style?: string | CSSProperties
  children?: any
  tab: string[]
  getIndex?: (index: number) => void
  fixable?: boolean
  hasTop?: boolean
}

let startPosition = 0
const standard = 100
let hasMoved = false

const Tab: FunctionComponent<TabProps> = ({
  fixable = false,
  hasTop = false,
  className,
  style,
  children,
  tab = [],
  getIndex
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isShowMore, setIsShowMore] = useState(false)
  const containerStyles = classNames('container', className)

  const selectorStyles = useMemo(
    () =>
      classNames('selector', {
        ['selector_fix']: fixable,
        ['selector_paddingTop']: hasTop
      }),
    [fixable, hasTop]
  )

  const outerScrollViewStyles = useMemo(
    () =>
      classNames('outerScrollView', {
        ['outerScrollView_padding']: fixable
      }),
    [fixable]
  )

  const maskStyles = useMemo(
    () =>
      classNames('mask', {
        ['mask_show']: isShowMore
      }),
    [isShowMore]
  )
  const moreBgStyles = useMemo(
    () =>
      classNames('moreBg', {
        ['moreBg_show']: isShowMore
      }),
    [isShowMore]
  )

  const tabTextStyles = useCallback(
    index =>
      classNames('tabText', {
        ['tabText__highLight']: index === currentIndex
      }),
    [currentIndex]
  )
  const moreTextStyles = useCallback(
    index =>
      classNames('moreTabText', {
        ['moreTabText__highLight']: index === currentIndex
      }),
    [currentIndex]
  )

  const showMask = useCallback(() => setIsShowMore(true), [])
  const hideMask = useCallback(() => setIsShowMore(false), [])

  useEffect(() => {
    if (getEnv() !== 'WEAPP' && document.querySelector(`#tab${currentIndex}`))
      document.querySelector(`#tab${currentIndex}`).scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    if (getIndex) getIndex(currentIndex)
    // eslint-disable-next-line
  }, [currentIndex])

  return (
    <View className={containerStyles} style={style}>
      {/* {isShowMore && ( */}
      {/* <View className={"moreContainer"}> */}
      <View className={maskStyles} onClick={hideMask} />
      <View className={moreBgStyles}>
        <View className='moreHeader'>
          <Text className='title'>全部分类</Text>
          <Image
            onClick={hideMask}
            className='arrowIcon'
            src='https://jiayixueyuan.oss-cn-shenzhen.aliyuncs.com/h5/arrow_close.svg'
          />
        </View>
        <View className='moreMain'>
          {tab.map((title, index) => (
            <View
              className={moreTextStyles(index)}
              onClick={() => {
                hideMask()
                setCurrentIndex(index)
              }}
              key={`tab:${index}`}
            >
              {title}
            </View>
          ))}
        </View>
      </View>
      {/* </View> */}
      {/* )} */}
      <View className={selectorStyles}>
        <ScrollView
          scrollIntoView={`tab${currentIndex}`}
          scrollX
          className='tabWrapper'
        >
          {tab.map((title, index) => (
            <Text
              id={`tab${index}`}
              className={tabTextStyles(index)}
              onClick={() => setCurrentIndex(index)}
              key={`tab:${index}`}
            >
              {title.length > 4 ? `${title.substr(0, 4)}...` : title}
            </Text>
          ))}
        </ScrollView>
        {!!tab.length && (
          <Image
            onClick={showMask}
            className='arrowIcon'
            src='https://jiayixueyuan.oss-cn-shenzhen.aliyuncs.com/h5/arrow_expand.svg'
          />
        )}
      </View>
      <View
        className={outerScrollViewStyles}
        onTouchStart={event => {
          startPosition = event.touches[0].pageX
        }}
        onTouchMove={event => {
          if (
            event.touches[0].pageX - startPosition > standard &&
            !hasMoved &&
            currentIndex > 0
          ) {
            setCurrentIndex(currentIndex - 1)
            hasMoved = true
          } else if (
            event.touches[0].pageX - startPosition < -standard &&
            !hasMoved &&
            currentIndex < tab.length - 1
          ) {
            setCurrentIndex(currentIndex + 1)
            hasMoved = true
          }
        }}
        onTouchEnd={() => {
          hasMoved = false
        }}
      >
        {/* 列表 */}
        <View
          className='scrollXBlock'
          style={{
            width: `${tab.length}00vw`,
            transform: `translate(-${currentIndex}00vw)`
          }}
        >
          {children}
        </View>
      </View>
    </View>
  )
}

Tab.options = {
  addGlobalClass: true
}

export default Tab
