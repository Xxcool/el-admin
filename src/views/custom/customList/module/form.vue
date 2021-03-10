<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="800px"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="ID:" prop="userId" v-if="form.userId">
        <el-input
          v-model="form.userId"
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
          >注：填写后可用于手机端登陆，格式为字母+数字，长度为6-20字符</span
        >
      </el-form-item>
      <el-form-item label="客户类型:" prop="userTypeId">
        <el-select
          v-model="form.userTypeId"
          clearable
          size="small"
          placeholder="请选择"
          class="filter-item"
          style="width: 200px;"
        >
          <el-option
            v-for="item in customTypeOptions"
            :key="item.userTypeId"
            :label="item.typeName"
            :value="item.userTypeId"
          />
        </el-select>
        <router-link type="primary" to="/custom/customType" class="tips"><el-link type="primary" :underline="false">创建类型</el-link></router-link>
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

      <el-form-item label="售后人员:" prop="aftermarketId">
        <el-select
          v-model="form.aftermarketId || user.id"
          clearable
          size="small"
          placeholder="请选择"
          class="filter-item"
          style="width: 200px;"
        >
          <el-option
            v-for="item in postSaleOption"
            :key="item.aftermarketId"
            :label="(item.realName ? item.realName : '-') + ' / ' + (item.jobName ? item.jobName : '-')"
            :value="item.aftermarketId"
          />
        </el-select>
      </el-form-item>
      <!-- <label class="leftBorder">设备信息</label>
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
            :label="item.value"
            :value="item.key"
          />
        </el-select>
        <el-button type="primary" style="margin-left: 20px">添加</el-button>
      </div>
      <el-table ref="table">
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
      </el-table> -->
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="crud.cancelCU">
        取消
      </el-button>
      <el-button
        :loading="crud.status.cu === 2"
        type="primary"
        @click="crud.submitCU"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { form } from "@crud/crud";
import crudCustom from "@/api/custom/custom";
import customType from "@/api/custom/type";
import { mapGetters } from 'vuex'

const defaultForm = {
  userId: null,
  userName: null,
  login: null,
  userTypeId: null,
  phone: null,
  email: null,
  aftermarketId: null
};
export default {
  mixins: [form(defaultForm)],
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
      if (!phoneReg.test(value) && value) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!mailReg.test(value) && value) {
        callback(new Error("请输入正确的邮箱"));
      } else {
        callback();
      }
    };
    return {
      customTypeOptions: [],
      postSaleOption: [],
      machineOption: [],
      rules: {
        userId: [{ required: true, message: "", trigger: "blur" }],
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
        phone: [{ validator: checkphone, trigger: "blur" }],
        email: [{ validator: checkEmail, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    this.getAllType();
    this.getPostSaleData();
  },
  methods: {
    getAllType() {
      customType
        .getAll()
        .then(res => {
          this.customTypeOptions = res.content;
        })
        .catch(err => {
          console.log(err.response.data.message);
        });
    },
    getPostSaleData() {
      crudCustom
        .getPostSaleData()
        .then(res => {
          this.postSaleOption = res;
        })
        .catch(err => {
          console.log(err.response.data.message);
        });
    }
  }
};
</script>

<style lang="scss" scope>
.tips {
  margin-left: 10px;
  font-size: 12px;
  color: #999;
}
</style>
