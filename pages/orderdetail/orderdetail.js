var config = require('../../common/js/config')
const app = getApp()
var interval = ''
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: [],
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id: options.order_id
    })
  },
  onShow: function () {
    this.getdetail(this.data.order_id)
  },
  ship_push:function(){
    var that = this
    if (that.data.detail['mtime_stat']==1){
      var msg = '当前不可催发货'
      wx.showToast({
        title: msg,
      })
      return false
    }else{
      wx.request({
        url: app.getUrl(config.apiList.ship_push),
        data:{
          order_id: that.data.order_id
        },
        success:function(res){
          if(res.data.status==1){
            var msg = '催单成功'
            wx.showToast({
              title: msg,
            })
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              confirmText: '知道了',
            })
          }
        }
      })
    }
  },
  receive_goods:function(){
    var that = this
    wx.showModal({
      title: '是否确认收货？',
      content: '您正在进行确认收货的操作，请确定好商品已收到且完好无损。',
      success: function (res) {
        if (!res.cancel) {
          wx.request({
            url: app.getUrl(config.apiList.receive_goods),
            data: {
              order_id: that.data.order_id
            },
            success: function (res) {
              if (res.data.status == 1) {
                that.getdetail(that.data.order_id)
                var msg = '操作成功'
                wx.showToast({
                  title: msg,
                })
              } else {
                var msg = res.data.msg
                wx.showToast({
                  title: msg,
                })
              }
            }
          })
        }
      }
    })
  },
  order_cancel: function () {
    var that = this
    wx.request({
      url: app.getUrl(config.apiList.order_cancel),
      data: {
        order_id: that.data.order_id
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.getdetail(that.data.order_id)
          var msg = '取消成功'
          wx.showToast({
            title: msg,
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
  getdetail: function (order_id) {
    clearInterval(interval)
    var that = this
    wx.request({
      url: app.getUrl(config.apiList.orderdetail),
      data: {
        order_id: order_id
      },
      success: function (res) {
        if (res.data.status == 1) {
          var outtime = res.data.data.timeout
          if (outtime > 0) {
            var interval = setInterval(function () {
              app.djs(outtime, function (time) {
                if (outtime > 0) {
                  outtime--
                  that.setData({
                    djs: time['d_1'] + time['d_2'] + '天' + time['h_1'] + time['h_2'] + '时' + time['m_1'] + time['m_2'] + '分' + time['s_1'] + time['s_2'] + '秒'
                  })
                } else {
                  clearInterval(interval)
                  that.getdetail(order_id)
                }
              })
            },1000)
          }
          that.setData({
            detail: res.data.data,
          })
          //console.log(res.data.data)
        }
      }
    })
  },
  alert: function () {
    wx.showModal({
      title: '提示',
      content: '请下载二货app进行后续操作',
      showCancel: false,
      confirmText: '知道了',
    })
  },
  jump_check: function (e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    app.jump_check(url, true)
  },
  goPay:function(){
    app.goPay(this.data.detail.id, '../chekupdeal/chekupdeal')
  },
  choice:function(){
    var types = ['当面交易', '快递发货']
    var that = this
    wx.showActionSheet({
      itemList: types,
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            wx.showModal({
              title: '确认当面交易？',
              content: '    建议在公共场合进行交易\r\n   1.双方协商一致为当面交易\r\n   2.当面交易属于用户自发行为，切记双方当面督促一手交货一手点击确认收货，否则钱财两空',
              success:function(res){
                if (!res.cancel) {
                  wx.request({
                    url: app.getUrl(config.apiList.deal),
                    data: {
                      order_id: that.data.order_id
                    },
                    success: function (res) {
                      if (res.data.status == 1) {
                        that.getdetail(that.data.order_id)
                        var msg = '操作成功'
                        wx.showToast({
                          title: msg,
                        })
                        that.getdetail(that.data.order_id)
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
                }
              }
            })
            
          } if (res.tapIndex == 1) {
            app.jump_check('../writeexpre/writeexpre?order_id=' + that.data.order_id, true)
          }
        }
      }
    })
  },
  show_app: function () {
    wx.showModal({
      title: '提示',
      content: '请下载二货app进行后续操作',
      showCancel: false,
      confirmText: '知道了',
    })
  }

})