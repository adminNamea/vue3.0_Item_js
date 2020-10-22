<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <keep-alive include="buildorder">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
<style lang="scss">
body,
html {
  margin: 0;
  height: 100%;
  background: rgba(249, 249, 250, 1);
}
.station {
  overflow: visible !important;
  font-size: 0.8rem;
  padding-bottom: 1rem;
  .flex {
    font-size: 0.8rem;
    padding: 1rem 1rem 0 1rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    span {
      flex: 1;
    }
  }
  .left {
    display: inline-block;
    margin-top: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
    padding: 0.2rem 1rem;
    border-radius: 0 1rem 1rem 0;
    background: linear-gradient(267deg, #fbd01f, #fee568);
  }
  .upDate {
    color: #019fbc;
    position: absolute;
    width: 100%;
    display: flex;
    top: 2rem;
    span {
      display: inline-block;
      flex: 1;
    }
  }
  .right {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    .icon {
      position: relative;
      right: 1.5rem;
      top: 1rem;
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
  padding: 1rem;
  overflow-x: hidden;
}
.b_fixed {
  position: sticky;
  margin-top: 1rem;
  bottom: 0;
  left: 0;
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
