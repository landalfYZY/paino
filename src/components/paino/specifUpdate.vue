<template>
  <transition name="fade" mode="out-in">
      <div>
          <Form :model="formItem"  label-position="top">
  
             <FormItem label="封面">
                <div v-if="formItem.image == ''" @click="swGalleryModal = true" style="width:200px;height:150px;background:#f3f3f3;cursor:pointer;" class="panel-center item-center">
                    添加封面
                </div>
                <div v-if="formItem.image != ''" @click="swGalleryModal = true" :style="'width:200px;height:150px;cursor:pointer;background-image:url('+formItem.image+');background-size:cover;background-position:center'"></div>
            </FormItem>
            <FormItem label="规格名称">
                <Input v-model="formItem.title" placeholder="规格名称" style="max-width:500px" />
            </FormItem>
            <FormItem label="规格价格">
                <Input v-model="formItem.price" placeholder="规格价格" style="max-width:500px" />
            </FormItem>
            <FormItem label="规格重量">
                <Input v-model="formItem.weight" placeholder="规格重量" style="max-width:500px" />
            </FormItem>
            <FormItem>
                <Button type="primary"  :loading="loading" @click="submitForm()">创建规格</Button>
            </FormItem>
        </Form>
        <Modal v-model="swGalleryModal" width="1000" >        
            <div v-if="swGalleryModal">
                <swGallery></swGallery>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long @click="getModelCover()">确定</Button>
            </div>
        </Modal>
        
      </div>
  </transition>
</template>
<script>
import swGallery from "../common/ui_console_gallery.vue";
var pos = require("../../assets/js/city.js");
export default {
  components: {
    swGallery
  },
  data() {
    return {
      guigemodelsd:false,
      tempindex:0,
      guigemodel: false,
      loading: false,
      tempModal: "cover",
      swGalleryModal: false,
      formItem: {
        productId: "",
        title: "",
        price: "",
        weight: "",
        image:''
      }
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.formItem.productId = this.$route.query.id;
    }
  },
  methods: {

    submitForm() {
      var that = this;
      if(this.formItem.title == ''){
          this.$Message.error("名称不能为空")
      }else if(this.formItem.price == ''){
          this.$Message.error("价格不能为空")
      }else{
          this.loading = true;
          $.ajax({
            url: sessionStorage.getItem("API") + "api/specif/insert",
            type: "POST",
            data: this.formItem,
            dataType: "json",
            success(res) {
            if (res.code) {
                that.$Modal.confirm({
                title: "添加成功",
                content: "是否要继续添加？",
                okText: "前往列表",
                cancelText: "继续添加",
                onOk: () => {
                    that.$router.push({ path: "/specifList" });
                },
                onCancel: () => {
                    that.formItem.attribute = JSON.parse(that.formItem.attribute)
                }
                });
            } else {
                that.$Message.error(res.msg);
            }
            },
            complete() {
            that.loading = false;
            }
        });
      }
      
    },
    getModelCover() {
      this.formItem.image =
        JSON.parse(sessionStorage.getItem("imgUrls"))[0].url
      this.swGalleryModal = false;
    }
  }
};
</script>
