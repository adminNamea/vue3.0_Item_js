<template>
  <div class="home">
    <div class="top">
      <div class="photo" :class="{ bColor: avatar !== '' }">
        <img v-if="avatar" :src="avatar" />
        <div v-else></div>
      </div>
      <div class="user" style="margin-left: 10vw">
        <div style="width: 100%; margin-bottom: 4vw">
          <img
            style="width: 1.5vw; height: 3.5vw; margin: 0 1vw"
            src="@/assets/img/user.png"
          />
          <span>{{ userName }}</span>
        </div>
        <div>
          <img src="@/assets/img/职位.png" />
          <span>{{ roleName }}</span>
        </div>
        <div>
          <img src="@/assets/img/维修.png" />
          <span>维修部</span>
        </div>
      </div>
    </div>
    <div class="body">
      <div
        class="img"
        v-for="(item, index) in homeData"
        :key="index"
        @click="to(item)"
      >
        <img :src="item.img" />
        <p>{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { device, biz } from "dingtalk-jsapi";
import { useStore } from "vuex";

export default {
  setup() {
    const { state } = useStore();
    const { isRole } = state;
    const homeData = [
      {
        img: require("@/assets/img/新建工单.png"),
        name: "新建工单",
        url: "buildorder",
        role: true,
      },
      {
        img: require("@/assets/img/我的工单.png"),
        name: "我的工单",
        url: "myorder",
        srt: 0,
        role: true,
      },
      {
        img: require("@/assets/img/我的工作.png"),
        name: "我的工作",
        url: "mywork",
      },
      {
        img: require("@/assets/img/我的审批.png"),
        name: "我的审批",
        url: "myapproval",
      },
      {
        img: require("@/assets/img/工卡系统.png"),
        name: "工卡系统",
        url: "jCLog",
      },
      {
        img: require("@/assets/img/油样信息系统.png"),
        name: "油样信息系统",
        url: "oilInfo",
      },
      {
        img: require("@/assets/img/SRT工单.png"),
        name: "SRT工单",
        url: "myorder",
        srt: 1,
      },
      {
        img: require("@/assets/img/TAKE5.png"),
        name: "TAKE5",
        url: "TAKE5",
      },
      {
        img: require("@/assets/img/TA1.png"),
        name: "TA1",
        url: "ta1",
      },
      {
        img: require("@/assets/img/注销.png"),
        name: "注销",
        url: "out",
      },
    ].filter((v) => {
      if (v.role) {
        return isRole;
      }
      return true;
    });
    return { ...state, homeData };
  },
  methods: {
    to(item) {
      if (item.srt !== undefined) {
        sessionStorage.setItem("srt", item.srt);
      }
      if (item.url === "out") {
        this.outLogin();
      } else if (item.url === "ta1") {
        this.$api.loginJdy().then((url) => {
          biz.util.openLink({
            url,
          });
        });
      } else {
        this.$router.push({ name: item.url });
      }
    },
    outLogin() {
      device.notification
        .confirm({
          message: "退出应用?",
          title: "提示",
          buttonLabels: ["确定", "取消"],
        })
        .then(({ buttonIndex }) => {
          if (buttonIndex === 0) {
            biz.navigation.close();
          }
        })
        .catch((err) => {
          // eslint-disable-next-line no-alert
          alert(`关闭失败--${JSON.stringify(err)}`);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  text-align: center;
}
.top {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  position: relative;
  height: 22vw;
  @media all and(max-width: 400px) {
    height: 25vw;
  }
  z-index: 0;
  box-shadow: 0 0.1rem 0.1rem 0.05rem rgba(0, 0, 0, 0.08);
  border-radius: 0.2rem;
  background: linear-gradient(to right, #ffcd11 0%, #ffe775 100%);
  .user {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    font-size: 4vw;
    h2 {
      padding: 1rem;
    }
    div {
      margin-right: 1rem;
      display: flex;
      align-items: center;
    }
    img {
      margin-right: 0.2rem;
      width: 3.5vw;
      height: 3.5vw;
      line-height: 1px;
    }
  }
  .photo {
    margin-left: 5%;
    height: 18vw;
    background-color: rgba(249, 249, 250, 0.3);
    width: 18vw;
    @media all and(max-width: 400px) {
      height: 21vw;
      width: 21vw;
    }
    border-radius: 50%;
    div {
      border-radius: 50%;
      background-color: rgba(249, 249, 250, 1);
      transform: scale(0.8);
      height: 100%;
      width: 100%;
    }
    img {
      transform: scale(0.8);
      height: 100%;
      width: 100%;
      border-radius: 50%;
    }
  }
}
.body {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .img {
    margin: 1rem 0 0 0;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0.1rem 0.1rem 0.05rem rgba(0, 0, 0, 0.08);
    border-radius: 0.2rem;
    width: 31.5%;
    height: 20%;
    p {
      font-size: 4vw;
      margin-top: 0.1rem;
    }
    img {
      width: 80%;
      transform: scale(0.85);
      height: 80%;
    }
  }
}
</style>
