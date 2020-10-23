<template>
  <div class="cardDetails">
    <card :hed="false" :top="false" v-for="(v, i) in itemDetails.data" :key="i">
      <div class="left">
        时间：{{ filterTime(v.start_time, "HH:SS") }}-{{
          filterTime(v.end_time, "HH:SS")
        }}
      </div>
      <div class="flex">
        <van-cell
          v-if="v.description_name"
          title="类型："
          :value="v.description_name"
        ></van-cell>
        <van-cell
          v-if="v.item_name"
          title="项目："
          :value="v.item_name"
        ></van-cell>
        <van-cell
          v-if="v.group_description"
          title="项目类型："
          :value="v.group_description"
        ></van-cell>
        <van-cell
          v-if="v.ot_name"
          title="加班类型："
          :value="v.ot_name"
        ></van-cell>
        <van-cell
          v-if="v.path_store"
          title="出发点："
          :value="v.path_store"
        ></van-cell>
        <van-cell
          v-if="v.path_end"
          title="目的地："
          :value="v.path_end"
        ></van-cell>
        <van-cell
          v-if="v.path_length"
          title="公里数："
          :value="v.path_length"
        ></van-cell>
        <van-cell
          v-if="v.description"
          title="备注："
          :value="v.description"
        ></van-cell>
      </div>
    </card>
    <van-empty
      v-if="itemDetails.data == 0"
      image="error"
      description="暂无数据"
    />
    <div class="b_fixed" v-if="itemDetails.status_id == 0">
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        @click="onSubmit(0)"
        >审批不通过</van-button
      >
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        @click="onSubmit(1)"
        >通过审批</van-button
      >
    </div>
  </div>
</template>

<script>
import card from "@/components/card/index.vue";
import { Dialog } from "vant";

export default {
  components: {
    card,
  },
  data() {
    return {
      itemDetails: { data: [] },
      item: JSON.parse(sessionStorage.getItem("cardItem")),
    };
  },
  created() {
    this.init();
  },
  methods: {
    onSubmit(type) {
      this.$api
        .approvalWorkRecord({
          ...this.item,
          faile_note: this.note,
          type,
        })
        .then((res) => {
          Dialog.alert({ message: res.msg }).then(() => {
            this.$router.go(-1);
          });
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    init() {
      this.$api
        .workRecordDetails()
        .then((res) => {
          res.data = res.data || [];
          this.itemDetails = res;
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.b_fixed {
  display: flex;
  align-items: center;
  justify-content: space-between;
  button {
    width: 49%;
  }
}
.left {
  margin: 1rem 0 0 -1rem;
  display: inline-block;
  font-size: 1rem;
  padding: 0.3rem 1rem 0.5rem 2rem;
  border-radius: 0 1rem 1rem 0;
  background: #434343;
  color: #ffffff;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  ::v-deep .van-cell {
    display: inline-flex;
    width: 45%;
    &__title {
      flex: none;
      width: 25%;
    }
    &__value {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
