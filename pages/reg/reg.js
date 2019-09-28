var config = require('../../common/js/config')
const app = getApp()
var maxTime = 60
var currentTime = maxTime
var step_g=1
var phoneNum = null, identifyCode = null, password = null, rePassword = null, hintMsg = null, interval  =  null
Page({
  /**
   * 页面的初始数据
   */
  data: {
    windowWidth :  0,
    windoeHeight :  0,
    nextButtonWidth:0,
    step: step_g,
    time: currentTime,
  },
  onLoad: function (options) {
    step_g  =  1
    var that  =  this
    wx.getSystemInfo({
      success:  function (res)  {
        that.setData({
          windowWidth :  res.windowWidth,
          windowHeight :  res.windowHeight,
          nextButtonWidth:  res.windowWidth  -  20,
          url: options.url
        })
      }
    }) 
  },
  onUnload: function () {
    currentTime  =  maxTime
    if (interval  !=  null) {
      clearInterval(interval)
    }
  },
  nextStep : function () {
    var that  =  this
    if (step_g  ==  1) {
      if (!checkIsNotNull(phoneNum)) {
        hintMsg = "请输入手机号!"
        return false
      }
      wx.request({
        url: app.getUrl(config.apiList.reg_sms),
        data: {
          phone: phoneNum
        },
        success: function (res) {
          if (res.data.status == 1) {
            step_g = 2
            that.setData({
              step: step_g
            })
            interval = setInterval(function () {
              currentTime--;
              that.setData({
                time : currentTime
              })
              if (currentTime <= 0) {
                clearInterval(interval)
                currentTime = -1
              }
            }, 1000)
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              confirmText: '知道了',
            })
            return false
          }
        }
      })
    } else  if (step_g  ==  2) {
      if (!checkIsNotNull(identifyCode)) {
        hintMsg = "请输入验证码!"
        return false
      }
      step_g = 3
      that.setData({
        step: step_g
      })
      clearInterval(interval)
    } else {
      if (!isContentEqual(password, rePassword)) {
        hintMsg = "两次密码不一致！"
        return false
      }
      wx.getStorage({
        key: "userinfo",
        success: function (userinfo) {
          that.submitPassword(userinfo.data, '', phoneNum, identifyCode, password)
        },
        fail: function () {
          wx.login({
            success: res => {
              if (res.code) {
                var code = res.code
                wx.getUserInfo({
                  success: function (res) {
                    res['code'] = code
                    that.submitPassword('', res, phoneNum, identifyCode, password)
                  }
                })
              }
            }
          })
        }
      })
    }
  },
  input_phoneNum:  function (e) {
    phoneNum  =  e.detail.value
  },
  input_identifyCode:  function (e) {
    identifyCode  =  e.detail.value
  },
  input_password:  function (e) {
    password  =  e.detail.value
  },
  input_rePassword:  function (e) {
    rePassword  =  e.detail.value
  },
  reSendPhoneNum:  function () {
    if (currentTime  <  0) {
      var that  =  this
      currentTime  =  maxTime
      interval  =  setInterval(function () {
        currentTime--
        that.setData({
          time :  currentTime
        })
        if (currentTime  <=  0) {
          currentTime  =  -1
          clearInterval(interval)
        }
      },  1000)
    } else {
      wx.showToast({
        title:  '短信已发到您的手机，请稍后重试!',
        icon :  'loading',
        duration :  700
      })
    }
  },
  submitPassword:function(userinfo, wxinfo, phoneNum, identifyCode, password){
    //此处调用wx中的网络请求的API，完成密码的提交
    var that = this
    wx.showLoading({
        title: '',
        mask: 'true',
    })
    wx.getSystemInfo({
        success: function (res) {
          wx.request({
            url: app.getUrl(config.apiList.reg_reg),
            method: "POST",
            data: {
              userinfo: JSON.stringify(userinfo),
              wxinfo: JSON.stringify(wxinfo),
              systeminfo: JSON.stringify(res),
              phone: phoneNum,
              code: identifyCode,
              pwd: password
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: resu => {
              wx.hideLoading()
              var data = resu.data
              if (data.status == 1) {
                wx.setStorage({ key: "userinfo", data: data.data })
                wx.setStorageSync('uid', data.data.uid)
                wx.setStorageSync('IMaccount', data.data.IMaccount)
                app.OnLine()
                var url = that.data.url
                if (url && url != 'undefined') {
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
              } else {
                wx.showToast({
                  title: data.msg,
                  icon : 'loading',
                  duration : 700
                })
              }
            }
          })
        }
      })
    }
})
function  checkIsNotNull(content) {
  return  (content  &&  content != null)
}
// 检测输入内容  
function  checkPhoneNum(phoneNum) {
  if (!checkIsNotNull(phoneNum)) {
    return  false
  }
  var patrn = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/
  if (!patrn.exec(phoneNum))
  {
    return false
  }
  return  true
}
// 比较两个内容是否相等  
function  isContentEqual(content_1,  content_2) {
  if (!checkIsNotNull(content_1)) {
    return  false
  }
  if (content_1  ===  content_2) {
    return  true
  }
  return  false
}
// 提交［密码］,前一步保证两次密码输入相同  
