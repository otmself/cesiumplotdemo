<template>
  <div class="demo-right_menu">
    <el-dropdown size="small">
      <el-tooltip content="视图切换" placement="left">
        <el-button circle size="small">
          <div class="demo-right_layerManager"
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
  </div>
</template>

<script>
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
    }
  },
  methods: {
    switchView(index) {
      this.viewIndex = index;
      index == 0 ? this.viewer.scene.morphTo3D(1) : this.viewer.scene.morphTo2D(1);
    },
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
  padding: 5px 0;
  text-align: center;

  .demo-right_layerManager {
    cursor: pointer;
    height: 24px;
    width: 24px;
    background: url("../assets/icon/layermanager.svg");
    background-repeat: no-repeat;
    background-size: cover;
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

</style>
