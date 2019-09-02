import { CSSProperties } from 'react'
import Taro, { FunctionComponent, useState, useCallback } from '@tarojs/taro'
import { ScrollView, View } from '@tarojs/components'
import classNames from 'classnames'
import './tab-panel.scss'

const isApp = Taro.getEnv() !== 'WEB'

interface TabPanelProps {
  className?: string
  style?: string | CSSProperties
  children?: any
  onScrollToLower?: () => void
  onPullDown?: () => Promise<any> | void
  disableOnScrollToLower?: boolean
}

let cache: any = true

let isOnScrollToLowerRunning = false

enum PullDownStatus {
  '下拉加载',
  '松开加载',
  '加载中',
  '加载完成',
  '网络连接错误'
}
enum ScrollDownStatus {
  '加载中',
  '左右滑动 查看更多'
}

const sleep = time =>
  new Promise<any>(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })

const Tab: FunctionComponent<TabPanelProps> = ({
  className,
  style,
  children,
  onScrollToLower,
  onPullDown,
  disableOnScrollToLower = false
}) => {
  const [isReadyToPull, setIsReadyToPull] = useState(true)
  const [pullDownBlockHeight, setPullDownBlockHeight] = useState(0)
  const [startPosition, setStartPosition] = useState(-1)
  const [isTouching, setIsTouching] = useState(false)
  const [isLock, setIsLock] = useState(false)
  const [pullDownStatus, setPullDownStatus] = useState(0)
  const [scrollDownStatus, setScrollDownStatus] = useState(1)
  const containerStyles = classNames('scrollYBlock', className)

  const moveHandler = useCallback(
    event => {
      let maxHeight = 0
      if (isApp) {
        maxHeight = 26.6666
      } else if (document.querySelector('html') !== null) {
        maxHeight =
          document.querySelector('html').style.fontSize.slice(0, -2) * 1.0666667
      }

      const time = isApp ? 0.5 : 0.2
      console.log('1', 1)
      let height = (event.touches[0].clientY - startPosition) * time
      if (isApp && height < 0) height = 0

      if (isReadyToPull) {
        if ((pullDownBlockHeight > 0 || height > 0) && startPosition !== -1) {
          event.preventDefault()
        }
        if (!isLock && startPosition !== -1) {
          setPullDownBlockHeight(height)
          if (height / maxHeight > 2) setPullDownStatus(1)
          else setPullDownStatus(0)
        }
      }
    },
    [pullDownBlockHeight, startPosition, isReadyToPull, isLock]
  )

  const touchStartHandler = event => {
    setIsTouching(true)
    if (isReadyToPull) {
      setStartPosition(event.touches[0].clientY)
    }
  }

  const touchEndHandler = useCallback(async () => {
    setIsTouching(false)
    setIsReadyToPull(cache)
    setIsLock(true)
    setStartPosition(-1)

    if (pullDownStatus === 1) {
      setPullDownStatus(2)
      if (onPullDown) {
        try {
          await onPullDown()
          setPullDownStatus(3)
        } catch (err) {
          setPullDownStatus(4)
        }
      } else {
        await sleep(2000)
      }
      await sleep(500)
      setPullDownStatus(0)
    } else if (
      pullDownStatus === 2 ||
      pullDownStatus === 3 ||
      pullDownStatus === 4
    ) {
      return
    }
    setPullDownBlockHeight(0)
    setTimeout(() => {
      setIsLock(false)
    }, 400)
  }, [onPullDown, pullDownStatus])

  const scrollHandler = (event, isTop = false) => {
    cache = isTop ? true : event.detail.scrollTop === 0
    if (isTouching) {
      setIsReadyToPull(false)
    } else {
      setIsReadyToPull(cache)
    }
  }

  return (
    <ScrollView
      onScroll={scrollHandler}
      onTouchMove={moveHandler}
      onTouchStart={touchStartHandler}
      onTouchEnd={touchEndHandler}
      onScrollToUpper={event => scrollHandler(event, true)}
      onScrollToLower={async () => {
        if (disableOnScrollToLower) return
        if (onScrollToLower && !isOnScrollToLowerRunning) {
          isOnScrollToLowerRunning = true
          setScrollDownStatus(0)
          await onScrollToLower()
          setTimeout(() => {
            setScrollDownStatus(1)
            isOnScrollToLowerRunning = false
          }, 500)
        }
      }}
      scrollY
      className={containerStyles}
      style={style}
    >
      <View
        style={{
          height: `${pullDownBlockHeight}${isApp ? 'r' : ''}px`,
          lineHeight: `${pullDownBlockHeight * 1.2}${isApp ? 'r' : ''}px`
        }}
        className={`${'pullDownBlock'} ${
          isTouching ? '' : 'pullDownBlock_withTransition'
        }`}
      >
        {PullDownStatus[pullDownStatus]}
      </View>
      <View className={isLock || pullDownBlockHeight > 0 ? 'listBlock' : ''}>
        {children}
      </View>
      <View className='bottomText'>{ScrollDownStatus[scrollDownStatus]}</View>
    </ScrollView>
  )
}

Tab.options = {
  addGlobalClass: true
}

export default Tab
