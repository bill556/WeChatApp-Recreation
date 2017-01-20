/**
 * 妹纸图片列表
 */
var pageNo = 1
var app = getApp()

Page({
  data: {
    girlData: [],
    loadingHidden: false
  },
  onLoad: function () {
    this.loadGankGirlData(results => {
      pageNo = 2
      this.setData({
        loadingHidden: true,
        girlData: results
      })
    })
  },
  //监听滚动到底部自动加载更多
  onBindscrolltolower: function (e) {
    console.log('滚动到底部...')
    this.loadGankGirlData(results => {
      pageNo++
      this.setData({
        girlData: this.data.girlData.concat(results)
      })
    })
  },
  // 获取 gank 的妹纸数据
  loadGankGirlData: function (callback) {
    wx.request({
      url: app.globalData.baseGankURL + pageNo,
      header: {
        'Content-Type': 'application/json'
      },
      success: res => callback(this.convertData(res.data.results))
    })
  },
  // 数据转换
  convertData: function (gankGirlData) {
    var girlDataGroup = []
    gankGirlData.map(girlInfo => {
      girlInfo.url = girlInfo.url.replace('http://ww', 'http://ws')
      var indexT = girlInfo.publishedAt.indexOf("T")
      var indexZ = girlInfo.publishedAt.indexOf(".")
      girlInfo.year = girlInfo.publishedAt.substring(0, indexT)
      girlInfo.time = girlInfo.publishedAt.substring(indexT + 1, indexZ)
      girlDataGroup.push(girlInfo)
    })
    return girlDataGroup
  },
  // 图片点击
  onImageClick: function (e) {
    wx.navigateTo({
      url: '../showpic/showpic?pic=' + e.target.id
    })
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '妹纸',
      desc: 'From Gank.IO',
      path: '/page/user?id=123'
    }
  },
  //下拉刷新 （issue：触发不灵敏，可能是官方BUG，可能是调试状态下不行, android设备列表不展示，iphone可以）
  onPullDownRefresh: function () {
    console.log("下拉刷新")
    wx.showToast({
      title: '正在刷新ing...',
      icon: 'loading',
      duration: 10000
    })
    pageNo = 0
    this.loadGankGirlData(results => {
      pageNo++
      this.setData({
        girlData: results
      })
      wx.hideToast()
    })
  }
})
