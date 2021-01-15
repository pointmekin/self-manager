<template>
  <div>
    <v-list subheader flat>
      <v-subheader class="subheader top-margin justify-space-between">
        Things to do:
      </v-subheader>
      <p v-if="countDone() === tasksLength" class="text-center info-message">
        No Todos yet
      </p>
      <v-list
        v-else 
        v-draggable="{value: tasks, handle: 'handle'}"
        @change="onChange"
        @start="onDragStart"
        @end="onDragEnd"
        @click.stop=""
        @click.prevent=""
      >
        <div v-for="task in tasks" :key="task.id">
          <v-list-item
            :class="currentDragTask ===  task.title ? 'blue lighten-5' : ''"
            v-if="task.done === false"
            @click="showDetailsDialog(task)"
          >
            <template >
              <v-list-item-action>
                <v-checkbox
                @click.stop="doneTask(task.id)"
                  :class="{ 'blue lighten-5': task.done }"
                  :input-value="task.done"
                  color="primary"
                ></v-checkbox>
              </v-list-item-action>

              <v-list-item-content>
                <v-text-field
                  @click.stop=""
                  :ripple="false"
                  v-if="editId === task.id"
                  label="Edit"
                  v-model="edittingTaskTitle"
                  autofocus
                ></v-text-field>
                <v-list-item-title
                  v-else
                  class="wrap-text"
                  :class="{ 'text-decoration-line-through': task.done }"
                  v-text="task.title"
                >
                </v-list-item-title>
              </v-list-item-content>
              
              <v-list-item-action v-if="task.id !== editId && !editMode">
                <v-btn icon>
                  <v-menu transition="slide-y-transition"  close-on-content-click bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on" color="grey lighten-1">
                        mdi-dots-vertical
                      </v-icon>
                    </template>
                    <v-list>
                      <v-list-item>
                        <v-list-item-title @click.stop="handleEditTitle(task.id, task.title)">Edit</v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title @click.stop="deleteTask(task.id)">Delete</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
          
          <div v-if="task.id === editId" class="save-and-cancel">
                <span>
                  <v-btn
                    class="ma-1"
                    color="grey"
                    plain
                    @click="editId= 0"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    class="ma-1"
                    color="blue"
                    plain
                    @click="editTaskTitle(task.id)" 
                  >
                    Save
                  </v-btn>
                </span>
              </div>
          <v-divider v-if="!task.done"></v-divider>
        </div>
      </v-list>
    </v-list>
    <div v-if="dialogNotNull">
      <TodoDetailsDialog />
    </div>
    
  </div>
  
</template>

<script>
import { mapState } from "vuex";
import store from "../../store/index";
const axios = require("axios");
import Vue from "vue";
import TodoDetailsDialog from "./TodoDetails"

export default {
  name: "TodoList",
  components: {
    TodoDetailsDialog
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
    },
    dialogNotNull: function(state) {
      return state.dialog.show
    }
  }),
  data() {
    return {
      newTaskTitle: "",
      edittingTaskTitle: "",
      editId: 0,
      editMode: false,
      currentDragTask: ""
    };
  },
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
    handleEditTitle(id, title) {
      this.editId = id
      this.edittingTaskTitle = title
    },
    editTaskTitle(id) {
      this.tasks.forEach((task)=>{
        if (task.id === id) {
          task.title = this.edittingTaskTitle
        }
      })
      this.edittingTaskTitle = ""
      this.editId = 0
      store.dispatch({type: "setTasks", value: this.tasks})
      this.updateDB();
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
    onDragStart(e) {
      this.currentDragTask = e.target.innerHTML
    },
    onDragEnd(e) {
      this.currentDragTask = undefined
    },
    onChange(data) {
      if (data.from === data.to) return null
      this.updateDB()
    },
    showDetailsDialog(task) {
      store.dispatch({type:"setCurrentTask", value: task})

    }
  }
}
</script>

<style scoped>
  .handle {
    cursor: grab;
  }
</style>