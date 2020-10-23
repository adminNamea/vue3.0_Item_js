<template>
  <div class="home">
    <div class="top">
      <div class="photo" :class="{ bColor: avatar !== '' }">
        <img v-if="avatar" :src="avatar" />
        <div v-else></div>
      </div>
      <div class="user" style="margin: 0 0 2rem 0.4rem">
        <img
          style="width: 0.7rem; height: 1.5rem; margin-right: 0.5rem"
          src="@/assets/img/user.png"
        />
        <span style="font-size: 1.2rem">{{ userName }}</span>
      </div>
      <div class="user">
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
import img1 from "@/assets/img/新建工单.png";
import img2 from "@/assets/img/我的工单.png";
import img3 from "@/assets/img/我的工作.png";
import img4 from "@/assets/img/我的审批.png";
import img5 from "@/assets/img/工卡系统.png";
import img6 from "@/assets/img/油样信息系统.png";
import img7 from "@/assets/img/SRT工单.png";
import img8 from "@/assets/img/TAKE5.png";
import img9 from "@/assets/img/TA1.png";
import img10 from "@/assets/img/注销.png";
import { useStore } from "vuex";
import router from "../router";

export default {
  setup() {
    const { state } = useStore();
    const homeData = [
      {
        img: img1,
        name: "新建工单",
        url: "buildorder",
      },
      {
        img: img2,
        name: "我的工单",
        url: "myorder",
        srt: 0,
      },
      {
        img: img3,
        name: "我的工作",
        url: "mywork",
      },
      {
        img: img4,
        name: "我的审批",
        url: "myapproval",
      },
      {
        img: img5,
        name: "工卡系统",
        url: "jCLog",
      },
      {
        img: img6,
        name: "油样信息系统",
        url: "oilInfo",
      },
      {
        img: img7,
        name: "SRT工单",
        url: "myorder",
        srt: 1,
      },
      {
        img: img8,
        name: "TAKE5",
        url: "TAKE5",
      },
      {
        img: img9,
        name: "TA1",
      },
      {
        img: img10,
        name: "注销",
        url: "out",
      },
    ];
    function outLogin() {
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
          device.notification.alert(`关闭失败--${JSON.stringify(err)}`);
        });
    }
    function to(item) {
      if (item.srt !== undefined) {
        sessionStorage.setItem("srt", item.srt);
      }
      if (item.url !== "out") {
        router.push({ name: item.url });
      } else {
        outLogin();
      }
    }
    return {
      homeData,
      to,
      outLogin,
      ...state,
    };
  },
};
</script>
<style lang="scss" scoped>
.home {
  text-align: center;
}
.top {
  position: relative;
  height: 9rem;
  z-index: 0;
  box-shadow: 0 0.1rem 0.1rem 0.05rem rgba(0, 0, 0, 0.08);
  border-radius: 0.2rem;
  background: linear-gradient(to right, #ffcd11 0%, #ffe775 100%);
  .user {
    display: flex;
    align-items: center;
    position: relative;
    top: -58%;
    left: 35%;
    h2 {
      padding: 1rem;
    }
    div {
      margin-right: 1rem;
    }
    span {
      font-size: 1rem;
    }
    img {
      margin-right: 0.2rem;
      width: 1.5rem;
      height: 1.5rem;
    }
  }
  .photo {
    position: relative;
    z-index: 1;
    top: 1rem;
    left: 5%;
    height: 7rem;
    background-color: rgba(249, 249, 250, 0.3);
    width: 7rem;
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
      font-size: 1rem;
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
