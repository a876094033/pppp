
<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="用户名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入用户名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="queryParams.password"
          placeholder="请输入密码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入邮箱"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input
          v-model="queryParams.realName"
          placeholder="请输入真实姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证首段" prop="firstCardNum">
        <el-input
          v-model="queryParams.firstCardNum"
          placeholder="请输入身份证首段"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证尾号" prop="lastCardNum">
        <el-input
          v-model="queryParams.lastCardNum"
          placeholder="请输入身份证尾号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="总金额" prop="amountAll">
        <el-input
          v-model="queryParams.amountAll"
          placeholder="请输入总金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-permisaction="['members:members:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permisaction="['members:members:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permisaction="['members:members:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="membersList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户名" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="密码" align="center" prop="password" :show-overflow-tooltip="true" />
      <el-table-column label="手机号" align="center" prop="phone" :show-overflow-tooltip="true" />
      <el-table-column label="邮箱" align="center" prop="email" :show-overflow-tooltip="true" />
      <el-table-column label="真实姓名" align="center" prop="realName" :show-overflow-tooltip="true" />
      <el-table-column
        label="身份证首段"
        align="center"
        prop="firstCardNum"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="身份证尾号"
        align="center"
        prop="lastCardNum"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="总金额" align="center" prop="amountAll" :show-overflow-tooltip="true" />
      <el-table-column
        label="冻结金额"
        align="center"
        prop="amountFrozen"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="可用金额" align="center" prop="amountUsed" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permisaction="['members:members:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-permisaction="['members:members:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="form.name" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="密码" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="真实姓名" />
        </el-form-item>
        <el-form-item label="身份证首段" prop="firstCardNum">
          <el-input v-model="form.firstCardNum" placeholder="身份证首段" />
        </el-form-item>
        <el-form-item label="身份证尾号" prop="lastCardNum">
          <el-input v-model="form.lastCardNum" placeholder="身份证尾号" />
        </el-form-item>
        <el-form-item label="总金额" prop="amountAll">
          <el-input v-model="form.amountAll" placeholder="总金额" />
        </el-form-item>
        <el-form-item label="冻结金额" prop="amountFrozen">
          <el-input v-model="form.amountFrozen" placeholder="冻结金额" />
        </el-form-item>
        <el-form-item label="可用金额" prop="amountUsed">
          <el-input v-model="form.amountUsed" placeholder="可用金额" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addMembers, delMembers, getMembers, listMembers, updateMembers } from '@/api/members'

export default {
  name: 'Config',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      membersList: [],

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        name:
          undefined,
        password:
          undefined,
        phone:
          undefined,
        email:
          undefined,
        realName:
          undefined,
        firstCardNum:
          undefined,
        lastCardNum:
          undefined,
        amountAll:
          undefined

      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        name:
          [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
        password:
          [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
        phone:
          [
            { required: true, message: '手机号不能为空', trigger: 'blur' }
          ],
        email:
          [
            { required: true, message: '邮箱不能为空', trigger: 'blur' }
          ],
        realName:
          [
            { required: true, message: '真实姓名不能为空', trigger: 'blur' }
          ],
        firstCardNum:
          [
            { required: true, message: '身份证首段不能为空', trigger: 'blur' }
          ],
        lastCardNum:
          [
            { required: true, message: '身份证尾号不能为空', trigger: 'blur' }
          ],
        amountAll:
          [
            { required: true, message: '总金额不能为空', trigger: 'blur' }
          ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listMembers(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.membersList = response.data.list
        this.total = response.data.count
        this.loading = false
      }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {

        id: undefined,
        name: undefined,
        password: undefined,
        phone: undefined,
        email: undefined,
        realName: undefined,
        firstCardNum: undefined,
        lastCardNum: undefined,
        amountAll: undefined,
        amountFrozen: undefined,
        amountUsed: undefined
      }
      this.resetForm('form')
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加Members'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id =
        row.id || this.ids
      getMembers(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改Members'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateMembers(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addMembers(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const Ids = row.id || this.ids
      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delMembers(Ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    }
  }
}
</script>
