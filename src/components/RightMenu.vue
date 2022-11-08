<template>
  <div class="demo-right_menu">
    <el-dropdown size="small" trigger="click">
      <el-tooltip content="视图切换" placement="left">
        <el-button circle size="small">
          <div class="demo-right_menuItem"
               v-bind:style="{backgroundImage: 'url(' + views[viewIndex].url + ')'}"></div>
        </el-button>
      </el-tooltip>
      <el-dropdown-menu slot="dropdown" :hide-on-click="false">
        <el-dropdown-item v-for="(view, index) in views" :key="index">
          <el-tooltip :content="view.name" placement="left">
            <el-button circle size="small" :type="viewIndex == index ? 'primary' : ''"
                       @click="switchView(index)">
              <div class="demo-right_layerItem" :style="{backgroundImage: 'url(' + view.url + ')'}"></div>
            </el-button>
          </el-tooltip>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-tooltip content="视角切换" placement="left">
      <el-button circle size="small" class="demo-right_menuBtn" @click="perspectiveShow = !perspectiveShow"
                 :type="perspectiveShow ? 'primary' : ''">
        <div class="demo-right_menuItem"
             v-bind:style="{backgroundImage: 'url(' + require('../assets/icon/perspective.svg') + ')'}"></div>
      </el-button>
    </el-tooltip>
    <transition name="el-zoom-in-top">
      <div class="demo-perspective_panel" v-show="perspectiveShow">
        <i class="el-icon-close" @click="closePerspective"></i>
        <el-button @click="sky">太空视角</el-button>
      </div>
    </transition>
  </div>
</template>

<script>
import * as Cesium from "../../public/Cesium/Cesium";

export default {
  name: "RightMenu",
  data() {
    return {
      viewer: null,
      views: [{
        name: "三维视图",
        type: "3d",
        url: require('../assets/icon/3Dearth.svg')
      }, {
        name: "二维视图",
        type: "2d",
        url: require('../assets/icon/2Dearth.svg')
      }, {
        name: "逻辑视图",
        type: "logic",
        url: require('../assets/icon/logic.svg')
      }],
      viewIndex: 0,
      perspectiveShow: false
    }
  },
  methods: {
    switchView(index) {
      this.viewIndex = index;
      index == 0 ? this.viewer.scene.morphTo3D(0) : this.viewer.scene.morphTo2D(0);
    },
    closePerspective() {
      this.perspectiveShow = false;
    },
    sky(){
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(28,56, 200000000),
        orientation: {
          heading: 7,
          pitch: 5,
          roll: 5
        },
        duration: 2
      })
    }
  },
  watch: {
    viewer() {
      if (this.viewIndex == 0) {
        this.viewer.scene.morphTo3D(0);
      } else {
        this.viewer.scene.morphTo2D(0);
      }
    }
  }
}
</script>

<style scoped lang="scss">
.demo-right_menu {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  bottom: 27px;
  width: 56px;
  background: rgba(255, 255, 255, 0);
  padding: 20px 0;
  text-align: center;

  button:hover {
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
  }

  .demo-right_menuItem {
    cursor: pointer;
    height: 24px;
    width: 24px;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .demo-right_menuBtn {
    margin-top: 7px;
  }

  .demo-perspective_panel {
    position: absolute;
    right: 60px;
    z-index: 1;
    background: rgba(255, 255, 255, 0.8);
    padding: 20px;
    border-radius: 5px;
    top: 20px;
    width: 360px;


    .el-icon-close {
      font-size: 16px;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
  }

}

.el-dropdown-menu {
  border: none;
  background: rgba(0, 0, 0, 0);

  .el-dropdown-menu__item {
    padding: 2px 0;

    &:focus, &:not(.is-disabled):hover {
      background-color: rgba(0, 0, 0, 0);
    }

    .el-button {
      &:hover {
        background: #409eff;
      }

      .demo-right_layerItem {
        cursor: pointer;
        height: 24px;
        width: 24px;
        background-repeat: no-repeat;
        background-size: cover;
      }
    }


  }
}

.el-popper[x-placement^=bottom] {
  margin-top: 6px;
}

.el-dropdown-menu--small {
  padding: 0;
}
</style>
