/*
 * 图片预览
 */
Page({
  data: {
    pic: ''
  },
  onLoad: function (options) {
    this.setData({
      pic: options.pic
    })
  },
  //接受长按事件来下载图片
  imageClick: function (e) {
    if (e.type == "longtap") {
      wx.showModal({
        title: '提示',
        content: '确认下载图片？',
        confirmColor: '#9c978b',
        success: function (res) {
          if (res.confirm) {
            wx.downloadFile({
              url: e.target.id,
              success: function (res) {
                var tempFilePath = res.tempFilePath
                wx.saveFile({
                  tempFilePath: tempFilePath,
                  success: function (res) {
                    var savedFilePath = res.savedFilePath
                    console.log(savedFilePath)
                    wx.showToast({
                      title: '保存成功！',
                      icon: 'success',
                      duration: 2000
                    })
                    wx.getImageInfo({
                      src: savedFilePath,
                      success: function (res) {
                        console.log(res.width)
                        console.log(res.height)
                      },
                      fail: function (res) {
                        console.log(res)
                      },
                      complete: function (res) {
                        console.log(res)
                      }
                    })
                  }
                })
              },
              complete: function (res) {
                console.log(res)
              }
            })
          }
        }
      })
    }
  }
})