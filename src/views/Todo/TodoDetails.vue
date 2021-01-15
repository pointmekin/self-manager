
<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="#0097a7"
        >
          <v-btn
            icon
            dark
            @click="closeTaskDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="save"
            >
              Save
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div>
          <v-col cols="12" class="mt-3">
            <div class="px-4">
              <v-textarea
                id="dialogTaskTitle"
                label="Title"
                flat 
                solo
                dense
                auto-grow
                rows="2"
                hide-details
                placeholder="Title"
                class="pt-0 task-title"
                v-model="edittingTaskTitle"
              ></v-textarea>
            </div>
            <div class="px-4">
              <v-textarea
                label="Description"
                flat 
                solo
                dense
                auto-grow
                hide-details
                placeholder="Description"
                class="pt-0 task-description"
                v-model="description"
              ></v-textarea>
            </div>
          </v-col>
        </div>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import store from "../../store/index";

export default {
  name:"TodoDetailsDialog",
  computed: mapState({
    dialog: function(state) {
      return state.dialog;
    },
  }),
  methods: {
    closeTaskDialog() {
      this.showDialog = false
      store.dispatch({type: "closeDialog", value: false})
    },
    setTaskTitle() {
      this.edittingTaskTitle = this.dialog.task.title
      console.log(this.dialog.task.title)
    },
    save() {
      let tasksList = this.$store.getters.tasks
      const index = tasksList.findIndex(task => task.id == this.dialog.task.id);
      tasksList[index] = {
        ...tasksList[index],
        title: this.edittingTaskTitle,
        done: this.dialog.task.done,
        description: this.description
      }
      store.dispatch({type: "setCurrentTask", value: {
        show: false,
        task: {
          done: null,
          title: null,
          id: null,
          description: null

        }
      }})
      store.dispatch({type:"setTasks", value: tasksList})
      this.$parent.updateDB()
      this.closeTaskDialog()
    }
  },
  data () {
    return {
      showDialog: this.$store.getters.getTaskDialog.show,
      notifications: false,
      sound: true,
      widgets: false,
      editTitle: false,
      edittingTaskTitle: this.$store.getters.getTaskDialog.task.title,
      description: this.$store.getters.getTaskDialog.task.description ? this.$store.getters.getTaskDialog.task.description : '',
    }
  },
}
</script>

<style lang="scss" scoped>
  .text-field-outlined-margin-bottom {
    display: none;
  }
 .task-title {
    font-size: 24px;
    font-weight: bold;
  }
</style>