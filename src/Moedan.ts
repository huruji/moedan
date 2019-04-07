export interface DanmakuData {
  content?: string,
  time?: number,
  height?: number,
  [key: string]: any
}

export interface Options {
  data?: DanmakuData,
  container?: HTMLElement,
  player: HTMLVideoElement,
  tunnels?: number,
  time?: number,
  danWidth?: number,
  font?: string,
  height?: number
}

export default class Danmaku {
  opts: Options
  data: DanmakuData
  container: HTMLElement
  player: HTMLVideoElement
  danIndex: number
  danmakuTunnelsNum: number
  danTunnel: any
  danShowTime: number
  danWidth: number
  paused: boolean
  showing: boolean
  context: CanvasRenderingContext2D
  constructor(opts: Options) {
    this.opts = opts
    this.data = opts.data || []
    this.container = opts.container
    this.player = opts.player
    this.danIndex = 0
    this.danmakuTunnelsNum = opts.tunnels || 3
    this.danTunnel = {}
    this.danShowTime = opts.time || 6
    this.danWidth = opts.danWidth || opts.container.offsetWidth
    this.paused = false
    // this.show = true
    this.showing = true
    // this.time = opts.time || 0
    this.initContext()
    this.start()
  }

  start() {
    window.requestAnimationFrame(() => this.frame())
  }

  initContext() {
    let font = this.opts.font
    if (!font) font = getComputedStyle(this.container).getPropertyValue('font')
    this.context = document.createElement('canvas').getContext('2d')
    this.context.font = font
  }

  measureText(text: string) {
    return this.context.measureText(text).width
  }

  frame() {
    if (this.data.length && !this.paused && this.showing) {
      let item = this.data[this.danIndex]
      const dan = []
      while (item && this.player.currentTime >= parseFloat(item.barragetime)) {
        dan.push(item)
        item = this.data[++this.danIndex]
      }
      this.draw(dan)
    }
    window.requestAnimationFrame(() => this.frame())
  }

  draw(dan) {
    // const containerHeight = this.container.offsetHeight
    const containerWidth = this.danWidth

    const docFragment = document.createDocumentFragment()
    for (let i = 0, len = dan.length; i < len; i++) {
      const item = document.createElement('div')
      item.classList.add('danmaku_item')
      item.innerHTML = `<span>${dan[i].content}</span>`
      item.addEventListener('animationend', () => {
        this.container.removeChild(item)
      })
      const itemWidth = this.measureText(dan[i].content)
      const tunnel = this.getTunnel(item, itemWidth)
      if (tunnel > -1) {
        item.style.width = `${itemWidth + 1}px`
        item.style.height = `${this.opts.height || 30}px`
        // eslint-disable-next-line
				item.style.top = (tunnel + 1) * 10 + tunnel * (this.opts.height || 30) + 'px'
        item.style.transform = `translateX(-${containerWidth}px)`
        docFragment.appendChild(item)
      }
    }
    this.container.appendChild(docFragment)
  }

  getTunnel(ele, width) {
    const danSpeed = w => (this.danWidth + w) / 6
    const danItemRight = (e) => {
      // eslint-disable-next-line
			const eleWidth = e.offsetWidth || parseInt(getComputedStyle(e).width)
      // eslint-disable-next-line
			const eleRight = e.getBoundingClientRect().right || this.container.getBoundingClientRect().right
      return this.container.getBoundingClientRect().right - eleRight
    }
    for (let i = 0; i < this.danmakuTunnelsNum; i++) {
      const tmp = this.danWidth / danSpeed(width)
      const item = this.danTunnel[`${i}`]
      if (item && item.length) {
        const last = item[item.length - 1]
        const lastRight = danItemRight(last)

        // eslint-disable-next-line
				if (
          lastRight > this.danWidth - tmp * danSpeed(parseInt(getComputedStyle(last).width))
					&& lastRight > 0
        ) {
          this.danTunnel[`${i}`].push(ele)
          ele.addEventListener('animationend', () => {
            this.danTunnel[`${i}`].splice(0, 1)
          })
          return i
        }
      } else {
        this.danTunnel[`${i}`] = [ele]
        ele.addEventListener('animationend', () => {
          this.danTunnel[`${i}`].splice(0, 1)
        })
        return i
      }
    }
    return -1
  }

  play() {
    this.paused = false
    const danmakuEles = document.querySelectorAll('.danmaku_item')
    danmakuEles.forEach((e: HTMLElement) => {
      e.style.animationPlayState = 'running'
      e.style.webkitAnimationPlayState = 'running'
    })
  }

  pause() {
    this.paused = true
    const danmakuEles = document.querySelectorAll('.danmaku_item')
    danmakuEles.forEach((e: HTMLElement) => {
      e.style.animationPlayState = 'paused'
      e.style.webkitAnimationPlayState = 'paused'
    })
  }

  clear() {
    for (let i = 0; i < this.danmakuTunnelsNum; i++) {
      this.danTunnel[`${i}`] = []
    }
    this.container.innerHTML = ''
  }

  reload() {
    this.clear()
    this.danIndex = 0
  }

  show() {
    this.seek()
    this.showing = true
    this.play()
  }

  hide() {
    this.showing = false
    this.pause()
    this.clear()
  }

  seek() {
    this.clear()
    for (let i = 0; i < this.data.length; i++) {
      if (this.player.currentTime <= parseFloat(this.data[i].barragetime)) {
        this.danIndex = i
        return
      }
    }
  }

  send(data, offset = 0) {
    this.data.splice(this.danIndex + offset, 0, data)
  }
}

