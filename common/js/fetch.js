var config = require('./config.js')

// 获取大眼睛
function eye(url) {
  var that = this
    wx.request({
      url: url,
      method: 'GET',
      success: function (res) {
        if (res.data.data && res.data.data.bigeye.length) {
          //console.log(res.data.data.bigeye)
          that.setData({
            pic_url: res.data.data.bigeye
          })
        }
      }
    })
}
// 获取商品列表
function fetchrelease(url, page, zerotype, p_type, city =  config.city) {
  var that = this
  if (that.data.hasMore && !that.data.loading) {
    that.setData({
      loading: true
    })
    wx.request({
      url: url,
      data: {
        p_type: p_type,
        samecity: city,
        zerotype: zerotype,
        p: page,
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        that.setData({
          loading:false,
          showLoading: false,
        })
        if (!res.data.data) {
          that.setData({
            hasMore: false,
          })
          if (page == 1) {
            that.setData({
              is_data: false
            })
          }
        } else {
          //判断是否是第一页
          that.setData({
            release: that.data.page == 1 ? res.data.data: that.data.release.concat(res.data.data),
            page: that.data.page + 1
          })
        }
      }
    })
  }
}
// 大分类
function category(url, gethotcat) {
  var that = this
  wx.request({
    url: url,
    method: 'GET',
    success: function (res) {
      if (res.data.data) {
        that.setData({
          navLeftItems: res.data.data,
          curNav: parseInt(res.data.data[0].id),
          curIndex: 0  
        })
        gethotcat()
      }
    }
  })
}
// 小分类
function hotcat(url,pid) {
  var that = this
  wx.request({
    url: url,
    method: 'GET',
    data:{
      pid: pid
    },
    success: function (res) {
      if (res.data.data) {
        that.setData({
          navRightItems: res.data.data
        })
      }
    }
  })
}
// 我的发布
function mypublish(url, page, p_type) {
  var that = this
  if (that.data.hasMore && !that.data.loading) {
    that.setData({
      loading: true
    })
    wx.request({
      url: url,
      data: {
        type: p_type,
        p: page,
      },
      success: function (res) {
        that.setData({
          loading: false,
          showLoading: false
        })
        if (!res.data.data) {
          that.setData({
            hasMore: false,
          })
          if (page == 1) {
            that.setData({
              is_data: false
            })
          }
        } else {
          that.setData({
            mypublish: that.data.mypublish.concat(res.data.data),
            page: that.data.page + 1,
          })
        }
      }
    })
  }
}
function basicparams(cat_id,url,cb){
  var that = this
  wx.request({
    url: url,
    method: 'GET',
    data: {
      cate_id: cat_id
    },
    success: function (res) {
      if (res.data.data.param.color) {
        that.setData({
          color: res.data.data.param.color
        })
      };
      if (res.data.data.param.gb) {
        that.setData({
          gb: res.data.data.param.gb
        })
      };
      if (res.data.data.param.yxnc) {
        that.setData({
          yxnc: res.data.data.param.yxnc
        })
      };
      if (res.data.data.param.qd) {
        that.setData({
          qd: res.data.data.param.qd
        })
      };
      if (res.data.data.param.zcwl) {
        that.setData({
          zcwl: res.data.data.param.zcwl
        })
      };
      if (res.data.data.abnormal) {
        var abnormal_chk = []
        for (var i in res.data.data.abnormal) {
          abnormal_chk[i] = 0
        }
        that.setData({
          abnormal: res.data.data.abnormal,
          abnormal_chk: abnormal_chk
        })
      }
    }
  })
}


// 获取圈子商品列表
function circlelist(url, p, d_cate, circle_id) {
	var that = this
	if (that.data.hasMore && !that.data.loading) {
		that.setData({
			loading: true
		})
		wx.request({
			url: url,
			data: {
				circle_id: circle_id,
				d_cate: d_cate,
				p: p,
			},
			method: 'GET',
			dataType: 'json',
			success: function (res) {
				that.setData({
					loading: false,
					showLoading: false,
				})
				if (!res.data.data) {
					that.setData({
						hasMore: false,
					})
					if (p == 1) {
						that.setData({
							is_data: false
						})
					}
				} else {
					//判断是否是第一页
					that.setData({
						release: that.data.p == 1 ? res.data.data : that.data.release.concat(res.data.data),
						p: that.data.p + 1
					})
				}
			}
		})
	}
}



//更多圈子
function morecircle(url, page) {
  var that = this
  if (that.data.hasMore && !that.data.loading) {
    that.setData({
      loading: true
    })
    wx.request({
      url: url,
      data: {
        p: page,
      },
      success: function (res) {
        that.setData({
          loading: false,
          showLoading: false
        })
        if (!res.data.data) {
          that.setData({
            hasMore: false,
          })
          if (page == 1) {
            that.setData({
              is_data: false,
            })
          }
        } else {
          if (page == 1) {
            that.setData({
              haveCircle2: true,
            })
          }
          that.setData({
            cricle_list: that.data.cricle_list.concat(res.data.data),
            page: that.data.page + 1,
          })
        }
      }
    })
  }
}

// 获取圈子商品列表
function myCirclePublich(url,dtpage,cir_id,d_cateid,city) {
  var that = this
  if (that.data.dthasMore && !that.data.dtloading) {
    that.setData({
      dtloading: true
    })
    wx.request({
      url: url,
      data: {
        circle_id: cir_id,
        d_cate: d_cateid,
        tongcheng: city,
        p: dtpage,

      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        that.setData({
          dtloading: false,
          dtshowLoading: false
        })
        if (!res.data.data) {
          that.setData({
            dthasMore: false,
          })
          if (that.data.dtpage == 1) {
            that.setData({
              is_data: false
            })
          } 
        } else {
          //判断是否是第一页
          if (that.data.dtpage == 1) {
            that.setData({
              is_data: true
            })
          } 
          that.setData({
            myCirclePublishList: that.data.dtpage == 1 ? res.data.data : that.data.myCirclePublishList.concat(res.data.data),
            dtpage: that.data.dtpage + 1
          })
        }
      }
    })
  }
}



module.exports = {
  fetchrelease: fetchrelease,
  eye: eye,
  category: category,
  hotcat:hotcat,
  mypublish: mypublish,
  basicparams: basicparams,
	circlelist: circlelist,
  morecircle: morecircle,
  myCirclePublich,myCirclePublich
}


