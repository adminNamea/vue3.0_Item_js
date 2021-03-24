<template>
  <div class="order">
    <card
      v-for="(item, index) in takeList"
      :key="index"
      @click="takeClick(item.take_id)"
      class="stations"
      style="min-height: 2rem"
      :top="false"
      :hed="false"
    >
      <div class="flex hed">
        <span>提交人：{{ item.name_cn }}</span>
      </div>
      <div class="flex">
        <span>提交时间：{{ item.create_date }}</span>
      </div>
    </card>
    <van-empty
      style="width: 100%"
      v-if="takeList.length === 0"
      image="error"
      description="暂无数据"
    />
  </div>
</template>
<script>
import card from "@/components/card/index.vue";

export default {
  components: {
    card,
  },
  data() {
    return {
      takeList: [],
    };
  },
  created() {
    this.getTakeFiveList({ order_id: sessionStorage.getItem("order_id") });
  },
  methods: {
    takeClick(id) {
      sessionStorage.setItem("take_id", id);
      this.$router.push({ name: "take5ListDetails" });
    },
    getTakeFiveList(obj) {
      this.$api.takeFiveList(obj).then((res) => {
        console.log(res);
        this.takeList = res;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.order {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.stations {
  width: 49%;
  font-size: 0.8rem;
  .flex {
    font-size: 0.8rem;
    padding: 0.3rem 1rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    span {
      flex: 1;
    }
  }
  .hed {
    font-size: 0.9rem;
    color: #ffffff;
    font-weight: 600;
    padding: 0.2rem 1rem;
    background: #434343;
  }
}
</style>
