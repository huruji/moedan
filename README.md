# moedan
简单实用的弹幕引擎

## How to use
```bash
npm i moedan -S
```

```js
import Moedan from 'moedan'

const danmakuDada = [
  {
    content: '666',
    time: 1.22
  },
  {
    content: 'did a good job',
    time: 8.90
  }
]
const player = document.querySelector('video.myvoideo')
const Danmaku = new Moedan({
  data: danmakuData,
  container: document.querySelector('.danmaku_container'),
  player
})

player.addEventListener('play', () => {
  Danmaku.play()
})

```

## 参数

实例化 `Moedan` 的参数

### container

type: `HTMLElement`

存放弹幕元素的容器元素

### data

type: `Array`

弹幕数据，数据格式需包含 `time` 和 `content` 属性，分别代表弹幕在视频的时间和内容

```js
[
  {
    content: '666',
    time: 1.22
  },
  {
    content: 'did a good job',
    time: 8.90
  }
]
```

### player

type: `HTMLElement`

对应的视频元素

### tunnels

type: `Number`

default: 3

出现弹幕的轨道数量

### time

type: `Number`

default: 6

一条弹幕从出现到消失的时间，单位：秒

## API

### Danmaku.clear()

清除弹幕

```js
Danmaku.clear()
```


### Danmaku.hide()

隐藏弹幕，一般和隐藏弹幕按钮一块使用

### Danmaku.pause()

暂停弹幕，应该和视频一起播放

```js
Player.addEventListener('pause', () => Danmaku.play())
```

### Danmaku.play()

播放弹幕，应该和视频一起播放

```js
Player.addEventListener('play', () => Danmaku.play())
```

### Danmaku.reload()

重新 load 弹幕，应该和视频重播一起使用

```js
Player.addEventListener('ended', () => Danmaku.reload())
```

### Danmaku.seek()

重新定位弹幕，一般和拖动播放器进度条一起使用

```js
// when update video's currentTime
Danmaku.seek()
```

### Danmaku.show()

显示弹幕，一般和显示弹幕按钮一块使用


