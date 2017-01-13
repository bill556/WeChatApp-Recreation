/**
 * 新闻页
 */
var util = require('../../utils/util')
var curPageIndex = [1, 1, 1]
var tabInitState = [false, false, false]
var app = getApp()

Page({
  data: {
    newsData: {},
    loadingHidden: false,
    curSelClassifyIndex: 0
  },
  onLoad: function () {
    this.checkInitLoadGankData()
  },
  // 加载新闻数据
  loadGankData: function (pageNo, callback) {
    var classifyName = this.getClassifyName(true)
    wx.request({
      url: app.globalData.baseNewsURL + classifyName + '/' + pageNo + '-' + (pageNo + 20) + '.html',
      header: {
        'Content-Type': 'application/json'
      },
      success: res => {
        var data = res.data;
        if (data[classifyName].length == 0) {
          wx.showToast({
            title: '没有更多数据了...',
            icon: 'loading',
            duration: 2000
          })
        }
        console.log(classifyName)
        callback(data[classifyName]);
      }
    })
  },
  // 滚动到列表底部监听
  onBindscrolltolower: function (e) {
    var curClassifyName = this.getClassifyName()
    this.loadGankData(curPageIndex[this.data.curSelClassifyIndex], results => {
      curPageIndex[this.data.curSelClassifyIndex] = curPageIndex[this.data.curSelClassifyIndex] + 20
      this.data.newsData[curClassifyName] = this.data.newsData[curClassifyName].concat(results)
      this.setData({
        newsData: this.data.newsData
      })
    })
  },
  // swiper 滚动改变监听
  onBindchange: function (e) {
    this.setData({
      curSelClassifyIndex: e.detail.current
    })
    this.checkInitLoadGankData()
  },
  // 分类点击监听
  onTitleBarsClick: function (e) {
    this.setData({
      curSelClassifyIndex: parseInt(e.target.dataset.index)
    })
  },
  // 获取分类名称
  getClassifyName: function (isApiName) {
    switch (this.data.curSelClassifyIndex) {
      case 0:
        return isApiName ? 'T1348649580692' : 'tech'
      case 1:
        return isApiName ? 'T1348654060988' : 'car'
      case 2:
        return isApiName ? 'T1348649776727' : 'digital'
    }
  },
  // 检查初始化加载新闻数据（根据不同类别）
  checkInitLoadGankData: function () {
    if (tabInitState[this.data.curSelClassifyIndex]) return
    var curClassifyName = this.getClassifyName()
    this.loadGankData(0, results => {
      curPageIndex[this.data.curSelClassifyIndex] = 20
      this.data.newsData[curClassifyName] = results
      this.setData({
        loadingHidden: true,
        newsData: this.data.newsData
      })
      tabInitState[this.data.curSelClassifyIndex] = true
    })
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '新闻',
      desc: 'From 163.com',
      path: '/page/user?id=123'
    }
  }
})
