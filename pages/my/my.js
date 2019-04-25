/**
 * 我的
 */
Page({
  data: {
    userInfo: {
    }
  },
  onLoad: function () {
    wx.getUserInfo({
      success: res => {
        this.setData({
          userInfo: res.userInfo,
        })
      }
    })
  },
  onGotUserInfo: function (data) {
    if (data.detail.userInfo) {
      this.setData({
        userInfo: data.detail.userInfo,
      })
    }
  },
})