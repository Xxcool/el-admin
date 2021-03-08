<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-form :inline="true">
        <el-form-item label="客户名称/账号:" prop="keyword">
          <el-input
            v-model="query.keyword"
            size="small"
            clearable
            placeholder="输入账号"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
        </el-form-item>
        <el-form-item label="客户类型:" prop="userTypeId">
          <el-select
            v-model="query.userTypeId"
            clearable
            size="small"
            placeholder="客户类型"
            class="filter-item"
            @change="crud.toQuery"
          >
            <el-option
              v-for="item in customTypeOptions"
              :key="item.userTypeId"
              :label="item.typeName"
              :value="item.userTypeId"
            />
          </el-select>
        </el-form-item>
        <rrOperation />
      </el-form>
      <crudOperation show="" :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" prop="userId" label="ID" />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="userName"
        label="客户名称"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="login"
        label="用户名/账号"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="userTypeName"
        label="客户类型"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="phone"
        label="手机号"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="email"
        label="邮箱"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="aftermarketName"
        label="售后人员"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createTime"
        label="创建日期"
      />
      <el-table-column label="状态" align="center" prop="state">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            active-value="1"
            inactive-value="0"
            @change="changeEnabled(scope.row, scope.row.state)"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPer(['admin', 'roles:edit', 'roles:del'])"
        label="操作"
        align="center"
        fixed="right"
        width="220"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            style="dispaly: inline-block"
          />
          <el-button
            size="mini" 
            type="success"
            @click="setPassword(scope.row.userId)"
            >设置密码</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />

    <!--表单渲染-->
    <eForm />
    <keep-alive>
      <pwdForm
        :dialogVisible="dialogVisible"
        @close="dialogVisible = false"
        :userId="userId"
      />
    </keep-alive>
  </div>
</template>

<script>
import crudCustom from "@/api/custom/custom";
import customType from "@/api/custom/type";
import eForm from "./module/form";
import pwdForm from "./module/password";
import CRUD, { presenter, header, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import { mapGetters } from "vuex";
export default {
  name: "Custom",
  components: {
    eForm,
    pwdForm,
    pagination,
    crudOperation,
    rrOperation,
    udOperation
  },
  cruds() {
    return CRUD({
      title: "客户",
      url: "api/appUser",
      sort: ["appUserSort,asc", "id,desc"],
      crudMethod: { ...crudCustom }
    });
  },
  mixins: [presenter(), header(), crud()],
  dicts: ["custom_status"],
  data() {
    return {
      customTypeOptions: [],
      permission: {
        add: ["admin", "job:add"],
        edit: ["admin", "job:edit"],
        del: ["admin", "job:del"]
      },
      form: {},
      rules: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      dialogVisible: false,
      userId: null
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  created() {
    this.crud.optShow = {
      add: true,
      del: true,
      reset: true
    };
    this.crud.operationShow = {
      add: true,
      edit: true,
      del: true
    };
    console.log(this.dict);
    this.getAllType();
  },
  methods: {
    getAllType() {
      customType.getAll().then(res => {
          console.log(res);
          this.customTypeOptions = res.content
        })
        .catch(err => {
          console.log(err.response.data.message);
        });
    },
    // 改变状态
    changeEnabled(data, val) {
      console.log(data);
      this.$confirm(
        '此操作将 "' +
          this.dict.label.custom_status[val] +
          '" ' +
          (data.name ? data.name : "") +
          "客户, 是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          crudCustom
            .edit(data)
            .then(() => {
              this.crud.notify(
                this.dict.label.custom_status[val] + "成功",
                "success"
              );
            })
            .catch(err => {
              data.state = !data.state;
              console.log(err.data.message);
            });
        })
        .catch(() => {
          data.state = !data.state;
        });
    },
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id;
    },
    setPassword(id) {
      this.dialogVisible = true;
      this.userId = id;
    }
  }
};
</script>
