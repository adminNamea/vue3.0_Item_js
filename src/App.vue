<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="includes" v-if="ro">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
<script>
import { provide, ref } from "vue";

export default {
  name: "App",
  setup() {
    const ro = ref(true);
    const reload = () => {
      ro.value = false;
      setTimeout(() => {
        ro.value = true;
      });
    };
    provide("reload", reload);
    return {
      ro,
    };
  },
  data() {
    return {
      includes: [
        "buildorder",
        "oilInfo",
        "feesList",
        "mywork",
        "myorder",
        "myByOrdey",
        "myByFees",
        "orderApproval",
        "feesApproval",
        "cardApproval",
        "myapproval",
        "TAKE5",
      ],
    };
  },
};
</script>
<style lang="scss">
.top-sticky,
.end-sticky {
  position: fixed;
  left: 0;
  background-color: rgba(249, 249, 250, 1);
  padding: 1rem;
  z-index: 2;
}
.top-sticky {
  top: 0;
}
.end-sticky {
  bottom: 0;
}
body,
html {
  margin: 0;
  background: rgba(249, 249, 250, 1);
}
.station {
  overflow: visible !important;
  font-size: 3vw;
  padding-bottom: 2vw;
  .flex {
    padding: 1.5vw 1rem 0 1rem;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    span {
      word-break: break-all;
      flex: 1;
      &:nth-child(1) {
        flex: 1.3;
      }
    }
  }
  .left {
    display: inline-block;
    margin-top: 2vw;
    font-size: 3vw;
    font-weight: 600;
    padding: 1vw 1rem;
    border-radius: 0 4vw 4vw 0;
    background: linear-gradient(267deg, #fbd01f, #fee568);
  }
  .upDate {
    color: #019fbc;
    position: absolute;
    width: 100%;
    display: flex;
    top: 5vw;
    span {
      font-size: 2.5vw;
      display: inline-block;
      flex: 1;
      &:nth-child(1) {
        flex: 1.3;
      }
    }
  }
  .right {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    .icon {
      position: relative;
      right: 0.5rem;
      top: 0.5rem;
      width: 1rem;
      height: 1rem;
      box-shadow: 0 -0.05rem 0.1rem 0 rgba(0, 0, 0, 0.25);
      border-radius: 50%;
    }
    img {
      height: 5rem;
      transform: scale(1.07);
    }
  }
}
#app {
  color: #2c3e50;
  background: rgba(249, 249, 250, 1);
  padding: 0 1rem 1rem 1rem;
  overflow-x: hidden;
}
.van-popup--bottom {
  bottom: 10%;
}
.cancel {
  display: flex;
  align-items: center;
  height: 2rem;
  width: 5.5rem;
  justify-content: center;
  background: #e4e4e4;
  border-radius: 0.3rem;
  cursor: pointer;
}

.confirm {
  height: 2rem;
  width: 5.5rem;

  justify-content: center;
  background: #ffcd11;
  border-radius: 0.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.btnG {
  margin: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
