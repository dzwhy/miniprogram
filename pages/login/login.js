
var config = require('../../common/js/config')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
  
  },
  onLoad: function (options) {
    this.setData({
      url: options.url
    })
  },
  getwxuserinfo:function(){
    var that = this
    wx.showLoading({
      title: '',
      mask: 'true',
    })
    wx.checkSession({
      success: function (res) {
        wx.getStorage({
          key:"userinfo",
          success: function (userinfo){
            that.login(userinfo.data, '')
          },
          fail:function()
          {
            wx.login({
              success: res => {
                if (res.code) {
                  var code = res.code
                  wx.getUserInfo({
                    success: function (res) {
                      res['code'] = code
                      that.login('', res)
                    },
                    fail: function () {
                      wx.hideLoading()
                      wx.openSetting({
                        success: function (data) {
                          if (data) {
                            if (data.authSetting["scope.userInfo"] == true) {
                              wx.getUserInfo({
                                success: function (res) {
                                  res['code'] = code
                                  that.login('', res)
                                }
                              })
                            }else{
                              wx.showToast({
                                title: '授权失败',
                              })
                            }
                          }
                        }
                      })
                    }
                  })
                }
              }
            })
          }
        })
      },
      fail: function () {
        wx.login({
          success: res => {
            if (res.code) {
              var code = res.code
              wx.getUserInfo({
                success: function (res) {
                  res['code'] = code
                  that.login('', res)
                },
                fail: function () {
                  wx.openSetting({
                    success: function (data) {
                      if (data) {
                        if (data.authSetting["scope.userInfo"] == true) {
                          wx.getUserInfo({
                            success: function (res) {
                              res['code'] = code
                              that.login('', res)
                            }
                          })
                        }
                      }
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
  },
  login: function (userinfo,wxinfo){
    var that = this
    wx.request({
      url: app.getUrl(config.apiList.wxlogin),
      method: "POST",
      data: {
        userinfo: JSON.stringify(userinfo),
        wxinfo: JSON.stringify(wxinfo),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: resu => {
        wx.hideLoading()
        var data = resu.data
        if (data.status == 1) {
          wx.setStorage({key: "userinfo",data: data.data})
          wx.setStorageSync('uid', data.data.uid)
          wx.setStorageSync('IMaccount', data.data.IMaccount)
          if (wx.getStorageSync('other_pay')){
            app.newGoPay(wx.getStorageSync('other_pay'));
          }
          // app.OnLine()
          var url = that.data.url
          if (url && url !='undefined') {
            url = url.replace(/￥/, '?')
            url = url.replace(/￥/g, '&')
            url = url.replace(/~/g, '=')
            wx.redirectTo({
              url: url
            })
          }else {
            wx.switchTab({
              url: '../index/index'
            })
          }
        } else if (data.status == 2) {
          wx.setStorage({ key: "userinfo", data: data.data })
          wx.setStorageSync('uid', '')
          wx.redirectTo({
            url: '../reg/reg?url=' + that.data.url
          })
        } else {
          wx.showToast({
            title: '授权失败',
          })
        }
      }
    })
  },
})