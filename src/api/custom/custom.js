import request from "@/utils/request";

export default {
  // 获取所有客户列表
  getAll(params) {
    return request({
      url: "api/appUser",
      method: "get",
      params
    });
  },
  //新增客户
  add(data) {
    return request({
      url: "api/appUser",
      method: "post",
      data
    });
  },
  edit(data) {
    return request({
      url: "api/appUser",
      method: "put",
      data
    });
  },
  del(ids) {
    return request({
      url: "api/appUser",
      method: "delete",
      data: ids
    });
  },
  //设置密码
  updatePassword(data) {
    return request({
      url: "api/appUser/updatePassword",
      method: "post",
      data
    });
  },

  // 获取售后人员下拉列表
  getPostSaleData(params) {
    return request({
      url: "api/users/aftermarketList",
      method: "get",
      params
    });
  }
};
