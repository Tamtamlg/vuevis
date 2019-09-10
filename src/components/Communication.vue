<template>
  <div class="wrapper">
    <div class="menu">
      <button @click="moveTo">Today</button>
      <button @click="zoomOut">-</button>
      <button @click="zoomIn">+</button>
    </div>

    <timeline
      ref="timeline"
      :items="items"
      :groups="groups"
      :options="options"
      @items-update="onItemUpdate"
      @rangechanged="onRangechanged"
    ></timeline>
  </div>
</template>

<script>
import { Timeline, DataSet } from "vue2vis";
import { log } from "util";
export default {
  data() {
    return {
      groups: [
        {
          content: "Commercial Email",
          id: "pr1",
          nestedGroups: [
            "Formula E",
            "WRC",
            "MotoGP",
            "V8SC",
            "WTCC",
            "F1",
            "SBK",
            "IndyCar",
            "MotoAmerica",
            "SGP",
            "EWC",
            "BSB"
          ]
        },
        {
          content: "Club activities",
          id: "pr2",
          nestedGroups: ["DTM", "WorldRX", "WSR",  "GP2"]
        },
        { content: "W27 | Commercial Email | Sales", id: "Formula E", value: 1 },
        { content: "W28 | CRM | Commercial Email | Sales", id: "WRC", value: 2 },
        { content: "W29 | CRM | Commercial Email | Sales", id: "MotoGP", value: 3 },
        { content: "W30 | CRM | Commercial Email | Sales", id: "V8SC", value: 4 },
        { content: "W29 | CRM | Commercial Email | Last chance sales", id: "WTCC", value: 5 },
        { content: "F1", id: "F1", value: 6 },
        { content: "SBK", id: "SBK", value: 7 },
        { content: "IndyCar", id: "IndyCar", value: 8 },
        { content: "MotoAmerica", id: "MotoAmerica", value: 9 },
        { content: "SGP", id: "SGP", value: 10 },
        { content: "EWC", id: "EWC", value: 11 },
        { content: "BSB", id: "BSB", value: 12 },
        { content: "DTM", id: "DTM", value: 13 },
        { content: "BTCC", id: "BTCC", value: 20 },
        { content: "WorldRX", id: "WorldRX", value: 15 },
        { content: "WSR", id: "WSR", value: 16 },
        { content: "GP2", id: "GP2", value: 17, nestedGroups: ["WEC"] },
        { content: "WEC", id: "WEC", value: 18, nestedGroups: ["Roads"] },
        { content: "Roads", id: "Roads", value: 19, nestedGroups: ["BTCC",] },
      ],
      items: [
        {
          start: "2019-09-07",
          end: "2019-09-09",
          group: "F1",
          content: "Argentina",
          id: "531@motocal.net",
          color: "D43C3C"
        },
        {
          start: "2019-09-07",
          end: "2019-09-14",
          group: "WRC",
          content: "Rallye Monte-Carlo",
          id: "591@motocal.net",
          color: "75ABF4"
        },
        {
          start: "2019-09-06",
          end: "2019-09-18",
          group: "GP2",
          content: "Rallye Monte-Carlo",
          id: "591@motocal.netq",
          color: "75B933"
        },
        {
          start: "2019-09-04",
          end: "2019-09-10",
          group: "DTM",
          content: "Rallye Monte-Carlo",
          id: "591@motocal.netw",
          color: "EAAB24"
        }
      ],
      options: {
        zoomMax: 31536000000,
        zoomMin: 36000000,
        editable: {
          add: false, // add new items by double tapping
          updateTime: true, // drag items horizontally
          updateGroup: true, // drag items from one group to another
          remove: true, // delete an item by tapping the delete button top right
          overrideItems: false // allow these options to override item.editable
        },
        orientation: "top",
        groupEditable: true,
        // locale: 'ru',
        // showTooltips: true,
        // hiddenDates: [
        //   {start: '2013-10-26 00:00:00', end: '2013-10-28 00:00:00', repeat: 'weekly'}, // daily weekly monthly yearly
        // ],
        start: "2019-09-01",
        end: "2019-09-20",
        template: (item, element, data) => {
          return `<div class="item-body" style="background: #${item.color}">
                    <div class="item-tooltip" style="background: #${item.color}; border-color: #${item.color}; color: #fff">
                      <p>${item.content}</p>
                      <span>${item.start}</span>
                    </div>
                    <span class="item-circle left-circle" style="border-color: #${item.color}"></span>
                    <span class="item-circle right-circle" style="border-color: #${item.color}"></span>
                  </div>`;
        },
        groupOrder: (a, b) => {
          return a.value - b.value;
        },
        groupOrderSwap: (a, b, groups) => {
          var v = a.value;
          a.value = b.value;
          b.value = v;
        },
        groupTemplate: (group) => {
          return `<div class="group">
                  <h5 class="group-title">${group.content}</h5>
                  <div class="group-menu">
                    <span class="group-menu-btn">
                      <span class="group-menu-dot"></span>
                    </span>
                    <ul class="group-menu-list">
                      <li>Edit</li>
                      <li>Duplicate</li>
                      <li>Delete</li>
                    </ul>
                  </div>
                </div>`;
        },
        onMove: (item, callback) => {
          if (this.parentGroups.find(group => {
            return group.id === item.group;
          })) {
            callback(null);
          } else {
             callback(item);
          }
        }
      }
    };
  },
  components: {
    Timeline
  },
  computed: {
    parentGroups() {
      return this.groups.filter(item => {
        return item.hasOwnProperty("nestedGroups");
      });
    }
  },
  methods: {
    onItemUpdate(data) {
      console.log("update: ", data);
    },
    onRangechanged(data) {
      console.log("rangechanged: ", data);
    },

    zoomIn() {
      this.$refs.timeline.zoomIn(0.5);
    },
    zoomOut() {
      this.$refs.timeline.zoomOut(0.5);
    },
    moveTo() {
      this.$refs.timeline.moveTo(new Date());
    }
  }
};
</script>

<style lang="scss">
@import "../../node_modules/vue2vis/dist/vue2vis.css";

/* *** */
.wrapper {
  padding: 20px 50px;
  text-align: center;
}

.menu {
  margin-bottom: 30px;
  text-align: left;

  button {
    margin: 0 5px;
  }
}
/* *** */

.vis-nesting-group {
  .group-menu {
    display: none;
  }
}

.item-body {
  height: 4px;
  position: relative;
  top: 2px;

  .left-circle {
    position: absolute;
    left: 0;
  }

  .right-circle {
    position: absolute;
    right: 0;
    transform: translate(50%, -50%);
  }
}

.item-tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  padding: 5px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;
  text-align: center;
  display: none;
  z-index: 10000;

  p {
    margin-top: 0;
    margin-bottom: 5px;
  }

  span {
    font-size: 14px;
    font-weight: normal;
    opacity: 0.8;
  }

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 100%;
    border: 5px solid transparent;
    border-top: 5px solid;
    border-top-color: inherit;
  }
}

.item-circle {
  box-sizing: border-box;
  width: 13px;
  height: 13px;
  border-width: 3px;
  border-style: solid;
  border-radius: 50%;
  background: #fff;
  transform: translate(-50%, -50%);
  top: 50%;
}

.vis-item {
  background: transparent;
  border-color: transparent;

  &:hover {
    .item-tooltip {
      display: block;
    }
  }

  &.vis-range,
  &.vis-editable {
    cursor: pointer;
  }
}

.vis-item .vis-item-overflow {
  overflow: initial;
}

.vis-item-content {
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
}

.vis-item .vis-delete {
  top: -3px;
}

.vis-panel.vis-left {
  width: 320px;
  text-align: left;
}

.vis-labelset .vis-label .vis-inner {
  display: block;
}

.vis-label.vis-nesting-group .vis-inner {
  display: inline-block;
}

.vis-label {
  background: transparent;

  &:hover {
    background:#F2F6FA;
  }

  &.vis-nesting-group:hover {
    background: transparent;
  }
}

.group {
  display: flex;
  align-items: center;
  width: 100%;

  .group-title {
    margin: 0;
    font-weight: normal;
  }

  .group-menu {
    height: 16px;
    width: 16px;
    margin-left: auto;
    position: relative;
    .group-menu-list {
      display: none;

      li {
        position: relative;
        font-size: 12px;
        padding: 10px 10px 10px 15px;

        &:hover {
          background: #F2F6FA;
          z-index: 2;
        }
        
      }
    }

    &:hover {
      .group-menu-list {
        display: block;
        min-width: 135px;
        position: absolute;
        left: calc(100% + 2px);
        top: -3px;
        border: 1px solid #CED7E1;
        box-shadow: 0 5px 10px 0 rgba(0,0,0,0.1);
        background: #fff;
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .group-menu-list::before {
          position: absolute;
          content: "";
          top: 7px;
          left: -5px;
          width: 7px;
          height: 7px;
          transform: rotate(-135deg);
          background: #fff;
          border-top: 1px solid #CED7E1;
          border-right: 1px solid #CED7E1;
        }
    }
  }
}

.vis-nesting-group .group-title {
  font-weight: bold;
}

.vis-labelset {
  overflow: initial;
}

.vis-panel.vis-left {
  overflow: initial;
}

.vis-label {
  &:hover {
    z-index: 1;
  }
}

.vis-saturday,
.vis-sunday {
  background: #fafafb;
}

.vis-panel.vis-top {
  &::after {
    content: '';
    height: 1px;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    background: #ddd;
  }
}

.group-menu-btn {
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
  background: #DEE4EC;
  border-radius: 1px;
}

.group-menu-dot {
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: #000;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &::after,
  &::before {
    content: '';
    background: #000;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background: #000;
    position: absolute;
  }

  &::after {
    top: 4px;
  }

  &::before {
    bottom: 4px;
  }
}

.vis-timeline {
  overflow: initial;
}

.vis-label.vis-nesting-group {
  padding-left: 15px;
  position: relative;
}

.vis-label.vis-nesting-group.expanded:before {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: rotate(90deg) translateX(-50%);
  content: "";
  width: 10px;
  height: 10px;
  background: url('../assets/chevron.svg') center no-repeat;
}

.vis-label.vis-nesting-group.collapsed:before {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  content: "";
  width: 10px;
  height: 10px;
  background: url('../assets/chevron.svg') center no-repeat;
}
</style>