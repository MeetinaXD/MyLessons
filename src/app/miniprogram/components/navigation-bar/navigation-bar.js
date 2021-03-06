// components/navigation-bar/navigation-bar.js
const { navBarHeight, windowWidth, statusBarHeight } = getApp().globalData
const app = getApp();
const eventBus = app.globalData.eventBus;
const utils = app.globalData.utils

const { pages } = require('../../static/pages')

Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    background: {
      type: String,
      value: "#FFB8C5"
    },
    color: {
      type: String,
      value: "white"
    },
    title: {
      type: String,
      value: "My Lesson"
    }

    // isShowSwitch: {
    //   type: Boolean,
    //   value: true
    // }
  },
  
  lifetimes: {
    attached(){
      const p = getCurrentPages()
      const nowPage = "/" + p[p.length - 1].route
      this.setData({
        pages,
        nowPage
      })

      console.log(nowPage);
    }
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    navBarHeight,
    windowWidth,
    statusBarHeight,

    showMenu: false,
    showMenuLayer: false,

    hiddenOther: false,
    hiddenLayer: false,

    busy: false
  },

  methods: {
    // 显示/隐藏 菜单
    // 控制动画和display none
    // 注意动画时长为0.3s
    async handleMenuClick(){
      if (this.data.busy){
        return ;
      }
      const animationTime = 300 //ms
      const newShowMenu = !this.data.showMenu
      const that = this
      this.setData({ busy: true })
      if (newShowMenu){
        this.setData({ showMenuLayer: true, hiddenOther: true })
        setTimeout(() => {
          that.setData({ hiddenLayer: true })
        }, animationTime)
        // 不加延时微信有bug
        await utils.sleep(100)
        this.setData({ showMenu: true, busy: false })
      } else {
        this.setData({ showMenu: false, hiddenLayer: false, hiddenOther: false })
        await utils.sleep(animationTime)
        this.setData({ showMenuLayer: false, busy: false })
      }
    },

    async handleItemClick(e){
      const { name, url, selected } = e.target.dataset
      if (selected){
        return ;
      }
      this.handleMenuClick()
      await utils.sleep(200)
      wx.redirectTo({
        url: url,
      })
    },

    async handleBarClick(e){
      const { id } = e.target
      if (id === 'title' || !this.data.showMenu){
        return ;
      }
      this.handleMenuClick()
    }
  }
})
