var config = require('../../common/js/config')
const app = getApp()
Page({
  data: {
    order_id: '',
    detail: [],
    is_app:0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    let is_app = wx.getStorageSync('app') ? wx.getStorageSync('app'):0;
    that.setData({
      order_id: options.order_id,
      is_app:is_app,
    })
    that.getdetail()
  },
  launchAppError:function(res){
    console.log('打开app失败:');
    console.log(res);
  },
  getdetail: function () {
    var that = this
    wx.request({
      url: app.getwebUrl(config.apiList.jd_orderdetail),
      method: 'GET',
      data: {
        order_id: that.data.order_id
      },
      success: function (res) {
        that.setData({
          detail: res.data.data,
        })
      },
    })
  },
  jump_check: function (e) {
    var data = e.currentTarget.dataset;
    var order_id = data.order_id;
    var a_type = data.a_type?1:0;
    var jd_url = '../checkupdeal/checkupdeal?order_id=' + order_id;
    var url = '../orderdetail/orderdetail?order_id=' + order_id;
    if (a_type == 1) {
      wx.redirectTo({
        url: jd_url,
      })
    } else {
      wx.redirectTo({
        url: url,
      })
    }
  },
  back_index: function () {
    wx.switchTab({
      url: '../index/index',
    })
  }
})