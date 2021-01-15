<template>
  <v-list subheader flat>
    <v-subheader class="subheader mt-8">Completed:</v-subheader>
    <p v-if="countDone() === 0" class="text-center info-message">
      No completed Todos yet
    </p>
    <v-list-item-group v-else multiple @click.prevent="" @click.stop="">
      <div v-for="task in tasks" :key="task.id">
        <v-list-item
          v-if="task.done === true"
        >
          <template>
            <v-list-item-action>
              <v-checkbox
                @click="doneTask(task.id)"
                :class="{ 'blue lighten-5': task.done }"
                :input-value="task.done"
                color="primary"
              ></v-checkbox>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title
                :class="{ 'text-decoration-line-through': task.done }"
              >
                {{ task.title }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click.stop="deleteTask(task.id)">
                <v-icon color="grey lighten-1">mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
        <v-divider v-if="task.done"></v-divider>
      </div>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { mapState } from "vuex";
import store from "../../store/index";
const axios = require("axios");
import Vue from "vue";

export default {
  name: "TodoCompleted",
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
  methods: {
    countDone() {
      let count = 0;
      if (this.$store.getters.tasks === null) return 0;
      this.tasks.forEach((task) => {
        if (task.done) {
          count += 1;
        }
      });
      return count;
    },
    doneTask(id) {
      this.tasks.forEach((task) => {
        if (task.id === id) {
          task.done = !task.done;
        }
      });
      store.dispatch({
        type: "setTasks",
        value: this.tasks,
      });
      this.updateDB();
    },
    deleteTask(id) {
      store.dispatch({
        type: "deleteTask",
        value: id,
      });
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
  }
}
</script>

<style>
  .info-message {
    margin-top: 10px;
    font-size: 14px;
  }
</style>