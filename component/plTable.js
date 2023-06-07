let plTableCom = Vue.component('pltable-com', {
  template: `<div>
  <ux-grid
    ref="plxTable"
    :height="height"
    size="mini"
    v-loading="tableloading"
    :cell-class-name="rowcellstyle"     
    :cell-style="cellstyle"
    :row-class-name="rowstyle"
    :checkbox-config="{ checkMethod: selectInit, highlight: true,showHeader:ismultiple }"
    :tree-config="{transform: true,expandAll:false}"
    widthResize
    @table-body-scroll="scroll"
    @selection-change="handleSelectionChange"
    @row-click="handlerowclick"
    @select-all="handleSelectionChange"
    @row-dblclick="handleRowdbClick"
    show-header-overflow="ellipsis"
    @sort-change="sortchange"
  >
    <ux-table-column
      :reserve-selection="true"
      type="checkbox"
      width="45"
      :key="'-1'+Math.random()"
      v-if="hasselect"
    ></ux-table-column>
    <ux-table-column
      v-if="showindex"
      type="index"
      min-width="60"
      :key="'-2'+Math.random()"
      title="序号"
    ></ux-table-column>
    <ux-table-column
      v-for="(x, z) in tableheader"
      :key="z+Math.random()"
      :resizable="true"
      show-overflow
      :sortable="x.sortable == 'custom' ? true : false"
      :field="x.prop"
      :title="x.label"
      :align="x.align"
      :min-width="x.width"
      :fixed="x.fix"
      :tree-node="z==0?true:x.treeNode?x.treeNode:false"
    >
      <template v-if="x.children">
        <ux-table-column
          :field="i.prop"
          :title="i.label"
          v-for="(i, k) in x.children"
          :align="i.align"
          show-overflow
          :label-class-name="updateStyle(i.isLook, i.isedit)"
          :key="k"
          :min-width="i.width"
          :fixed="x.fix"
        >
          <template slot-scope="scope">
            <span v-if="i.active">
              <span
                v-for="(x2, index2) in i.active"
                :key="index2"
              >
                <span
                  v-show="x2.condition ? x2.condition(scope.row) : true"
                  size="mini"
                  :style="{
                    margin: '0 5px',
                    color: x2.color,
                    cursor: 'pointer',
                  }"
                  @click.stop="
                    operation(
                      x2.methods,
                      scope.row,
                      scope.row[i.prop],
                      i.prop,
                      scope.$rowIndex
                    )
                  "
                >{{ x2.name }}</span>
              </span>
            </span>
            <span v-else-if="i.button">
              <el-button
                v-show="o.condition ? o.condition(scope.row) : true"
                v-for="(o, key) in i.button"
                plain
                :key="key"
                @click.stop="
                  operation(
                    o.methods,
                    scope.row,
                    scope.row[i.prop],
                    i.prop,
                    scope.$rowIndex
                  )
                "
                :type="o.type"
                :circle="o.circle"
                :icon="o.icon"
              >
                <template v-show="o.name">
                  {{ o.name }}
                </template>
              </el-button>
            </span>
            <span v-else-if="i.render && !i.component">{{
              i.render(scope.row)
            }}</span>
            <span v-else-if="i.routerName">
              <a
                :style="{
                  color: theme,
                  'text-decoration': 'underline',
                  cursor: 'pointer',
                }"
                @click="handleActive(scope.row, i.routerName)"
              >
                <span
                  v-if="!i.format"
                  v-html="scope.row[i.prop]"
                ></span>
                <span v-else>{{
                  i.format(scope.row[i.prop], scope.row)
                }}</span>
              </a>
            </span>
            <span v-else-if="i.component">
              <span v-if="scope.row['update']">
                <span v-if="
                    i.component.type == 'input' && i.component.inputChange
                  ">
                  <el-input
                    v-model="scope.row[i.prop]"
                    :type="i.component.inputType || 'text'"
                    size="mini"
                    :rows="1"
                    @change="
                      operation(
                        i.component.inputChange,
                        scope.row,
                        scope.row[i.prop],
                        i.prop,
                        scope.$rowIndex
                      )
                    "
                  >
                  </el-input>
                </span>
                <span v-else-if="i.component.inputType == 'number'">
                  <el-input
                    v-model="scope.row[i.prop]"
                    @input="
                      operation(
                        i.component.methods,
                        scope.row,
                        scope.row[i.prop],
                        i.prop,
                        scope.$rowIndex
                      )
                    "
                    type="number"
                    size="mini"
                  ></el-input>
                </span>
                <span v-else-if="
                    i.component.type == 'input' &&
                    i.component.inputType != 'number'
                  ">
                  <el-input
                    v-model="scope.row[i.prop]"
                    :type="i.component.inputType || 'text'"
                    size="mini"
                    :rows="1"
                  ></el-input>
                </span>
                <span v-else-if="
                    i.component.type == 'select' && i.component.selectChange
                  ">
                  <el-select
                    filterable
                    clearable
                    :multiple="i.component.multiple"
                    value-key="label"
                    v-model="scope.row[i.prop]"
                    size="mini"
                    @change="
                      operation(
                        i.component.methods,
                        scope.row,
                        scope.row[i.prop],
                        i.prop,
                        scope.$rowIndex
                      )
                    "
                  >
                    <el-option
                      v-for="x2 in scope.row[i.component.prop]"
                      :key="x2.value"
                      :label="x2.label"
                      :value="x2"
                    ></el-option>
                  </el-select>
                </span>
                <span v-else-if="i.component.type == 'select'">
                  <el-select
                    filterable
                    clearable
                    :multiple="i.component.multiple"
                    v-model="scope.row[i.prop]"
                    size="mini"
                    placeholder
                  >
                    <el-option
                      v-for="x2 in scope.row[i.component.prop]"
                      :key="x2.value"
                      :label="x2.label"
                      :value="x2.value"
                    ></el-option>
                  </el-select>
                </span>
                <span v-else-if="i.component.type == 'date'">
                  <el-date-picker
                    size="mini"
                    @change="
                      operation(
                        i.component.methods,
                        scope.row,
                        scope.row[i.prop],
                        i.prop,
                        scope.$rowIndex
                      )
                    "
                    v-model="scope.row[i.prop]"
                    type="date"
                    editable
                    clearable
                    placeholder="选择日期"
                    :picker-options="getPickerTime(scope.row)"
                    value-format="yyyy-MM-dd"
                    style="width: 100%"
                  ></el-date-picker>
                </span>
                <span v-else-if="i.component.type == 'datetime'">
                  <el-date-picker
                    size="mini"
                    @change="
                      operation(
                        i.component.methods,
                        scope.row,
                        scope.row[i.prop],
                        i.prop,
                        scope.$rowIndex
                      )
                    "
                    v-model="scope.row[i.prop]"
                    type="datetime"
                    editable
                    clearable
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd HH:mm"
                    format="yyyy-MM-dd HH:mm"
                    style="width: 100%"
                  ></el-date-picker>
                </span>
                <span v-else-if="i.component.type == 'time'">
                  <el-time-select
                    size="mini"
                    style="width:100%"
                    v-model="scope.row[i.prop]"
                    :picker-options="{
  start: '00:00',
  step: '00:15',
  end: '24:00'
}"
                    :placeholder="i.placeholder"
                  >
                  </el-time-select>
                </span>
                <span v-else-if="i.component.type == 'checkbox'">
                  <el-checkbox v-model="scope.row[i.prop]"></el-checkbox>
                </span>
                <span v-else-if="i.component.type == 'switch'">
                  <el-switch
                    v-model="scope.row[i.prop]"
                    :active-color="i.component.activeColor"
                    :inactive-color="i.component.inactiveColor"
                    :active-value="i.component.activeValue"
                    :inactive-value="i.component.inactiveValue"
                  ></el-switch>
                </span>
                <span v-else-if="i.component.type == 'autocomplete'">
                  <el-autocomplete
                    size="mini"
                    v-model="scope.row[i.prop]"
                    :fetch-suggestions="
                      (queryString, cb) => {
                        fetchsuggertions(
                          queryString,
                          cb,
                          i.component.methods
                        );
                      }
                    "
                    @select="
                      (item) => getRemote(row, item, i.component.methods)
                    "
                  >
                    <template slot-scope="{ item }">
                      <div style="border-bottom: 1px dashed #8c8e8e">
                        <el-form
                          label-width="100px"
                          inline
                        >
                          <el-form-item
                            style="margin-bottom: 5px"
                            :label="i.component.label"
                          ><span style="color: orange">{{
                              item[i.component.prop]
                            }}</span>
                          </el-form-item>
                          <el-form-item
                            style="margin-bottom: 5px"
                            :label="i.component.label2"
                          ><span style="color: orange">{{
                              item[i.component.prop2]
                            }}</span>
                          </el-form-item>
                        </el-form>
                      </div>
                    </template>
                  </el-autocomplete>
                </span>
                <span v-else-if="i.component.type == 'tag'">
                  <el-tag
                    class="table_tag"
                    @click.stop.native="i.component.handleClick(scope.row)"
                  >
                    {{ scope.row[i.prop] }}</el-tag>
                </span>
              </span>
              <span
                v-else
                v-html="scope.row[i.propName ? i.propName : i.prop]"
              ></span>
            </span>
            <span v-else-if="i.format">{{
              i.format(scope.row[i.prop], scope.row)
            }}</span>
            <span
              v-else
              v-html="scope.row[i.propName ? i.propName : i.prop]"
            ></span>
          </template>
        </ux-table-column>
        <ux-table-column
          v-if="iseditDel"
          title="操作"
          prop=""
          fixed="right"
          width="85px"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editRow(scope.row,scope.$rowIndex)"
            ></el-button>
            <el-button
              v-show="condition ? condition(scope.row) : true"
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="delRow(scope.row,scope.$rowIndex)"
            ></el-button>
          </template>
        </ux-table-column>
      </template>
      <template slot-scope="scope">
        <span v-if="x.active">
          <span
            v-for="(x2, index2) in x.active"
            :key="index2"
          >
            <span
              v-show="x2.condition ? x2.condition(scope.row) : true"
              size="mini"
              :style="{
                margin: '0 5px',
                color: x2.color,
                cursor: 'pointer',
              }"
              @click.stop="
                operation(
                  x2.methods,
                  scope.row,
                  scope.row[x.prop],
                  x.prop,
                  scope.$rowIndex
                )
              "
            >{{ x2.name }}</span>
          </span>
        </span>
        <span v-else-if="x.button">
          <el-button
            v-show="o.condition ? o.condition(scope.row) : true"
            v-for="(o, key) in x.button"
            :key="key"
            plain
            @click.stop="
              operation(
                o.methods,
                scope.row,
                scope.row[x.prop],
                x.prop,
                scope.$rowIndex
              )
            "
            :type="o.type"
            :circle="o.circle"
            :icon="o.icon"
            size="mini"
          >
            <template v-show="o.name">
              {{ o.name }}
            </template>
          </el-button>
        </span>
        <span v-else-if="x.render">{{ x.render(scope.row) }}</span>
        <span v-else-if="x.routerName">
          <a
            :style="{
              color: theme,
              'text-decoration': 'underline',
              cursor: 'pointer',
            }"
            @click="handleActive(scope.row, x.routerName)"
          >
            <span
              v-if="!x.format"
              v-html="scope.row[x.prop]"
            ></span>
            <span v-else>{{ x.format(scope.row[x.prop], scope.row) }}</span>
          </a>
        </span>
        <span v-else-if="x.component">
          <span v-if="scope.row['update']">
            <span v-if="x.component.type == 'input' && x.component.inputChange">
              <el-input
                v-model="scope.row[x.prop]"
                :type="x.component.inputType || 'text'"
                size="mini"
                :rows="1"
                @change="
                  operation(
                    x.component.inputChange,
                    scope.row,
                    scope.row[x.prop],
                    x.prop,
                    scope.$rowIndex
                  )
                "
              ></el-input>
            </span>
            <span v-else-if="x.component.inputType == 'number'">
              <el-input
                v-model="scope.row[x.prop]"
                @input="
                  operation(
                    x.component.methods,
                    scope.row,
                    scope.row[x.prop],
                    x.prop,
                    scope.$rowIndex
                  )
                "
                type="number"
                size="mini"
              ></el-input>
            </span>
            <span v-else-if="
                x.component.type == 'input' &&
                x.component.inputType != 'number'
              ">
              <el-input
                v-model="scope.row[x.prop]"
                :type="x.component.inputType || 'text'"
                :rows="1"
                size="mini"
              ></el-input>
            </span>
            <span v-else-if="x.component.selectChange">
              <el-select
                filterable
                clearable
                :multiple="x.component.multiple"
                value-key="label"
                v-model="scope.row[x.prop]"
                size="mini"
                @change="
                  operation(
                    x.component.methods,
                    scope.row,
                    scope.row[x.prop],
                    x.prop,
                    scope.$rowIndex
                  )
                "
              >
                <el-option
                  v-for="x2 in scope.row[x.component.prop]"
                  :key="x2.value"
                  :label="x2.label"
                  :value="x2"
                  :disabled="x2.disabled"
                ></el-option>
              </el-select>
            </span>
            <span v-else-if="x.component.type == 'select'">
              <el-select
                v-model="scope.row[x.prop]"
                size="mini"
                :multiple="x.component.multiple"
                filterable
                clearable
              >
                <el-option
                  v-for="x2 in scope.row[x.component.prop]"
                  :key="x2.value"
                  :label="x2.label"
                  :value="x2.value"
                ></el-option>
              </el-select>
            </span>
            <span v-else-if="x.component.type == 'date'">
              <el-date-picker
                size="mini"
                @change="
                  operation(
                    x.component.methods,
                    scope.row,
                    scope.row[x.prop],
                    x.prop,
                    scope.$rowIndex
                  )
                "
                v-model="scope.row[x.prop]"
                type="date"
                editable
                clearable
                placeholder="选择日期"
                :picker-options="getPickerTime(scope.row)"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              ></el-date-picker>
            </span>
            <span v-else-if="x.component.type == 'datetime'">
              <el-date-picker
                size="mini"
                @change="
                  operation(
                    x.component.methods,
                    scope.row,
                    scope.row[x.prop],
                    x.prop,
                    scope.$rowIndex
                  )
                "
                v-model="scope.row[x.prop]"
                type="datetime"
                editable
                clearable
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                style="width: 100%"
              ></el-date-picker>
            </span>
            <span v-else-if="x.component.type == 'time'">
              <el-time-select
                size="mini"
                style="width:100%"
                v-model="scope.row[x.prop]"
                :picker-options="{
  start: '00:00',
  step: '00:15',
  end: '24:00'
}"
                :placeholder="x.placeholder"
              >
              </el-time-select>
            </span>
            <span v-else-if="x.component.type == 'checkbox'">
              <el-checkbox v-model="scope.row[x.prop]"></el-checkbox>
            </span>
            <span v-else-if="x.component.type == 'switch'">
              <el-switch
                v-model="scope.row[x.prop]"
                :active-color="x.component.activeColor"
                :inactive-color="x.component.inactiveColor"
                :active-value="x.component.activeValue"
                :inactive-value="x.component.inactiveValue"
              ></el-switch>
            </span>
            <span v-else-if="x.component.type == 'autocomplete'">
              <el-autocomplete
                size="mini"
                v-model="scope.row[x.prop]"
                :fetch-suggestions="
                  (queryString, cb) => {
                    fetchsuggertions(queryString, cb, x.component.methods);
                  }
                "
                @select="(item) => getRemote(row, item, x.component.methods)"
              >
                <template slot-scope="{ item }">
                  <div style="border-bottom: 1px dashed #8c8e8e">
                    <el-form
                      label-width="100px"
                      inline
                    >
                      <el-form-item
                        style="margin-bottom: 5px"
                        :label="x.component.label"
                      ><span style="color: orange">{{
                          item[x.component.prop]
                        }}</span>
                      </el-form-item>
                      <el-form-item
                        style="margin-bottom: 5px"
                        :label="x.component.label2"
                      ><span style="color: orange">{{
                          item[x.component.prop2]
                        }}</span>
                      </el-form-item>
                    </el-form>
                  </div>
                </template>
              </el-autocomplete>
            </span>
            <span v-else-if="x.component.type == 'tag'">
              <el-tag
                class="table_tag"
                @click.stop.native="x.component.handleClick(scope.row)"
              >
                {{ scope.row[x.prop] }}</el-tag>
            </span>
          </span>
          <span v-else-if="x.component.type=='checkbox'">
            <el-tag
              v-if="scope.row[x.prop] == true"
              size="mini"
              effect="light"
            >是
            </el-tag>
            <el-tag
              v-else
              type="info"
              size="mini"
              effect="light"
            >否
            </el-tag>
          </span>
          <span v-else-if="x.prop == 'Status'">
            <el-tag
              v-if="scope.row.Status == 1"
              size="mini"
              effect="light"
            >启用
            </el-tag>
            <el-tag
              v-else
              type="danger"
              size="mini"
              effect="light"
            >禁用
            </el-tag>
          </span>
          <span
            v-else
            v-html="scope.row[x.propName ?x.propName:x.prop]"
          ></span>
        </span>
        <span v-else-if="x.format">{{
          x.format(scope.row[x.prop], scope.row)
        }}</span>
        <span
          v-else
          v-html="scope.row[x.propName ?x.propName:x.prop]"
        ></span>
      </template>
    </ux-table-column>
    <ux-table-column
      v-if="iseditDel"
      title="操作"
      prop=""
      fixed="right"
      width="85px"
    >
      <template slot-scope="scope">
        <el-button
          type="primary"
          icon="el-icon-edit"
          circle
          size="mini"
          @click="editRow(scope.row,scope.$rowIndex)"
        ></el-button>
        <el-button
          v-show="condition ? condition(scope.row) : true"
          type="danger"
          icon="el-icon-delete"
          circle
          size="mini"
          @click="delRow(scope.row,scope.$rowIndex)"
        ></el-button>
      </template>
    </ux-table-column>
  </ux-grid>
  <div>
   
    <div
      v-if="showpagination"
      class="flex_row_spaceBtn pagination"
    >
      <div v-show="sysid > 0">
        <span
          class="primaryColor cursor"
        >sysid:{{ sysid }}
        </span>
      </div>
      <div>
        <span>共{{ pagination.pageTotal }}条数据</span>
      </div>
    </div>
  </div>
</div>`,
  props: {
    // 传行内样式
    cellstyle: {
      type: Function,
      default: () => {
        return null;
      },
    },
    rowstyle: {
      type: Function,
      default: () => {
        return null;
      },
    },
    rowcellstyle: {
      type: Function,
      default: () => {
        return null;
      },
    },
    showindex: {
      type: Boolean,
      default: false,
    },
    // 固定合并列显示
    fixspanmethods: {
      type: Boolean,
      default: false,
    },
    // 树是否展开
    expandAll: {
      type: Boolean,
      default: false,
    },
    // 是否显示分页
    showpagination: {
      type: Boolean,
      default: true,
    },
    // 查询的时候需要过滤哪个表格的数据
    filtertb: {
      type: Number,
      default: -1,
      required: false,
    },
    //单击是否可编辑
    isedit: {
      type: Boolean,
      default: false,
    },
    //是否合计
    summary: {
      type: Boolean,
      default: false,
    },
    // 是否多选
    ismultiple: {
      type: Boolean,
      default: true,
    },
    // 系统id
    sysid: {
      type: Number,
      default: 0,
    },
    tabledata: {
      type: Array,
      default: function () {
        return [];
      },
    },
    tableheader: {
      type: Array,
      default: function () {
        return [];
      },
    },
    tableloading: {
      type: Boolean,
      default: false,
    },
    // 是否禁用选框
    forbidden: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object,
      default() {
        return {
          pageIndex: 0,
          pagesize: 200,
          pageTotal: 0,
        };
      },
    },
    height: {
      type: String,
      required: false,
      default: "600px",
    },
    rowkey: {
      type: String,
      required: true,
    },
    // 是否单击需要勾选
    isChecked: {
      type: Boolean,
      default: false,
    },
    // 是否有选框
    hasselect: {
      type: Boolean,
      default: false,
    },
    // 是否清除选框
    isclear: {
      type: Boolean,
      default: false,
    },
    // 合并行
    isSpanMethods: {
      type: Boolean,
      default: false,
    },
    // 合并列
    isApanMethods: {
      type: Boolean,
      default: false,
    },
    // 是否出现编辑跟删除
    iseditDel: {
      type: Boolean,
      default: false,
    },
    // 是否显示删除
    condition: {
      type: Function,
      default: function () {
        return true;
      },
    },
    // 表格的下标
    remark: {
      type: Number,
      required: false,
    },
    // 头部黄色，可编辑状态
    yellowHeader: {
      type: Boolean,
      default: false,
    },
    // 头部深蓝色，查看状态
    blueHeader: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      newHeight: window.innerHeight - 172 + 'px',
      singleSelection: {},
      multipleSelection: [],
      getPickerTime(row = {}) {
        return {
          disabledDate(time) {
            if (row.hasOwnProperty("PreStartDate") && row.PreStartDate) {
              return time.getTime() < new Date(row.PreStartDate).getTime();
            }
          },
        };
      },
      spanMethods: [],
      spanarr: [],
      spanarr2: [],
      variable: [], //存取变量名称
      prop: [], // 存取prop
      colspan: [],
      colspanDel: [],
      scrollTop: 0,
      theme: "#409EFF",
      isChangeColor: true,
    };
  },
  methods: {
    // 跳转至页面配置
    toPageSetting() {
      if (this.sysid == 35) {
        this.$emit("oneselftsysid", 35);
      } else {
        this.$router.push({
          name: "FieldInfo",
          params: { ID: this.sysid },
        });
      }
    },
    // 编辑行
    editRow(row, index) {
      this.$emit("editRow", row, index, this.remark);
    },
    // 删除行
    delRow(row, index) {
      this.$emit("delRow", row, index, this.remark);
    },
    // 表头颜色控制
    updateStyle(isLook, isedit) {
      if (isLook) {
        return "fontBlueInkColor";
      }
      if (isedit) {
        return "fontBluesInkColor";
      }
    },
    // 合并取几列
    header() {
      if (this.hasselect) {
        // 仅限没有序号的表格
        // let index = 0;
        // for (var i = 0; i < this.tableheader.length; i++) {
        //   if (this.tableheader[i].isMerge) {
        //     this.spanMethods[index] = i;
        //     this.spanarr2.push([]);
        //     this.spanarr.push([]);
        //     this.prop[index] = this.tableheader[i].prop;
        //     index++;
        //   }
        // }
        // let num2 = 0;
        // this.tableheader.some((x, y) => {
        //   if (x.isMerge && y != this.tableheader.length - 1) {
        //     this.colspanDel.push(y);
        //     num2++;
        //   } else if (x.isMerge && y == this.tableheader.length - 1) {
        //     this.colspanDel.push(y);
        //     this.colspan.push({ start: y - num2, end: y });
        //     return;
        //   } else if (num2) {
        //     this.colspan.push({ start: y - num2, end: y - 1 });
        //     num2 = 0;
        //   }
        // });
      } else {
        let index = 0;
        for (var i = 1; i <= this.tableheader.length; i++) {
          if (this.tableheader[i - 1].isMerge) {
            this.spanMethods[index] = i;
            this.spanarr.push([]);
            this.spanarr2.push([]);
            this.prop[index] = this.tableheader[i - 1].prop;
            index++;
          }
        }

        // 获取从第几列开始合并几项
        let num = 1;
        this.tableheader.some((x, y) => {
          if (x.isMerge && y != this.tableheader.length - 1) {
            this.colspanDel.push(y + 1);
            num++;
          } else if (x.isMerge && y == this.tableheader.length - 1) {
            this.colspanDel.push(y + 1);
            this.colspan.push({ start: y - num + 2, end: y + 1 });
            return;
          } else if (num != 1) {
            this.colspan.push({ start: y - num + 2, end: y });
            num = 1;
          }
        });
      }
    },
    // 滚动
    scroll({ scrollTop, scrollLeft }) {
      this.scrollTop = scrollTop;
    },
    // 合并行数据
    info() {
      let a = JSON.stringify(this.spanarr2);
      let b = JSON.parse(a);
      this.spanarr = b;
      for (var j = 0; j < this.tabledata.length; j++) {
        if (j === 0) {
          for (var i = 0; i < this.spanarr.length; i++) {
            this.spanarr[i].push(1);
            this.variable[i] = 0;
          }
        } else {
          // 判断当前元素与上一个元素是否相同(第1)
          let index = 0;
          for (var x = 0; x < this.prop.length; x++) {
            let prop = this.prop[x];
            if (this.tabledata[j][prop] == this.tabledata[j - 1][prop]) {
              //那个字段要合并就判断上一个和下一个的字段是否相同
              let sign = this.variable[index];
              this.spanarr[index][sign] += 1; //相同就累加
              this.spanarr[index].push(0);
              index++;
            } else {
              this.spanarr[index].push(1); //
              this.variable[index] = j;
              index++;
            }
          }
        }
      }
    },
    // 远程搜索
    fetchsuggertions(val, cb, methods) {
      if (methods) {
        this.$emit(methods, val, cb);
      }
    },
    // 获取远程搜索数据
    getRemote(row, item, methods) {
      if (methods) {
        this.$emit(methods, row, item);
      }
    },
    // row:本行数据 route：要跳转的路由路径 跳转要传的参数routeId
    handleActive(row, routerName) {
      // this.$router.push({
      //   name: routerName.name,
      //   query: { row: row },
      // });
      this.$emit('lookdetails', row);
    },
    // 表格触发事件
    operation(methods, row, val, prop, index) {
      // debugger
      // if (val) {
      //   let value = JSON.parse(JSON.stringify(val));
      //   this.$set(this.tabledata[index], prop, value);
      //   this.$emit("sortchange", 0, 0, this.remark, -100, row, index);
      // }
      if (methods) {
        this.$emit(methods, row, val, prop, index, this.remark, this.filtertb);
      }
    },
    // 选择一页显示多少数据
    pagesize(val) {
      this.$emit("pagesize", val, this.remark, this.filtertb);
    },
    // 分页导航
    pagechange(val) {
      this.$emit("pagechange", val, this.remark, this.filtertb);
    },
    //后端排序
    sortchange(column) {
      //调用父组件方法
      this.$refs.plxTable.clearSelection();
      this.$emit(
        "sortchange",
        column.order,
        column.prop,
        this.remark,
        this.filtertb
      );
    },
    // 单击行
    handlerowclick(row) {
      if (this.isChecked) {
        this.$refs.plxTable.toggleRowSelection([{ row: row, selected: true }]);
      }
      this.$emit("handlerowclick", row, this.remark);
    },
    // 双击行
    handleRowdbClick(row, column) {
      if (this.isedit && !row.update) {
        this.$set(row, "update", true);
      }
      this.$emit("handleRowdbClick", row, this.remark);
    },
    // 选择操作
    handleSelectionChange(val, row) {
      if (this.ismultiple) {
        this.multipleSelection = val;
        this.$emit("selectfun", this.multipleSelection, this.remark, row);
      } else {
        if (val.length > 1) {
          let newRow = val.filter(
            (x) =>
              !this.multipleSelection.some((y) => y.RowNumber == x.RowNumber)
          );
          let oldRow = val.filter((x) =>
            this.multipleSelection.some((y) => y.RowNumber == x.RowNumber)
          );
          this.$refs.plxTable.toggleRowSelection([
            {
              row: oldRow[0],
              selected: false,
            },
          ]);
          this.$refs.plxTable.toggleRowSelection([
            {
              row: newRow[0],
              selected: true,
            },
          ]);
          this.multipleSelection = [];
          this.multipleSelection = newRow;
        } else {
          this.multipleSelection = val;
        }
        this.$emit("selectfun", this.multipleSelection, this.remark, row);
      }
    },
    //合并同一名称
    arraySpanMethod: function ({ row, column, rowIndex, columnIndex }) {
      if (this.isSpanMethods && this.spanMethods) {
        for (let i = 0; i < this.spanMethods.length; i++) {
          let num = this.spanMethods[i];
          if (columnIndex === this.spanMethods[i] && !column.parentId) {
            //第几列合并判断
            const _row = this.spanarr[i][rowIndex];
            const _col = _row > 0 ? 1 : 0;
            return {
              rowspan: _row,
              colspan: _col,
            };
          } else {
            return {
              rowspan: 1,
              colspan: 1,
            };
          }
        }
      } else if (this.fixspanmethods) {
        if (row.Summary) {
          if (row.Summary) {
            if (
              this.colspan.findIndex((t) => {
                return t.start == columnIndex;
              }) != -1
            ) {
              let newIndex = this.colspan.findIndex((t) => {
                return t.start == columnIndex;
              });
              let end = 0;
              end =
                parseInt(this.colspan[newIndex].end) -
                parseInt(this.colspan[newIndex].start) +
                1;
              if (columnIndex) {
                return [1, end];
              }
            } else if (
              this.colspanDel.findIndex((o) => {
                return o == columnIndex;
              }) != -1
            ) {
              if (columnIndex) {
                return [0, 0];
              }
            }
          }
        }
      }
    },
    // 禁用勾选
    selectInit(row) {
      if (this.forbidden) {
        if (row.ProcessGroupID) {
          return true; //可勾选
        } else {
          return false; //不可勾选
        }
      } else if (row.hasOwnProperty("IsSelectInit") == false) {
        return true; //可勾选
      } else if (
        row.hasOwnProperty("IsSelectInit") &&
        row.IsSelectInit == "true"
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
  },
  mounted() {
    this.$refs.plxTable.doLayout(); //解决表格错位
    // this.$refs.plxTable.reloadData(this.tabledata);

  },
  watch: {
    tableheader() {
      if ((this.isSpanMethods || this.fixspanmethods) && this.tableheader) {
        this.header();
      }
    },
    height: {
      handler(newValue, oldValue) {
        this.$set(this, "height", newValue);
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      immediate: true,
      deep: true,
    },
    tabledata() {
      if (this.tabledata) {
        this.$refs.plxTable.reloadData(this.tabledata);
      }
      if (this.tabledata && this.isSpanMethods) {
        this.info();
      }
    },
    isclear: {
      handler(newValue, oldValue) {
        if (newValue) {
          if (this.multipleSelection.length != 0) {
            this.$refs.plxTable.clearSelection();
            this.multipleSelection = [];
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {}
})

// <div
// v-if="showpagination"
// class="flex_row_spaceBtn pagination"
// >
// <div v-show="sysid > 0">
//   <span
//     class="primaryColor cursor"
//   >sysid:{{ sysid }}
//   </span>
// </div>
// <div class="flex">
//   <div
//     class="footer_label"
//     v-show="multipleSelection.length != 0"
//   >
//     已选[<span style="color: red; font-weight: bold">{{
//       multipleSelection.length
//     }}</span>]
//   </div>
//   <el-pagination
//     background
//     @size-change="pagesize"
//     :current-page="pagination.pageIndex"
//     :page-sizes="[
//       13,
//       32,
//       50,
//       100,
//       150,
//       200,
//       250,
//       300,
//       350,
//       400,
//       800,
//       1000,
//       1500,
//       2000,
//     ]"
//     :page-size="pagination.pagesize"
//     :total="pagination.pageTotal"
//     @current-change="pagechange"
//     layout="total, sizes, prev, pager, next,jumper"
//   >
//   </el-pagination>
// </div>
// </div>