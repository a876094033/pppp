
<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="借款名称" prop="borrowName">
        <el-input
          v-model="queryParams.borrowName"
          placeholder="请输入借款名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="利率" prop="interestRate">
        <el-input
          v-model="queryParams.interestRate"
          placeholder="请输入利率"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="借款期限" prop="term">
        <el-input
          v-model="queryParams.term"
          placeholder="请输入借款期限"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="日期类型" prop="termType">
        <el-select v-model="queryParams.termType" placeholder="Borrow日期类型" clearable size="small">
          <el-option
            v-for="dict in termTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="借款金额" prop="amount">
        <el-input
          v-model="queryParams.amount"
          placeholder="请输入借款金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="还款方式" prop="repayType">
        <el-select v-model="queryParams.repayType" placeholder="Borrow还款方式" clearable size="small">
          <el-option
            v-for="dict in repayTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="借款目的" prop="purpose">
        <el-input
          v-model="queryParams.purpose"
          placeholder="请输入借款目的"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="还款人" prop="repayName">
        <el-input
          v-model="queryParams.repayName"
          placeholder="请输入还款人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="抵押" prop="diya">
        <el-input
          v-model="queryParams.diya"
          placeholder="请输入抵押"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资产价值" prop="amountLimit">
        <el-input
          v-model="queryParams.amountLimit"
          placeholder="请输入资产价值"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="借款状态" prop="borrowStatus">
        <el-select
          v-model="queryParams.borrowStatus"
          placeholder="Borrow借款状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in borrowStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-permisaction="['borrow:borrow:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permisaction="['borrow:borrow:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permisaction="['borrow:borrow:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="borrowList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="借款名称" align="center" prop="borrowName" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="{name:'Invest', params: {borrowId:scope.row.id}}" class="link-type">
            <span>{{ scope.row.borrowName }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="利率" align="center" prop="interestRate" :show-overflow-tooltip="true" />
      <el-table-column label="借款期限" align="center" prop="term" :show-overflow-tooltip="true" />
      <el-table-column
        label="日期类型"
        align="center"
        prop="termType"
        :formatter="termTypeFormat"
        width="100"
      >
        <template slot-scope="scope">{{ termTypeFormat(scope.row) }}</template>
      </el-table-column>
      <el-table-column label="借款金额" align="center" prop="amount" :show-overflow-tooltip="true" />
      <el-table-column
        label="还款方式"
        align="center"
        prop="repayType"
        :formatter="repayTypeFormat"
        width="100"
      >
        <template slot-scope="scope">{{ repayTypeFormat(scope.row) }}</template>
      </el-table-column>
      <el-table-column label="借款目的" align="center" prop="purpose" :show-overflow-tooltip="true" />
      <el-table-column label="还款人" align="center" prop="repayName" :show-overflow-tooltip="true" />
      <el-table-column label="抵押" align="center" prop="diya" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="{name:'Diya', params: {borrowId:scope.row.id}}" class="link-type">
            <span>{{ scope.row.diya }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        label="资产价值"
        align="center"
        prop="amountLimit"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="借款状态"
        align="center"
        prop="borrowStatus"
        :formatter="borrowStatusFormat"
        width="100"
      >
        <template slot-scope="scope">{{ borrowStatusFormat(scope.row) }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permisaction="['borrow:borrow:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-permisaction="['borrow:borrow:remove']"
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
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        enctype="multipart/form-data"
      >
        <el-form-item label="借款名称" prop="borrowName">
          <el-input v-model="form.borrowName" placeholder="借款名称" />
        </el-form-item>
        <el-form-item label="利率" prop="interestRate">
          <el-input v-model="form.interestRate" placeholder="利率" />
        </el-form-item>
        <el-form-item label="借款期限" prop="term">
          <el-input v-model="form.term" placeholder="借款期限" />
        </el-form-item>
        <el-form-item label="日期类型" prop="termType">
          <el-select v-model="form.termType" placeholder="请选择">
            <el-option
              v-for="dict in termTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="借款金额" prop="amount">
          <el-input v-model="form.amount" placeholder="借款金额" />
        </el-form-item>
        <el-form-item label="还款方式" prop="repayType">
          <el-select v-model="form.repayType" placeholder="请选择">
            <el-option
              v-for="dict in repayTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="借款目的" prop="purpose">
          <el-input v-model="form.purpose" placeholder="借款目的" />
        </el-form-item>
        <el-form-item label="还款人" prop="repayName">
          <el-input v-model="form.repayName" placeholder="还款人" />
        </el-form-item>
        <el-form-item label="抵押" prop="diya">
          <el-input v-model="form.diya" placeholder="抵押" />
        </el-form-item>
        <el-form-item label="资产价值" prop="amountLimit">
          <el-input v-model="form.amountLimit" placeholder="资产价值" />
        </el-form-item>
        <el-form-item label="借款状态" prop="borrowStatus">
          <el-select v-model="form.borrowStatus" placeholder="请选择">
            <el-option
              v-for="dict in borrowStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-upload
          ref="upload"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleFileSuccess"
          :file-list="fileList"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addBorrow, delBorrow, getBorrow, listBorrow, updateBorrow } from '@/api/borrow/borrow'
import { getToken } from '@/utils/auth'
export default {
  name: 'Config',
  // components: { borrowAvatar },
  data() {
    return {
      fileList: [],
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
      borrowList: [],
      termTypeOptions: [], repayTypeOptions: [], borrowStatusOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        borrowName:
          undefined,
        interestRate:
          undefined,
        term:
          undefined,
        termType:
          undefined,
        amount:
          undefined,
        repayType:
          undefined,
        purpose:
          undefined,
        repayName:
          undefined,
        diya:
          undefined,
        amountLimit:
          undefined,
        borrowStatus:
          undefined

      },
      // 上传图片参数
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/api/v1/borrow/upload'
      },
      // 表单参数
      form: {
        borrowImg: ''
      },
      // 表单校验
      rules: {
        borrowName:
          [
            { required: true, message: '借款名称不能为空', trigger: 'blur' }
          ],
        interestRate:
          [
            { required: true, message: '利率不能为空', trigger: 'blur' }
          ],
        term:
          [
            { required: true, message: '借款期限不能为空', trigger: 'blur' }
          ],
        termType:
          [
            { required: true, message: '日期类型不能为空', trigger: 'blur' }
          ],
        amount:
          [
            { required: true, message: '借款金额不能为空', trigger: 'blur' }
          ],
        repayType:
          [
            { required: true, message: '还款方式不能为空', trigger: 'blur' }
          ],
        purpose:
          [
            { required: true, message: '借款目的不能为空', trigger: 'blur' }
          ],
        repayName:
          [
            { required: true, message: '还款人不能为空', trigger: 'blur' }
          ],
        diya:
          [
            { required: true, message: '抵押不能为空', trigger: 'blur' }
          ],
        amountLimit:
          [
            { required: true, message: '资产价值不能为空', trigger: 'blur' }
          ],
        borrowStatus:
          [
            { required: true, message: '借款状态不能为空', trigger: 'blur' }
          ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('borrow_period').then(response => {
      this.termTypeOptions = response.data
    })

    this.getDicts('repay_type').then(response => {
      this.repayTypeOptions = response.data
    })

    this.getDicts('borrow_status').then(response => {
      this.borrowStatusOptions = response.data
    })
  },
  methods: {

    /** 查询参数列表 */
    getList() {
      this.loading = true
      listBorrow(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.borrowList = response.data.list
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
        borrowName: undefined,
        interestRate: undefined,
        term: undefined,
        termType: undefined,
        amount: undefined,
        repayType: undefined,
        purpose: undefined,
        repayName: undefined,
        diya: undefined,
        amountLimit: undefined,
        borrowStatus: undefined
      }
      this.resetForm('form')
    },
    termTypeFormat(row) {
      return this.selectDictLabel(this.termTypeOptions, row.termType)
    },
    repayTypeFormat(row) {
      return this.selectDictLabel(this.repayTypeOptions, row.repayType)
    },
    borrowStatusFormat(row) {
      return this.selectDictLabel(this.borrowStatusOptions, row.borrowStatus)
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
      this.title = '添加借款'
      this.isEdit = false
      this.fileList = []
      this.form.borrowImg = ''
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
      getBorrow(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改借款'
        this.isEdit = true
        // this.form.borrowImg = ""
        var fileBool = !!response.data.borrowImg
        if (fileBool === true) {
          this.form.borrowImg = response.data.borrowImg
          var fileArr = response.data.borrowImg.split(',')
          fileArr.pop()
          this.fileList = []
          fileArr.forEach((item, index, array) => {
            this.fileList.push({ name: index, url: process.env.VUE_APP_BASE_API + '/' + item })
          })
        }
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateBorrow(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addBorrow(this.form).then(response => {
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
        return delBorrow(Ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    handleRemove(file, fileList) {
      this.form.borrowImg = ''
      fileList.forEach((item, index, array) => {
        var url = item.url.split('/static')
        this.form.borrowImg += 'static' + url[1] + ','
      })

      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleFileSuccess(file) {
      this.form.borrowImg += file.data + ','
      console.log(file)
    }
  }
}
</script>
