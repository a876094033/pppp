
<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="ID" prop="diyaId">
        <el-input
          v-model="queryParams.diyaId"
          placeholder="请输入ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label prop="borrowId">
        <el-input
          v-model="queryParams.borrowId"
          placeholder="请输入"
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
          v-permisaction="['borrowdiya:borrowdiya:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permisaction="['borrowdiya:borrowdiya:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permisaction="['borrowdiya:borrowdiya:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="borrowdiyaList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label align="center" prop="borrowId" :show-overflow-tooltip="true" />
      <el-table-column label="地址" align="center" prop="address" :show-overflow-tooltip="true" />
      <el-table-column label="市场价格" align="center" prop="amount" :show-overflow-tooltip="true" />
      <el-table-column label="大小" align="center" prop="size" :show-overflow-tooltip="true" />
      <el-table-column label="LTV" align="center" prop="ltv" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permisaction="['borrowdiya:borrowdiya:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-permisaction="['borrowdiya:borrowdiya:remove']"
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
        <el-form-item label prop="borrowId">
          <el-input v-model="form.borrowId" placeholder />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="地址" />
        </el-form-item>
        <el-form-item label="市场价格" prop="amount">
          <el-input v-model="form.amount" placeholder="市场价格" />
        </el-form-item>
        <el-form-item label="大小" prop="size">
          <el-input v-model="form.size" placeholder="大小" />
        </el-form-item>
        <el-form-item label="LTV" prop="ltv">
          <el-input v-model="form.ltv" placeholder="LTV" />
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
import { addBorrowDiya, delBorrowDiya, getBorrowDiya, listBorrowDiya, updateBorrowDiya } from '@/api/borrow/diya'

export default {
  name: 'Diya',
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
      borrowdiyaList: [],

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        diyaId:
          undefined,
        borrowId:
          undefined

      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        diyaId:
          [
            { required: true, message: 'ID不能为空', trigger: 'blur' }
          ],
        borrowId:
          [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
      }
    }
  },
  created() {
    const borrowId = this.$route.params && this.$route.params.borrowId
    this.queryParams.borrowId = borrowId
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listBorrowDiya(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.borrowdiyaList = response.data.list
        this.total = response.data.count
        this.loading = false
      }
      )
      // this.loading = true
      // listData(this.queryParams).then(response => {
      //   this.dataList = response.data.list
      //   this.total = response.data.count
      //   this.loading = false
      // })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {

        diyaId: undefined,
        borrowId: undefined,
        address: undefined,
        amount: undefined,
        size: undefined,
        ltv: undefined
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
      this.title = '添加BorrowDiya'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.diyaId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const diyaId =
        row.diyaId || this.ids
      getBorrowDiya(diyaId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改BorrowDiya'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.diyaId !== undefined) {
            updateBorrowDiya(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addBorrowDiya(this.form).then(response => {
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
      const Ids = row.diyaId || this.ids
      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delBorrowDiya(Ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    }
  }
}
</script>
