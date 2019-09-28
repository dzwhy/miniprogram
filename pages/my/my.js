var config = require('../../common/js/config')
const app = getApp()
Page({
  data: {
    flag: true,
    my_list: [{
      icon: "../../dist/images/ico_18.png",
      title: "购买订单",
      url: "../sellorder/sellorder?from=1"
    }, ],
    avaImg: "",
    name: "",
    time: "",
    money: "",
    msgNum: 0
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    var uid = that.data.uid
    console.log('用户信息');
    console.log(JSON.stringify(app.getStoreUserInfo()));
    if (!uid) {
      that.getinfo();
    }
  },
  jump_check: function(e) {
    var now_uid = app.getuid();
    wx.request({
      url: app.getUrl(config.apiList.get_dj),
      data: {
        c_uid: now_uid
      },
      success: function(res) {
        if (res.data.data.status != 0) {
          wx.showModal({
            title: '提醒',
            content: res.data.data.msg,
            showCancel: false,
          })
        } else {
          var data = e.currentTarget.dataset;
          var url = data.url
          app.jump_check(url, true)
        }
      }
    })
  },
  getinfo: function() {
    var that = this
    wx.request({
      url: app.getUrl(config.apiList.my),
      success: function(res) {
        var data = res.data
        if (data.status == 1 && data.data.id) {
          that.setData({
            avaImg: data.data.avater,
            name: data.data.username,
            time: data.data.days,
            money: data.data.money,
            uid: data.data.id
          })
        } else {
          if (that.data.flag) {
            that.setData({
              flag: false
            })
            wx.navigateTo({
              url: '../login/login'
            })
          } else {
            that.setData({
              flag: true
            })
            wx.switchTab({
              url: '../index/index'
            });
          }
        }
      }
    })
  },
  clearStorage: function() {
    wx.showModal({
      title: '操作提醒',
      content: '确定清理本地缓存及授权信息？',
      success: function(res) {
        if (res.confirm) {
          wx.clearStorage()
          try {
            wx.clearStorageSync()
          } catch (e) {

          }
          wx.switchTab({
            url: '../index/index',
          })
        }
      }
    })
  },
  onShareAppMessage: function() {
    return {
      //title: this.data.shareinfo.title,
      path: '/pages/index/index',
      //imageUrl: this.data.shareinfo.s_img,
    }
  },
})