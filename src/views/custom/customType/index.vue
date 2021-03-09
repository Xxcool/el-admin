<template>
  <div class="app-container">
    <div class="head-container">
      <crudOperation :permission="permission" />
    </div>
    <!-- 表单渲染 -->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="520px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="类型名称" prop="typeName">
          <el-input v-model="form.typeName" style="width: 380px;" />
        </el-form-item>

        <!-- 客户类型权限暂时不做 -->
        <!-- <el-form-item label="权限" prop="permission">
          <el-collapse accordion style="width: 380px;">
            <el-collapse-item title="缩起">
              444
            </el-collapse-item>
          </el-collapse>
        </el-form-item> -->

        <el-form-item label="说明：" prop="description">
          <el-input
            v-model="form.description"
            style="width: 380px;"
            rows="5"
            type="textarea"
          />
        </el-form-item>

        <el-form-item label="状态" prop="state">
          <!-- <el-radio
            v-for="item in dict.type_status"
            :key="item.id"
            v-model="form.state"
            :label="item.value"
            >{{ item.label }}</el-radio
          > -->
          <el-radio-group v-model="form.state">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="crud.cancelCU">取消</el-button>
        <el-button
          :loading="crud.status.cu === 2"
          type="primary"
          @click="crud.submitCU"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column label="序号">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="typeName"
        label="类型名称"
      />
      
			<el-table-column :show-overflow-tooltip="true" prop="description" label="说明">
        <template slot-scope="scope">
          {{ scope.row.description || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <!-- <pagination /> -->
  </div>
</template>

<script>
import customType from "@/api/custom/type";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import rrOperation from "@crud/RR.operation";
import udOperation from "@crud/UD.operation";
import pagination from "@crud/Pagination";
import { mapGetters } from "vuex";

const defaultForm = {
  typeName: null,
  state: '1',
  description: null
};

export default {
  name: "customType",
  components: { pagination, crudOperation, rrOperation, udOperation },
  cruds() {
    return CRUD({
      title: "客户类型",
      url: "api/appUserType",
      crudMethod: { ...customType }
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ["type_status"],
  data() {
    return {
      customClassifyOptions: [],
      permission: {
        add: ["admin", "custom:add"],
        edit: ["admin", "custom:edit"],
        del: ["admin", "custom:del"]
      },
      rules: {
        typeName: [
          { required: true, message: "请输入类型名称", trigger: "blur" }
          //   { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  created() {
    this.crud.optShow = {
      add: true,
      del: true
    };
  },
  methods: {
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id;
    }
  }
};
</script>
