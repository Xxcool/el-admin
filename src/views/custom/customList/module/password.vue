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
      :inline="true"
      :model="form"
      :rules="rules"
      size="small"
      label-width="100px"
    >
		<el-form-item>
			<p>初始密码为：keenon123456</p>
			<p>客户忘记密码后可手动输入密码</p>
		</el-form-item>
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
      <el-button type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import crudCustom from "@/api/custom/custom";
import CRUD, { crud } from "@crud/crud";
export default {
  mixins: [crud()],
  props: ["dialogVisible", "userId"],
  data() {
    return {
      rules: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      form: {}
    };
  },
  methods: {
    onClose() {
      this.$emit("close");
    },

    submit() {
      const data = {
        userId: this.userId,
        password: this.form.password
      };
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
    }
  }
};
</script>
