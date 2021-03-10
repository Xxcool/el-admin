<template>
  <div style="display: inline-block">
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="title" append-to-body width="450px" @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="88px">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" style="width: 200px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import { isvalidPhone } from '@/utils/validate'
import { editUser } from '@/api/system/user'
export default {
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      loading: false, dialog: false, title: '修改手机号', form: { phone: '' },
      form: {},
      rules: {
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.form = { id: this.user.id, nickName: this.user.nickName, gender: this.user.gender, phone: this.form.phone }
      console.log(this.form)
      if (this.$refs['form']) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            editUser(this.form).then(() => {
              this.loading = false
              this.resetForm()
              this.$notify({
                title: '手机号修改成功',
                type: 'success',
                duration: 1500
              })
              store.dispatch('GetInfo').then(() => {})
            }).catch(() => {
              this.loading = false
            })
          }
        })
      }
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { phone: '' }
    }
  }
}
</script>
