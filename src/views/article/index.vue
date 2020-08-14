
<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="文章标题" prop="articcleName">
        <el-input
          v-model="queryParams.articcleName"
          placeholder="请输入文章标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文章类型" prop="articcleType">
        <el-select
          v-model="queryParams.articcleType"
          placeholder="Article文章类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in articcleTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章作者" prop="articleAuthor">
        <el-input
          v-model="queryParams.articleAuthor"
          placeholder="请输入文章作者"
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
          v-permisaction="['article:article:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permisaction="['article:article:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permisaction="['article:article:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="articleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="文章标题"
        align="center"
        prop="articcleName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="文章类型"
        align="center"
        prop="articcleType"
        :formatter="articcleTypeFormat"
        width="100"
      >
        <template slot-scope="scope">{{ articcleTypeFormat(scope.row) }}</template>
      </el-table-column>
      <el-table-column
        label="文章作者"
        align="center"
        prop="articleAuthor"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="文章内容"
        align="center"
        prop="articleContent"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permisaction="['article:article:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-permisaction="['article:article:remove']"
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
        <el-form-item label="文章标题" prop="articcleName">
          <el-input v-model="form.articcleName" placeholder="文章标题" />
        </el-form-item>
        <el-form-item label="文章类型" prop="articcleType">
          <el-select v-model="form.articcleType" placeholder="请选择">
            <el-option
              v-for="dict in articcleTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文章作者" prop="articleAuthor">
          <el-input v-model="form.articleAuthor" placeholder="文章作者" />
        </el-form-item>
        <el-form-item label="文章内容" prop="articleContent">
          <el-input v-model="form.articleContent" type="textarea" :rows="2" placeholder="请输入内容" />
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
import { addArticle, delArticle, getArticle, listArticle, updateArticle } from '@/api/article'

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
      articleList: [],
      articcleTypeOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        articcleName:
          undefined,
        articcleType:
          undefined,
        articleAuthor:
          undefined

      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        articcleName:
          [
            { required: true, message: '文章标题不能为空', trigger: 'blur' }
          ],
        articcleType:
          [
            { required: true, message: '文章类型不能为空', trigger: 'blur' }
          ],
        articleAuthor:
          [
            { required: true, message: '文章作者不能为空', trigger: 'blur' }
          ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('article_type').then(response => {
      this.articcleTypeOptions = response.data
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listArticle(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.articleList = response.data.list
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
        articcleName: undefined,
        articcleType: undefined,
        articleAuthor: undefined,
        articleContent: undefined
      }
      this.resetForm('form')
    },
    articcleTypeFormat(row) {
      return this.selectDictLabel(this.articcleTypeOptions, row.articcleType)
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
      this.title = '添加Article'
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
      getArticle(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改Article'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateArticle(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addArticle(this.form).then(response => {
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
        return delArticle(Ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    }
  }
}
</script>
