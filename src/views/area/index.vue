
<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label prop="areaId">
        <el-input
          v-model="queryParams.areaId"
          placeholder="请输入"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="区域名称" prop="areaName">
        <el-input
          v-model="queryParams.areaName"
          placeholder="请输入区域名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上级区域" prop="parentId">
        <el-input
          v-model="queryParams.parentId"
          placeholder="请输入上级区域"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="区域级别" prop="levelId">
        <el-select v-model="queryParams.levelId" placeholder="Area区域级别" clearable size="small">
          <el-option
            v-for="dict in levelIdOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="邮编" prop="postcode">
        <el-input
          v-model="queryParams.postcode"
          placeholder="请输入邮编"
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
          v-permisaction="['area:area:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permisaction="['area:area:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permisaction="['area:area:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="areaList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label align="center" prop="areaId" :show-overflow-tooltip="true" />
      <el-table-column label="区域名称" align="center" prop="areaName" :show-overflow-tooltip="true" />
      <el-table-column label="上级区域" align="center" prop="parentId" :show-overflow-tooltip="true" />
      <el-table-column
        label="区域级别"
        align="center"
        prop="levelId"
        :formatter="levelIdFormat"
        width="100"
      >
        <template slot-scope="scope">{{ levelIdFormat(scope.row) }}</template>
      </el-table-column>
      <el-table-column label="邮编" align="center" prop="postcode" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permisaction="['area:area:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-permisaction="['area:area:remove']"
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
        <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="form.areaName" placeholder="区域名称" />
        </el-form-item>
        <el-form-item label="上级区域" prop="parentId">
          <el-input v-model="form.parentId" placeholder="上级区域" />
        </el-form-item>
        <el-form-item label="区域级别" prop="levelId">
          <el-select v-model="form.levelId" placeholder="请选择">
            <el-option
              v-for="dict in levelIdOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="邮编" prop="postcode">
          <el-input v-model="form.postcode" placeholder="邮编" />
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
import { addArea, delArea, getArea, listArea, updateArea } from '@/api/area'

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
      areaList: [],
      levelIdOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        areaId:
          undefined,
        areaName:
          undefined,
        parentId:
          undefined,
        levelId:
          undefined,
        postcode:
          undefined

      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        areaId:
          [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
        areaName:
          [
            { required: true, message: '区域名称不能为空', trigger: 'blur' }
          ],
        parentId:
          [
            { required: true, message: '上级区域不能为空', trigger: 'blur' }
          ],
        levelId:
          [
            { required: true, message: '区域级别不能为空', trigger: 'blur' }
          ],
        postcode:
          [
            { required: true, message: '邮编不能为空', trigger: 'blur' }
          ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('area_level').then(response => {
      this.levelIdOptions = response.data
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listArea(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.areaList = response.data.list
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

        areaId: undefined,
        areaName: undefined,
        parentId: undefined,
        levelId: undefined,
        postcode: undefined
      }
      this.resetForm('form')
    },
    levelIdFormat(row) {
      return this.selectDictLabel(this.levelIdOptions, row.levelId)
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
      this.title = '添加Area'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.areaId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const areaId =
        row.areaId || this.ids
      getArea(areaId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改Area'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.areaId !== undefined) {
            updateArea(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addArea(this.form).then(response => {
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
      const Ids = row.areaId || this.ids
      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delArea(Ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    }
  }
}
</script>
