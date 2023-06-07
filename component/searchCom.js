let searchCom = Vue.component('search-com', {
  template:
    `<div>
    <el-form ref="searchdata" :model="searchdata"  class="demo-form-inline"  inline label-width="200px" 
    label-position="left">
    <el-form-item v-for="item in searchform" :label="item.label+':'" :key="item.prop" :prop="item.prop">
        <!-- 输入框 -->
        <el-input v-if="item.type==='Input'" v-model="searchdata[item.prop]" size="medium" :style="{'width':150+'px'}"
            @keyup.enter.native="operation(item.methods,searchdata)"></el-input>
        <!-- 下拉框 -->
        <el-select :style="{'width':150+'px'}" v-if="item.type==='Select'" v-model="searchdata[item.prop]" size="medium" @change="changeValue(searchdata[item.prop],item.prop)" :multiple="item.multiple"
             clearable filterable>
            <el-option v-for="(op,index) in item.options" :label="op.label" :value="op.value" :key="index" ></el-option>
        </el-select>
  
        <!-- 单选 -->
        <el-radio-group v-if="item.type==='Radio'" v-model="searchdata[item.prop]">
            <el-radio v-for="ra in item.radios" :label="ra.value" :key="ra.value">{{ra.label}}</el-radio>
        </el-radio-group>
        <!-- 单选按钮 -->
        <el-radio-group v-if="item.type==='RadioButton'" v-model="searchdata[item.prop]"
            @change="operation(item.methods,searchdata)">
            <el-radio-button v-for="ra in item.radios" :label="ra.value" :key="ra.value">{{ra.label}}</el-radio-button>
        </el-radio-group>
        <!-- 复选框 -->
        <el-checkbox-group v-if="item.type==='Checkbox'" v-model="searchdata[item.prop]">
            <el-checkbox v-for="ch in item.checkboxs" :label="ch.value" :key="ch.value">{{ch.label}}</el-checkbox>
        </el-checkbox-group>
        <!-- 开始与结束时间 -->
        <el-date-picker v-if="item.type==='Daterange'" v-model="searchdata[item.prop]" type="daterange"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
        <!-- 日期 -->
        <el-date-picker v-if="item.type==='Date'" v-model="searchdata[item.prop]"></el-date-picker>
        <!-- 时间 -->
        <el-time-select v-if="item.type==='Time'" v-model="searchdata[item.prop]" type></el-time-select>
        <!-- 日期时间 -->
        <el-date-picker v-if="item.type==='DateTime'" type="datetime" v-model="searchdata[item.prop]"
            :disabled="item.disable && item.disable(searchdata[item.prop])"></el-date-picker>
        <!-- 滑块 -->
        <!-- <el-slider v-if="item.type==='Slider'" v-model="searchdata[item.prop]"></el-slider> -->
        <!-- 开关 -->
        <el-switch v-if="item.type==='Switch'" v-model="searchdata[item.prop]"></el-switch>
    </el-form-item>
    <el-form-item>
       <el-button  type="primary" size="medium" @click="btnclick('dataSearch')">查询</el-button>
       <el-button  v-for="(item, i) in btnform" :key="i" :type="item.Type ? item.Type :'primary'" :icon="item.Icon" size="medium" @click="btnclick(item.Methods, item.Params, i)" v-show="
   item.signName || item.signName == 0
   ? item.signName == signName
   :true
   ">
       {{item.BtnName}}</el-button>
    </el-form-item>
</el-form>
</div>`,
  props: {
    isMoreHeader: {
      type: Boolean,
      default: false,
    },
    signName: {
      type: Number,
      required: false,
    },
    defaultShow: {
      type: Boolean,
      default: true,
    },
    // 表格的下标
    remark: {
      type: Number,
      required: false,
    },
    searchform: {
      type: Array,
      default: function () {
        return [];
      },
    },
    btnform: {
      type: Array,
      default: function () {
        return [];
      },
    },
    searchdata: {
      type: Object,
      required: false,
      default: function () {
        return {};
      },
    },
    isLoading: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      size: "small",
      circle: 0,
      tag: 0,
      col: 0,
      isSpread: false,
      tagRemark: 0,
      text: "展开",
    };
  },
  created() { },
  mounted() { },
  watch: {
  },
  methods: {
    // 按钮事件
    btnclick(methods, params, index) {
      if (methods == "dataExport" && this.isMoreHeader) {
        this.$emit("btnclick", "exportmoreExcel", params, index, this.remark);
        return;
      }
      this.$emit("btnclick", methods, params, index, this.remark);
    },
  },
})