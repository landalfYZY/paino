<template>
  <transition name="fade" mode="out-in">
    <div>
      
      <div class="console-title">
        <div class="draw-line"></div>
        <div class="title">文件库管理</div>
      </div>
      <div class="panel-between">
        <div class="panel-start">
          <button class="ui-btn ui-btn-default" @click="delSection()"><Icon type="trash-a" color="#FF3333"></Icon>&nbsp;&nbsp;批量删除</button>
          <button class="ui-btn ui-btn-default" @click="isUploadFile = true"><Icon type="upload" color="#0099ff"></Icon>&nbsp;&nbsp;上传文件</button>
          <!-- <button class="ui-btn ui-btn-default"><Icon type="ios-cloud-download" color="#0099ff"></Icon>&nbsp;&nbsp;下载文件</button> -->
        </div>
        <div class="panel-end">
          <button class="ui-btn ui-btn-default" @click="sortSize()">&nbsp;&nbsp;<Icon :type="sizeIcon"></Icon>&nbsp;&nbsp;按大小排序</button>
          <button class="ui-btn ui-btn-default" @click="sortTime()">&nbsp;&nbsp;<Icon :type="timeIcon"></Icon>&nbsp;&nbsp;按时间排序</button>
          <button class="ui-btn ui-btn-default" @click="freshPage()">&nbsp;&nbsp;<Icon type="android-sync"></Icon>&nbsp;&nbsp;刷新</button>
        </div>
      </div>
      <div class="gallery-panel">
        <el-checkbox v-model="checkedAll" style="float:left" @change="checkedAllChange">全选</el-checkbox>
        <el-dropdown trigger="hover" style="margin-left:20px">
          <span class="el-dropdown-link">
            {{categoryTitle}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item ><div style="width:150px" @click="changeCategoryTitle('全部','all')">全部</div></el-dropdown-item>
            <el-dropdown-item v-for="(item,index) in categoryList" :key="index" ><div style="width:150px" @click="changeCategoryTitle(item.name,item.sunwouId)">{{item.name}}</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="hover" style="margin-left:20px" >
          <span class="el-dropdown-link">
            {{formatTitle}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item ><div style="width:150px" @click="changeFormatTitle('全部格式','all')">全部格式</div></el-dropdown-item>
            <el-dropdown-item v-for="(item,index) in formats" :key="index"  ><div style="width:150px" @click="changeFormatTitle(item.laebl,item.value)">{{item.laebl}}</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div style="float:right;font-size:14px;" class="font-primary">2.2G/5G</div>
        <div class="clearfix"></div>
      </div>
      <div class="gallery-list">
        <div v-show="listShow" class="gallery-item" v-for="(item,index) in list" :key="index">
          <div class="gallery-bg" :style="'background:url('+item.url+');background-position:center;background-size:cover'">
            <el-checkbox class="checkbox" v-model="item.active" @change="itemCheckIt(item)"></el-checkbox>
            <div class="gallery-content">
              <div class="panel-between">
                <div class="font-white">{{item.mimtype}}</div>
                <div class="font-white">{{(item.size/1024/1024) > 1 ? (item.size/1024/1024).toFixed(0)+'M':(item.size/1024).toFixed(0)+'K'}}</div>
              </div>
              <div class="do-look panel-between " style="margin-top:2px">
                <div class="ui-link-default" @click="openFancyBox($event)">查看</div>
                <div :class="'ui-link-default tag-read'+index" :data-clipboard-text="item.host+item.path" @click="copyLink(index,item.url,item.fileName)" >复制图片链接</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="list.length == 0" style="text-align:center;padding:50px;color:#888">您还没有上传任何文件哦</div>
      <div class="gallery-panel">
        <el-pagination style="float:right;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-sizes="[18, 36, 54, 72]" :page-size="100"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <div class="clearfix"></div>
      </div>
      
      <Modal v-model="isUploadFile" title="上传文件" width="300" ok-text="确定" cancel-text="取消">
        <p>
          <el-upload
            class="upload-demo"
            :action="API2+'filesystem/upfile'"
            :http-request="uploadFile"
            :multiple="true"
            >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">文件大小不能超过2MB</div>
          </el-upload>
        </p>
      </Modal>
    </div>
    
  </transition>
</template>
<style>
@import url('../../assets/css/ui_console.css');
</style>

<script>
import Clipboard from "clipboard";
export default {
  data() {
    return {
      moveCategoryText: "",
      moveModel: false,
      listShow: true,
      sizeIcon: "ios-circle-filled",
      timeIcon: "ios-clock",
      API2: "",
      isUploadFile: false,
      categoryContent: "",
      categoryTitle: "全部",
      categoryList: [],
      categoryModal: false,
      formatTitle: "全部格式",
      formats: [
        { laebl: "PNG", value: "png" },
        { laebl: "JPG", value: "jpg" },
        { laebl: "JPEG", value: "jpeg" },
        { laebl: "GIF", value: "gif" },
        { laebl: "MP3", value: "mp3" },
        { laebl: "MP4", value: "mp4" },
        { laebl: "AVI", value: "avi" },
        { laebl: "RMVB", value: "rmvb" },
        { laebl: "doc/docx", value: "doc/docx" },
        { laebl: "PPTX", value: "pptx" },
        { laebl: "XLSX", value: "xlsx" },
        { laebl: "TXT", value: "txt" }
      ],
      checkedAll: false,
      currentPage: 1,
      list: [],
      selectionList: [],
      total: 0,
      query: {
        fields: [],
        wheres: [
          {
            value: "userId",
            opertionType: "equal",
            opertionValue: localStorage.getItem("userId")
          },
          {
            value: "isDelete",
            opertionType: "equal",
            opertionValue: false
          }
        ],
        sorts: [],
        pages: {
          currentPage: 1,
          size: 18
        }
      },
      cateQuery: {
        fields: [],
        wheres: [
          {
            value: "userId",
            opertionType: "equal",
            opertionValue: localStorage.getItem("userId")
          }
        ],
        sorts: [],
        pages: {
          currentPage: 1,
          size: 100
        }
      }
    };
  },
  mounted() {
    this.API2 = sessionStorage.getItem("API2");
    this.getList();
    //this.getCategory();
  },
  methods: {
    openFancyBox(e) {
      console.log(e);
    },
    
    //批量删除
    delSection() {
      var that = this;
      var ids = [];
      for (var i in this.selectionList) {
        ids.push(this.selectionList[i].sunwouId);
      }
      this.$Modal.confirm({
        title: "警告",
        content: "<p>删除后数据将无法恢复，确定要继续吗？</p>",
        loading: true,
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          var ui = this;
          $.ajax({
            url: sessionStorage.getItem("API2") + "filesystem/remove",
            type: "POST",
            data: {
              ids: ids.toString()
            },
            dataType: "json",
            success(res) {
              ui.$Modal.remove();
              if (res.code) {
                that.$Message.success(res.msg);
                that.getList();
              } else {
                that.$Message.error(res.msg);
              }
            }
          });
        }
      });
    },
    
    //选择图片
    itemCheckIt(item) {
      if (item.active) {
        this.selectionList.push(item);
      } else {
        var temp = -1;
        for (var i in this.selectionList) {
          if (this.selectionList[i]._id == item._id) {
            temp = i;
          }
        }
        if (temp != -1) {
          this.selectionList.splice(temp, 1);
        }
      }
      if (this.selectionList.length == this.list.length) {
        this.checkedAll = true;
      } else {
        this.checkedAll = false;
      }
      sessionStorage.setItem("imgUrls", JSON.stringify(this.selectionList));
    },
    //全选
    checkedAllChange(e) {
      if (e) {
        for (var i in this.list) {
          this.list[i].active = true;
        }
        this.selectionList = this.list;
      } else {
        for (var i in this.list) {
          this.list[i].active = false;
        }
        this.selectionList = [];
      }
      sessionStorage.setItem("imgUrls", JSON.stringify(this.selectionList));
    },
    //按时间排序
    sortTime() {
      var temp1 = -1;
      for (var i in this.query.sorts) {
        if (this.query.sorts[i].value == "createTime") {
          temp1 = i;
        }
      }
      if (temp1 == -1) {
        this.timeIcon = "arrow-up-c";
        this.query.sorts.push({ value: "createTime", asc: true });
      } else if (temp1 != -1 && this.query.sorts[temp1].asc == true) {
        this.timeIcon = "arrow-down-c";
        this.query.sorts[temp1].asc = false;
      } else if (temp1 != -1 && this.query.sorts[temp1].asc == false) {
        this.query.sorts.splice(temp1, 1);
        this.timeIcon = "ios-clock";
      }
      this.getList();
    },
    //按大小排序
    sortSize() {
      var temp1 = -1;
      for (var i in this.query.sorts) {
        if (this.query.sorts[i].value == "size") {
          temp1 = i;
        }
      }
      if (temp1 == -1) {
        this.sizeIcon = "arrow-up-c";
        this.query.sorts.push({ value: "size", asc: false });
      } else if (temp1 != -1 && this.query.sorts[temp1].asc == false) {
        this.sizeIcon = "arrow-down-c";
        this.query.sorts[temp1].asc = true;
      } else if (temp1 != -1 && this.query.sorts[temp1].asc == true) {
        this.query.sorts.splice(temp1, 1);
        this.sizeIcon = "ios-circle-filled";
      }
      this.getList();
    },
    //复制链接
    copyLink(index, url, name) {
      var that = this;
      var clipboard = new Clipboard(".tag-read" + index);
      clipboard.on("success", e => {
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // 不支持复制
        that.$Message.error("无法复制");
        // 释放内存
        clipboard.destroy();
      });
      this.$Notice.success({
        title: '已将文件链接"' + name + '"复制到剪切板',
        desc: url
      });
    },
    uploadFile(e) {
      var that = this;
      var formData = new FormData();
      formData.append("file", e.file);
      $.ajax({
        type: "POST",
        url: this.API2 + "api/upload/insert",
        data: formData,
        processData: false,
        contentType: false,
        async: false,
        complete(res) {
          var rl = JSON.parse(res.responseText);
          if (rl.code) {
            that.isUploadFile = false;
            that.getList();
            that.$Message.success("上传成功");
          } else {
            that.$Message.error(res.msg);
          }
        }
      });
    },
    getList() {
      var that = this;
      var queryData = JSON.stringify(this.query);
      $.ajax({
        url: sessionStorage.getItem("API2") + "api/upload/find",
        type: "POST",
        data: {
          query: queryData
        },
        dataType: "json",
        success(res) {
          that.listShow = false;
          if (res.code) {
            var li = res.result;
            for (var i in li) {
              li[i].active = false;
              li[i].url = li[i].path+'/' + li[i].fileName;
            }

            that.list = li;
            //that.total = res.params.total;
            that.checkedAll = false;
            that.selectionList = [];
          } else {
            that.$Message.error(res.msg);
          }

          that.listShow = true;
        }
      });
    },
    freshPage() {
      this.getList();
    },
    handleSizeChange(val) {
      this.query.pages.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.query.pages.currentPage = val;
      this.getList();
    },
    //根据格式查找
    changeFormatTitle(label, value) {
      this.formatTitle = label;
      var temp1 = -1;
      for (var i in this.query.wheres) {
        if (this.query.wheres[i].value == "mimetype") {
          temp1 = i;
        }
      }
      if (value == "all") {
        if (temp1 != -1) {
          this.query.wheres.splice(temp1, 1);
        }
      } else {
        if (temp1 == -1) {
          this.query.wheres.push({
            value: "mimetype",
            opertionType: "like",
            opertionValue: value
          });
        } else {
          this.query.wheres[temp1].opertionValue = value;
        }
      }

      this.getList();
    },
    
  }
};
</script>
