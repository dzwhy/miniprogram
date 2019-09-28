var url= 'https://xz.3z.cc/',
  host= 'https://wxapp.00k.cn/';
module.exports = {
  
  ver: '1.1.0',
  key: 'qXynXF0VwvmKUmRGoC6l4zg5RqCZ0Lhn',
  pt: 3,
  appid: 0,
  apiList: {
    baiduMap: 'https://api.map.baidu.com/geocoder/v2/',
    eye: host+'wxxcx/homezone/recommed',
    release: host +'wxxcx/newsale_list/newsale_list',
    my: host +'wxxcx/my/get_userinfo',
    wxlogin: host +'wxxcx/thirdparty/thirdparty',
    reg_sms: host +'wxxcx/send_sms/reg',
    reg_reg: host +'wxxcx/thirdparty/bindthird',
    sellorder: host +'wxxcx/my_orders/sale_list',
    buyorder: host +'wxxcx/my_orders/buy_list',
    orderdetail: host +'wxxcx/my_orders/order_detail',
    ship_push: host +'wxxcx/my_orders/ship_push',
    receive_goods: host +'wxxcx/my_orders/receive_goods',
    unbind: host +'accounts/unbind',
    bank_list: host +'wxxcx/accounts/bank_list',
    goPay: host +'wxxcx/use_alipay/',
    order_cancel: host +'wxxcx/my_orders/order_cancel',
    deal: host +'wxxcx/my_orders/deal',
    collect: host +'wxxcx/collect/add',
    uncollect: host +'wxxcx/collect/abolish',
    get_dj: host +'wxxcx/uid_account/get_dj',
    yp_sale: host + 'wxxcx/zy_goods',
    gen_order:host+'wxxcx/genorder/index',
    //'wxxcx/zy_goods',//优品特惠
  },
}