import request from "@/utils/request";

export default {
  // 获取所有客户类型列表
  getAll(params) {
    return request({
      url: "api/appUserType",
      method: "get",
      params
    });
  },
  //新增客户类型
  add(data) {
    return request({
      url: "api/appUserType",
      method: "post",
      data
    });
  },
  edit(data) {
    return request({
      url: "api/appUserType",
      method: "put",
      data
    });
  },
  del(ids) {
    return request({
      url: "api/appUserType",
      method: "delete",
      data: ids
    });
  },
  // 获取所有客户类型列表
  getAllEnabledList(params) {
    return request({
      url: "api/appUserType/getAllEnabledList",
      method: "get",
      params
    });
  }
};
