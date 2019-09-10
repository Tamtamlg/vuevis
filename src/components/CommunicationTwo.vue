<template>
  <div class="wrapper">
    <div class="menu">
      <button @click="moveTo">Today</button>
      <button @click="zoomOut">-</button>
      <button @click="zoomIn">+</button>
    </div>

    <div style="overflow: hidden; position: relative;">
      <timeline
        ref="timeline"
        :items="items"
        :groups="groups"
        :options="options"
        @items-update="onItemUpdate"
        @rangechanged="onRangechanged"
        @contextmenu="onContextmenu"
      ></timeline>
    </div>

    <ul class="context-menu" ref="contextMenu" :style="`top: ${contextMenuTop}px; left: ${contextMenuLeft}px`">
      <li @click="editItem(selectedItem)">Edit</li>
      <li @click="cloneItem(selectedItem)">Duplicate</li>
      <li @click="removeItem(selectedItem)">Delete</li>
    </ul>

    
  </div>
</template>

<script>
import { Timeline, DataSet } from "vue2vis";
import moment from "moment";
export default {
  data() {
    return {
      visibleDays: null,
      contextMenuTop: 0,
      contextMenuLeft: 0,
      selectedItem: '',
      groups: [
        { content: "Commercial Email", id: "F1", value: 1 },
        { content: "Club activities", id: "WRC", value: 2 },
        { content: "Webshop email", id: "GP2", value: 3 },
        { content: "Club News Email", id: "DTM", value: 4 },
        { content: "Supplier Dedicated Email", id: "WTCC", value: 5 }
      ],
      items: [
        {
          start: "2019-09-07",
          end: "2019-09-09",
          group: "F1",
          content: "W29 | Commercial Email | Sales",
          id: "531@motocal.net",
          color: "D43C3C"
        },
        {
          start: "2019-09-07",
          end: "2019-09-14",
          group: "WRC",
          content: "Club | Events | Commercial Email | Sales",
          id: "591@motocal.net",
          color: "75ABF4"
        },
        {
          start: "2019-09-06",
          end: "2019-09-18",
          group: "GP2",
          content: "W29 | CRM | Dedicated mail | Coyote",
          id: "591@motocal.netq",
          color: "75B933"
        },
        {
          start: "2019-09-04",
          end: "2019-09-10",
          group: "DTM",
          content: "W29 | Dedicated Mail | Dyson",
          id: "591@motocal.netw",
          color: "EAAB24"
        }
      ],
      options: {
        zoomMax: 31536000000,
        zoomMin: 604800000,
        editable: {
          add: false, // add new items by double tapping
          updateTime: true, // drag items horizontally
          updateGroup: true, // drag items from one group to another
          remove: false, // delete an item by tapping the delete button top right
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
          element.id = item.id;
          return this.visibleDays === 7
            ? `<div class="communication-item">
                <header class="communication-header" style="background: #${item.color}">
                  <div class="communication-header-date">${moment(item.start).format("DD/MM/YY")} - ${moment(item.end).format("DD/MM/YY")}</div>
                  <div class="communication-header-icons">&sect; &copy; &reg;</div>
                </header>
                <div class="communication-body" style="background: ${this.hexToRgba(item.color,0.25)}">
                  ${item.content}
                </div>
              </div>`
            : `<div class="communication-line" style="background: #${item.color}">
                <div class="communication-tooltip" style="background: #${item.color}; border-color: #${item.color}; color: #fff">
                <p>${item.content}</p>
                <span>${moment(item.start).format("DD/MM/YY")}</span>
              </div>
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
        groupTemplate: group => {
          return `<div class="group">
                    <h5 class="group-title">${group.content}</h5>
                    <div class="group-menu"></div>
                  </div>`;
        },
        onMove: (item, callback) => {
          if (
            this.parentGroups.find(group => {
              return group.id === item.group;
            })
          ) {
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
    removeItem(selectedItem) {
      console.log('remove item ', selectedItem)
    },
    editItem(selectedItem) {
      console.log('edit item ', selectedItem)
    },
    cloneItem(selectedItem) {
      console.log('clone item ', selectedItem)
    },
    hexToRgba(hex, alpha = 1) {
      const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
      return `rgba(${r},${g},${b},${alpha})`;
    },
    getColor(hex) {
      const num = parseInt(hex, 16) / 2;
      return num.toString(16);
    },
    onItemUpdate(data) {
      // console.log("update: ", data);
    },
    onRangechanged(data) {
      // console.log("rangechanged: ", data);
      this.$refs.timeline.$el.dataset.days = this.getVisibleDays();
    },

    getVisibleDays() {
      const dateParams = this.$refs.timeline.getWindow();
      const millisecondsInDay = 86400000;
      this.visibleDays =
        (moment(dateParams.end) - moment(dateParams.start)) / millisecondsInDay;
      return (
        (moment(dateParams.end) - moment(dateParams.start)) / millisecondsInDay
      );
    },

    onContextmenu(props) {
      props.event.preventDefault();
      if (props.item) {
        this.selectedItem = props.item;

        this.$refs.contextMenu.classList.add("show");

        this.contextMenuTop = props.pageY;
        this.contextMenuLeft = props.pageX;
      }
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
  },

  watch: {
    visibleDays(val, oldVal) {
      if ((val === 7 && oldVal > 7) || (val > 7 && oldVal === 7))
        this.$refs.timeline.redraw();
    }
  },

  mounted() {
    document.addEventListener('click', (e) => {
      if (e.which === 1) {
        this.$refs.contextMenu.classList.remove("show");
      }
    });
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

.context-menu {
  display: none;
  min-width: 135px;
  position: absolute;
  left: 0;
  top: 0;
  border: 1px solid #ced7e1;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  margin: 0;
  padding: 0;
  list-style: none;
  z-index: 999;
  li {
    position: relative;
    font-size: 12px;
    padding: 10px 10px 10px 15px;
    cursor: pointer;
    text-align: left;

    &:hover {
      background: #f2f6fa;
    }
  }

  &.show {
    display: block;
  }
}

.vis-panel.vis-center {
  overflow: initial;
}

.vis-panel.vis-left {
  background: #fff;
  z-index: 3;
}

.vis-nesting-group {
  .group-menu {
    display: none;
  }
}

.vis-current-time {
  background-color: #7c89d3;
  width: 1px;

  // &::before {
  //   content: '';
  //   position: absolute;
  //   top: 0;
  //   left: calc(50% - 3px);
  //   width: 6px;
  //   height: 6px;
  //   background-color: #7C89D3;
  //   border-radius: 50%;
  // }
}

.communication-line {
  height: 10px;
  min-width: 10px;
  position: relative;
  border-radius: 4px;

  &:hover {
    .communication-tooltip {
      display: block;
    }
  }
}

.communication-body {
  font-size: 12px;
  text-align: left;
  padding: 10px 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.communication-header {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  min-height: 20px;
  font-size: 11px;
  color: #fff;
  padding: 4px 8px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.communication-tooltip {
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

.vis-item {
  background: transparent;
  border-color: transparent;

  &:hover {
    .communication-tooltip {
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
    background: #f2f6fa;
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
    content: "";
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
  background: #dee4ec;
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
    content: "";
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
  background: url("../assets/chevron.svg") center no-repeat;
}

.vis-label.vis-nesting-group.collapsed:before {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  content: "";
  width: 10px;
  height: 10px;
  background: url("../assets/chevron.svg") center no-repeat;
}
</style>