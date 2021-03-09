<template>
  <div class="app-container">
    <el-card class="box-card">
      <label class="leftBorder">客户信息</label>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="ID:" prop="id" v-if="form.id">
          <el-input
            v-model="form.id"
            size="small"
            clearable
            style="width: 200px;"
            disabled
          />
        </el-form-item>
        <el-form-item label="客户名称:" prop="userName">
          <el-input
            v-model="form.userName"
            size="small"
            clearable
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="用户名:" prop="login">
          <el-input
            v-model="form.login"
            size="small"
            clearable
            style="width: 200px;"
          />
          <span class="tips"
            >注：填写后可用于手机端登陆，格式为字母加数字，长度为6-20字符</span
          >
        </el-form-item>
        <el-form-item label="客户类型:" prop="userType">
          <el-select
            v-model="form.userTypeId"
            clearable
            size="small"
            placeholder="请选择"
            class="filter-item"
            style="width: 200px;"
          >
            <el-option
              v-for="item in customClassifyOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input
            v-model="form.phone"
            size="small"
            clearable
            style="width: 200px;"
          />
          <span class="tips">填写后可用于手机端登陆</span>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input
            v-model="form.email"
            size="small"
            clearable
            style="width: 200px;"
          />
          <span class="tips">填写后可用于手机端登陆</span>
        </el-form-item>

        <el-form-item label="售后人员:" prop="postSale">
          <el-select
            v-model="form.postSale"
            clearable
            size="small"
            placeholder="请选择"
            class="filter-item"
            style="width: 200px;"
          >
            <el-option
              v-for="item in postSaleOption"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <label class="leftBorder">设备信息</label>
      </el-form>
      <div style="margin: 20px 0">
        <el-select
          v-model="form.machine"
          clearable
          size="small"
          placeholder="请选择机器型号"
          class="filter-item"
          style="width: 200px;"
        >
          <el-option
            v-for="item in machineOption"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          />
        </el-select>
        <el-button type="primary" style="margin-left: 20px">添加</el-button>
      </div>
      <el-table ref="table" style="width: 60%;">
        <el-table-column type="selection" width="55" />
        <el-table-column
          :show-overflow-tooltip="true"
          prop="number"
          label="序号"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          prop="img"
          label="机器人图片"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          prop="type"
          label="机器型号"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          prop="code"
          label="机器标识码"
        />
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission" />
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import api from "@/api/custom/custom";
import CRUD from '@crud/crud'
export default {
  data() {
    var checkLogin = (rule, value, callback) => {
      let loginReg = /^[0-9a-zA-Z]*$/;
      if (value == "") {
        callback(new Error("请输入用户名"));
      } else if (!loginReg.test(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    var checkphone = (rule, value, callback) => {
      let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
      if (!phoneReg.test(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!mailReg.test(value)) {
        callback(new Error("请输入正确的邮箱"));
      } else {
        callback();
      }
    };
    return {
      form: {},
      customClassifyOptions: [],
      postSaleOption: [],
      machineOption: [],
      rules: {
        id: [{ required: true, message: "", trigger: "blur" }],
        userName: [{ required: true, message: "客户名称", trigger: "blur" }],
        login: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "用户名长度在6-20个字符",
            trigger: "blur"
          },
          { validator: checkLogin, trigger: "blur" }
        ],
      }
    };

  },
  created() {
      this.form.id = this.$route.query.id
  },
  methods: {
    cancel() {},
    save() {
        const params = this.form;
      api.add(params).then(res => {
        this.crud.notify('执行成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
  }
};
</script>
<style lang="scss" scope>
.el-form {
  margin-top: 20px;
}
.tips {
  margin-left: 20px;
  font-size: 12px;
  color: #999;
}
.robot {
  margin: 20px 0 20px 50px;
  .el-checkbox__label {
    padding-left: 0;
  }
  .el-checkbox__input {
    position: absolute;
    top: 10px;
  }
}
.goods {
  width: 200px;
  text-align: center;
  img {
    width: 100%;
  }
}
.equipment {
  height: 100% !important;
}
.footer {
  width: 30%;
  text-align: center;
  margin-top: 20px;
}
</style>
