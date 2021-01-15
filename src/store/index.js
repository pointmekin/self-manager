import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tasks: [
      
    ],
    lineProfile: {
      pictureUrl: '',
      displayName: '',
      userId: ''
    },
    dialog: {
      show: false,
      task: {
        done: null,
        title: null,
        id: null,
        description: null
      }
    }
  },
  getters: {
    tasks: state => {
      return state.tasks
    },
    tasksLength: state=> {
      return state.tasks.length
    },
    getLine: state => {
      return state.lineProfile
    },
    getTaskDialog: state => {
      return state.dialog
    }
  },
  mutations: {
    setTasks (state, payload) {
      Vue.set(state, 'tasks', payload.value)
    },
    deleteTask(state, payload) {
      const index = state.tasks.findIndex(item => item.id == payload.value)
      state.tasks.splice(index, 1)
    },
    addTask(state, payload) {
      state.tasks.push(
        payload.value
      )
    },
    setLine(state, payload) {
      state.lineProfile = {
        ...state.line,
        ...payload.value
      }
    },
    setCurrentTask(state, payload) {
      const currentTask = {
        ...state.dialog,
        task: payload.value,
        show: true
      }
      Vue.set(state, 'dialog', currentTask)
    },
    closeDialog(state) {
      Vue.set(state.dialog, 'show', false)
    }
  },
  actions: {
    addNewTodo (context, payload) {
      context.commit('addNewTodo', payload)
    },
    setTasks (context, payload) {
      context.commit('setTasks', payload)
    },
    deleteTask (context, payload) {
      context.commit('deleteTask', payload)
    },
    addTask(context, payload) {
      context.commit('addTask', payload)
    },
    setLine( context, payload) {
      context.commit('setLine', payload)
    },
    setCurrentTask( context, payload) {
      context.commit('setCurrentTask', payload)
    },
    closeDialog(context, payload) {
      context.commit('closeDialog', payload)
    }
  },
  modules: {
  }
})
