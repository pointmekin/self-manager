<template >
  <div class="about">
    <v-text-field
      v-model="newTaskTitle"
      @click:append="addTask"
      @keyup.enter="addTask"
      class="px-5 higher"
      outlined
      label="Add a new todo"
      append-icon="mdi-plus"
      hide-details
      clearable
      dark
    ></v-text-field>
    <div>
      <div class="top-spacer"></div>
      <TodoList/>
      <TodoCompleted /> 
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "../../store/index";
const axios = require("axios");
import Vue from "vue";
import TodoCompleted from "./TodoCompleted"
import TodoList from "./TodoList"

export default {
  name: "Todo",
  components: {
    TodoCompleted,
    TodoList
  },
  computed: mapState({
    tasksLength: function(state) {
      return state.tasks ? state.tasks.length : 0;
    },
    tasks: function(state) {
      return state.tasks;
    },
    userId: function(state) {
      return state.lineProfile.userId
    }
  }),
  data() {
    return {
      newTaskTitle: "",
      edittingTaskTitle: "",
      loading: true,
      items: [
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me 2" },
      ],
      editId: 0
    };
  },
  methods: {
    addTask() {
      if (this.newTaskTitle === "") {
        console.log("eh");
      }
      let newTask = {
        id: Date.now(),
        title: this.newTaskTitle,
        done: false,
      };
      if (!this.tasks) {
        store.dispatch({
          type: "setTasks",
          value: [newTask],
        });
      } else {
        store.dispatch({
          type: "addTask",
          value: newTask,
        });
      }
      this.newTaskTitle = "";
      this.updateDB();
    },
    updateDB() {
      axios
        .patch(
          `https://self-manager-868b0-default-rtdb.firebaseio.com/user/${this.userId}/.json`,
          { todos: this.$store.getters.tasks }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
  },
};
</script>

<style lang="scss">
  .v-subheader {
    height: 30px;
    padding-bottom: 0px;
    margin-top: 15px;
  }
  .higher {
    z-index: 5;
    position: fixed;
    width: 100%;
    top: 125px;
  }
  .info-message {
    margin-top: 10px;
    font-size: 14px;
    color: #c6c6c6;
  }
  .top-margin {
    margin-top: 90px;
  }
  .save-and-cancel{
    margin-top: 0;
    padding-top: 0;
    text-align: right;
  }
  .v-list-item__content {
    padding: 0 !important;
  }
  .wrap-text {
    -webkit-line-clamp: unset !important;
    white-space: normal !important;
  }
  .top-spacer {
    margin-top: 100px;
  }
</style>
