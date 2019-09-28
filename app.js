//app.js
var config = require('./common/js/config')
var hexMD5 = require('./common/js/md5')
App({
  data: {
    app_name: '闲宝'
  },
  onLaunch: function(options) {
    // wx.navigateTo({
    //   url: 'pages/pay/pay',
    // })
  },
  jump_check: function(url, check, wxappid) {
    var that = this
    if (wxappid) {
      wx.navigateToMiniProgram({
        appId: wxappid,
        path: url,
        success(res) {
          wx.request({
            url: that.getwebUrl(config.apiList.xdbguide),
            data: {
              'wxappid': wxappid
            },
            success: function(res) {
              return true;
            }
          })
        }
      })
    } else {
      var uid = this.getuid()
      if (uid || !check) {
        wx.navigateTo({
          url: url
        })
      } else {
        url = url.replace(/\?/, '￥')
        url = url.replace(/&/g, '￥')
        url = url.replace(/=/g, '~')
        wx.navigateTo({
          url: '../login/login?url=' + url
        })
      }
    }
  },
  djs: function(outtime, cb) {
    var time = []
    var dd = parseInt(outtime / 86400)
    time['d_1'] = parseInt(dd / 10)
    time['d_2'] = dd % 10
    var hh = parseInt(outtime % 86400 / 3600)
    time['h_1'] = parseInt(hh / 10)
    time['h_2'] = hh % 10
    var mm = parseInt(outtime % 86400 % 3600 / 60)
    time['m_1'] = parseInt(mm / 10)
    time['m_2'] = mm % 10
    var ss = parseInt(outtime % 86400 % 3600 % 60)
    time['s_1'] = parseInt(ss / 10)
    time['s_2'] = ss % 10
    typeof cb == "function" && cb(time)
  },
  getUrl: function(url) {
    var uid = this.getuid()
    var t = Date.parse(new Date()) / 1000
    url = url + '?uid=' + uid + '&t=' + t + '&ver=' + config.ver + '&pt=' + config.pt + '&appid=' + config.appid + '&sign=' + this.md5(t, uid)
    return url
  },
  getUrl2: function(url) {
    var uid = this.getuid()
    var t = Date.parse(new Date()) / 1000
    url = url + '&uid=270133' + '&t=' + t + '&ver=' + config.ver + '&pt=' + config.pt + '&appid=' + config.appid + '&sign=' + this.md5(t, uid)
    return url
  },
  getwebUrl: function(url) {
    var uid = this.getuid()
    var t = Date.parse(new Date()) / 1000
    url = url + '&uid=' + uid + '&t=' + t + '&ver=' + config.ver + '&pt=' + config.pt + '&appid=' + config.appid + '&sign=' + this.md5(t, uid)
    return url
  },

  jumpWebUrl: function(tp, op, other = '') {
    var uid = this.getuid()
    var t = Date.parse(new Date()) / 1000
    var url = 'https://wxapp.00k.cn/index.php?tp=' + tp + '&op=' + op + '&uid=' + uid + '&t=' + t + '&ver=' + config.ver + '&pt=' + config.pt + '&appid=' + config.appid + '&sign=' + this.md5(t, uid) + '&' + other
    if (other) {
      url = url + '&other=' + other
    }
    return url
  },

  md5: function(t, uid) {
    return hexMD5.hexMD5(t + uid + config.key)
  },
  getuid: function() {
    try {
      var uid = wx.getStorageSync('uid')
    } catch (e) {
      var uid = 0
    }
    return uid
  },
  /**
   * 获取存储的用户信息
   */
  getStoreUserInfo: function() {
    try {
      let userInfo = wx.getStorageSync('userinfo');
      return userInfo;
    } catch (e) {
      return false;
    }
  },
  goPay: function(order_id, url_link) {
    var that = this
    wx.checkSession({
      success: function(res) {
        wx.getStorage({
          key: "userinfo",
          success: function(userinfo) {
            that.pay(userinfo.data, '', order_id, url_link)
          },
          fail: function() {
            wx.login({
              success: res => {
                if (res.code) {
                  var code = res.code
                  wx.getUserInfo({
                    success: function(res) {
                      res['code'] = code
                      that.pay('', res, order_id, url_link)
                    },
                    fail: function() {
                      wx.openSetting({
                        success: function(data) {
                          if (data) {
                            if (data.authSetting["scope.userInfo"] == true) {
                              wx.getUserInfo({
                                success: function(res) {
                                  res['code'] = code
                                  that.pay('', res, order_id, url_link)
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
      fail: function() {
        wx.login({
          success: res => {
            if (res.code) {
              var code = res.code
              wx.getUserInfo({
                success: function(res) {
                  res['code'] = code
                  that.pay('', res, order_id, url_link)
                },
                fail: function() {
                  wx.openSetting({
                    success: function(data) {
                      if (data) {
                        if (data.authSetting["scope.userInfo"] == true) {
                          wx.getUserInfo({
                            success: function(res) {
                              res['code'] = code
                              that.pay('', res, order_id, url_link)
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
  pay: function(userinfo, wxinfo, order_id, url_link) {
    var that = this
    wx.request({
      url: that.getUrl(config.apiList.goPay),
      data: {
        userinfo: JSON.stringify(userinfo),
        wxinfo: JSON.stringify(wxinfo),
        order_id: order_id,
        payway: 2,
        url_link: url_link
      },
      success: function(res) {
        console.log('支付');
        console.log(res.data.data);
        if (res.data.data) {
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp + '',
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            paySign: res.data.data.paySign,
            signType: res.data.data.signType,
            success: function(res) {
              wx.redirectTo({
                url: '../paysuccess/paysuccess?order_id=' + order_id,
              })
            },
            fail: function(res) {
              wx.redirectTo({
                url: url_link + '?order_id=' + order_id,
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            confirmText: '知道了',
          })
        }
      }
    })
  },
  /**
   * 支付前检测登录状态
   */
  newGoPay: function(payData = {}) {
    {
      var that = this
      wx.checkSession({
        success: function(res) {
          wx.getStorage({
            key: "userinfo",
            success: function(res) {
              Object.assign(payData, {
                user_id: res.data.uid
              })
              that.newPay(payData);
            },
            fail: function() {
              wx.navigateTo({
                url: '../../pages/login/login',
              })
            }
          })
        },
        fail: function() {
          wx.navigateTo({
            url: '../../pages/login/login',
          })
        }
      })
    }
  },
  newPay: function(payData = {}) {
    let that = this;

    if (that.checkPayData(payData)) {
      config.appid = payData.appid;
      let url = that.getUrl(payData.url);
      delete payData.url;
      wx.request({
        url: url,
        data: payData,
        success: function(res) {
          let response = res.data;
          if (response.status == 1) {
            let responseData = response.data;
            wx.requestPayment({
              timeStamp: responseData.timeStamp,
              nonceStr: responseData.nonceStr,
              package: responseData.package_str,
              signType: 'RSA',
              paySign: responseData.paySign,
              success: function(res) {
                wx.showModal({
                  title: '提示',
                  content: '支付成功',
                  showCancel: false,
                  success: function(res) {
                    let payData = wx.getStorageSync('other_pay');
                    if (payData) {
                      payData.is_pay = 1;

                      wx.setStorageSync('other_pay', payData);
                      wx.navigateTo({
                        url: '../../pages/pay/pay',
                      })
                    } else {
                      wx.navigateTo({
                        url: '../../pages/paysuccess/paysuccess?order_id=' + responseData.order_id,
                      })
                    }
                  }
                })
              },
              fail: function(res) {
                wx.removeStorageSync('other_pay');
                wx.navigateTo({
                  url: '../../pages/payfail/payfail',
                })
              }
            })
          } else {
            that.alertModal('提示', response.msg);
          }
        },
      })
    }
  },
  /**
   * 支付数据检测
   */
  checkPayData: function(payData = {}) {
    let that = this;
    if (!payData.hasOwnProperty('price') || payData.price < 1) {
      that.alertModal('订单异常', '订单价格异常');
      return false;
    }
    if (!payData.hasOwnProperty('user_id') || !payData.user_id) {
      that.alertModal('订单异常', '缺少用户信息');
      return false;
    }
    if (!payData.hasOwnProperty('url') || !payData.url) {
      return false;
    }
    if (!payData.hasOwnProperty('appid')) {
      that.alertModal('订单异常', '未指定设备');
      payData.appid = 0;
    }
    if (payData.appid == 0 && (!payData.hasOwnProperty('publish_id') || !payData.publish_id)) {
      that.alertModal('订单异常', '未指定商品');
      return false;
    }
    return payData;
  },
  /**
   * 发起登录，存储登录数据
   */
  autoLogin: function(params = {}) {
    if (typeof params != 'object') {
      throw 'autologin params type error';
    }
    let that = this,
      userinfo = '',
      wxinfo = '';
    if (!params.hasOwnProperty('wxinfo') && !params.hasOwnProperty('userinfo')) {
      return false;
    }
    if (!params.wxinfo && !params.userInfo) {
      return false;
    }
    if (params.hasOwnProperty('userinfo')) {
      userinfo = params.userinfo;
    }
    if (params.hasOwnProperty('wxinfo')) {
      wxinfo = params.wxinfo;
    }


    wx.request({
      url: that.getUrl(config.apiList.wxlogin),
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
          wx.setStorage({
            key: "userinfo",
            data: data.data
          })
          wx.setStorageSync('uid', data.data.uid)
          wx.setStorageSync('IMaccount', data.data.IMaccount)
          if (params.hasOwnProperty('success') && typeof params.success == 'function') {
            params.success(data.data);
          }
          console.log('登录记录')
          console.log(wx.getStorageSync('uid'))

        } else {
          wx.showToast({
            title: '授权失败',
          })
        }
      }
    })
  },
  /**
   * 弹窗提示
   */
  alertModal: function(title, content) {
    wx.showModal({
      title: title,
      content: content,
    })
  },
  /**
   * 检查登录状态
   */
  isLogin: function() {
    let logined = false;
    return new Promise(resolve => {
        wx.checkSession({
          success: function(res) {
            wx.getStorage({
              key: "userinfo",
              success: function() {
                logined = true;
                resolve(logined)
              },
              fail: function() {
                wx.navigateTo({
                  url: '../../pages/login/login',
                })
              }
            })
          },
          fail: function() {
            wx.navigateTo({
              url: '../../pages/login/login',
            })
          }
        });
      }


    )

  }
})