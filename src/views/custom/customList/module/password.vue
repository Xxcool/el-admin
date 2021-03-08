<template>
  <!--Form表单-->
  <el-dialog
    :close-on-click-modal="false"
    :before-close="onClose"
    v-if="dialogVisible"
    :visible.sync="dialogVisible"
    title="设置密码"
    append-to-body
    width="450px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="100px"
    >
      <div style="margin: 0 0 20px 50px">
        <p>初始密码为：keenon123456</p>
        <p>客户忘记密码后可手动输入密码</p>
      </div>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          style="width: 220px;"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="submit('form')">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import crudCustom from "@/api/custom/custom";
import CRUD, { crud } from "@crud/crud";
import { encrypt } from '@/utils/rsaEncrypt'
export default {
  mixins: [crud()],
  props: ["dialogVisible", "userId"],
  data() {
    var checkPassword = (rule, value, callback) => {
    //   let reg = /^[0-9a-zA-Z]*$/;
      let reg = reg=/^(([a-z]+[0-9]+)|([0-9]+[a-z]+))[a-z0-9]*$/i;
      if (value == "") {
        callback(new Error("请输入密码"));
      } else if (!reg.test(value)) {
        callback(new Error("密码格式为字母+数字，长度6-20个字符"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "密码长度在6-20个字符",
            trigger: "blur"
          },
          { validator: checkPassword, trigger: "blur" }
        ]
      },
      form: {
        password: null
      }
    };
  },
  methods: {
    onClose() {
      this.$emit("close");
    },

    submit(form) {
      const data = {
        userId: this.userId,
        password: encrypt(this.form.password)
      };
      this.$refs[form].validate(valid => {
        if (valid) {
          crudCustom
            .updatePassword(data)
            .then(res => {
              this.crud.notify("设置成功", CRUD.NOTIFICATION_TYPE.SUCCESS);
              this.$refs["form"].clearValidate();
              this.form = {};
              this.onClose();
            })
            .catch(err => {
              console.log(err.response.data.message);
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
