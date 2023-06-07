let formDialogCom = Vue.component('form-dialog-com', {
  template:
    ` <div class="ces-form">
        <el-dialog
          :title="title"
          :visible.sync="dialogshow"
          width="30%"
          :close-on-click-modal="false"
          :modal-append-to-body="false"
          :before-close="close"
        >
          <el-form
            ref="formdata"
            :model="formdata"
            :rules="formrules"
            label-width="100px"
            class="dialogForm"
          >
            <el-form-item
              v-for="(newItem, index) in formcontroller"
              :key="index"
              :label="newItem.label"
              :prop="newItem.prop"
            >
              <el-input
                size="small"
                v-model="formdata[newItem.prop]"
                v-if="newItem.type == 'input'"
                :type="newItem.inputType || 'text'"
                :rows="1"
                :placeholder="newItem.placeholder"
                :disabled="newItem.disabled"
              >
              </el-input>
              <el-input
                size="small"
                v-model="formdata[newItem.prop]"
                v-else-if="newItem.type == 'dialog'"
                :disabled="newItem.disabled"
                :placeholder="newItem.placeholder"
                @focus="openInnerDialog(newItem.methods)"
              >
                <i
                  slot="suffix"
                  class="el-icon-search"
                ></i>
              </el-input>
              <el-select
                class="fill_width"
                size="small"
                :placeholder="newItem.placeholder"
                v-model="formdata[newItem.prop]"
                v-else-if="newItem.type == 'select'"
                :clearable="true"
                :multiple="newItem.multiple"
                filterable
                :disabled="newItem.disabled"
              >
                <el-option
                  v-for="(item2, index2) in newItem.select"
                  :key="index2"
                  :label="item2.label"
                  :value="item2.value"
                />
              </el-select>
              <el-select
                class="fill_width"
                size="small"
                ref="formTreeRef"
                filterable
                v-else-if="newItem.type == 'selectTree'"
                v-model="formdata[newItem.prop]"
                :placeholder="newItem.placeholder"
                :clearable="true"
              >
                <el-option
                  :value="formdata[newItem.prop]"
                  :label="formdata[newItem.prop]"
                >
                  <el-tree
                    ref="treeRef"
                    :props="newItem.treeProps"
                    :data="newItem.treeData"
                    :expand-on-click-node="false"
                    @node-click="
                      (node, data) => handleClick(node, data, newItem.methods)
                    "
                  ></el-tree>
                </el-option>
              </el-select>
              <el-select
                class="fill_width"
                ref="formTreeloadRef"
                size="small"
                v-else-if="newItem.type == 'selectTreeLoad'"
                v-model="formdata[newItem.prop]"
                :clearable="true"
                filterable
              >
                <el-option
                  :value="formdata[newItem.prop]"
                  :label="formdata[newItem.prop]"
                >
                  <el-tree
                    ref="treeLoadRef"
                    :props="newItem.treeProps"
                    :load="loadNode"
                    lazy
                    :accordion="true"
                    :indent="0"
                    @node-click="selectHandleNodeClick2"
                  ></el-tree>
                </el-option>
              </el-select>
              <el-date-picker
                class="fill_width"
                size="small"
                v-else-if="newItem.type == 'monthDate'"
                v-model="formdata[newItem.prop]"
                value-format="yyyyMM"
                format="yyyy-MM"
                style="width: 100%"
                :disabled="newItem.disabled"
                type="month"
                placeholder="选择月"
              >
              </el-date-picker>
              <el-date-picker
                class="fill_width"
                size="small"
                v-else-if="newItem.type == 'date'"
                v-model="formdata[newItem.prop]"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                :disabled="newItem.disabled"
              />
              <el-autocomplete
                size="small"
                v-else-if="newItem.type=='autocomplete'"
                style="width:100%"
                v-model="formdata[newnewItem.prop]"
                :fetch-suggestions="((queryString,cb)=>{fetchSuggertions(queryString,cb,newnewItem.methods)})"
                @select="item => getRemote(item,newnewItem.methods)"
              >
                <template slot-scope="{ item }">
                  <div style="border-bottom: 1px dashed #8c8e8e;">
                    <el-form
                      label-width="100px"
                      inline
                    >
                      <el-form-item
                        style="margin-bottom:5px"
                        :label="newnewItem.label"
                      ><span style="color:orange">{{ item[newnewItem.prop] }}</span> </el-form-item>
                      <el-form-item
                        style="margin-bottom:5px"
                        :label="newnewItem.label2"
                      ><span style="color:orange">{{ item[newnewItem.prop2]}}</span> </el-form-item>
                    </el-form>
                  </div>
                </template>
              </el-autocomplete>
              <el-switch
                v-model="formdata[newItem.prop]"
                v-else-if="newItem.type == 'switch'"
                :disabled="newItem.disabled"
                :active-color="newItem.activeColor"
                :inactive-color="newItem.inactiveColor"
                :active-value="newItem.activeValue"
                :inactive-value="newItem.inactiveValue"
              />
              <el-time-select
                style="width:100%"
                v-else-if="newItem.type == 'time'"
                v-model="formdata[newItem.prop]"
                :picker-options="{
        start: '00:00',
        step: '00:15',
        end: '24:00'
      }"
                placeholder=""
              >
              </el-time-select>
    
              <el-checkbox
                v-else-if="newItem.type == 'checkbox'"
                v-model="formdata[newItem.prop]"
              ></el-checkbox>
              <el-checkbox-group
                v-else-if="newItem.type == 'checkboxGroup'"
                v-for="(item2, index2) in newItem.checkbox"
                :key="index2"
                v-model="formdata[newItem.prop]"
                :disabled="newItem.disabled"
              >
                <el-checkbox
                  :label="newItem.label"
                  name="type"
                />
              </el-checkbox-group>
              <el-radio-group
                v-else-if="newItem.type == 'radioGroupLabel'"
                v-model="formdata[newItem.prop]"
              >
                <el-radio
                  v-for="(item2, index2) in newItem.radioGroups"
                  :key="index2"
                  :label="item2.value"
                >{{ item2.label }}</el-radio>
              </el-radio-group>
    
              <el-radio-group
                v-else-if="newItem.type == 'radioGroupValue'"
                v-model="formdata[newItem.prop]"
                :disabled="newItem.disabled"
              >
                <el-radio
                  v-for="(item2, index2) in newItem.radioGroups"
                  :key="index2"
                  :label="item2.value"
                />
              </el-radio-group>
              <el-input
                v-model="formdata[newItem.prop]"
                type="textarea"
                v-else-if="newItem.type == 'textarea'"
                :disabled="newItem.disabled"
              />
              <el-upload
                v-else-if="newItem.type == 'upload'"
                class="upload-demo"
                drag
                action
                multiple
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>点击上传</em>
                </div>
                <div
                  class="el-upload__tip"
                  slot="tip"
                >
                  只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              @click="btnClick(false)"
              size="small"
            >取 消</el-button>
            <el-button
              type="primary"
              @click="btnClick(true)"
              size="small"
            >确 定</el-button>
          </span>
        </el-dialog>
      </div>
      `,
  props: {
    dialogshow: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    formcontroller: {
      type: Array,
      default: function () {
        return [];
      },
    },
    formrules: {
      type: Object,
      default: function () {
        return {};
      },
    },
    formdata: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  created() { },
  mounted() { },
  watch: {
    dialogshow: {
      handler: function (val, oldVal) {
        this.dialogshow = val;
      },
      // 深度观察监听
      deep: true,
    },
  },
  methods: {
    // 点击打开内置弹框
    openInnerDialog(methods) {
      if (methods) {
        this.$emit(methods);
      }
    },
    // 单击树形下拉
    handleClick(node, data, methods) {
      if (methods) {
        this.$emit(methods, node, data);
      }
    },
    // 确定
    btnClick(val) {
      if (val) {
        this.$refs.formdata.validate((valid) => {
          if (valid) {
            this.$emit("dialogbtnclick", val);
          }
        });
      } else {
        this.$emit("dialogbtnclick", val);
      }
    },
    // 关闭
    close(done) {
      done();
      this.$emit("dialogbtnclick", false);
    },
  },
})