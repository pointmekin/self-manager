<template>
  <section id="app" class="section">
    <p class="time shadow" v-text="currentTime"></p>
  </section>
</template>

<script>
import moment from 'moment'
export default {
  name: "Clock",
  data(){
    return {
      message: "Current Time:",
      currentTime: null
    }
  },
  methods: {
    updateCurrentTime() {
        this.currentTime = moment().format("LTS");
    }
  },
  created() {
    this.currentTime = moment().format("LTS");
    setInterval(() => this.updateCurrentTime(), 1 * 1000);
  }
}
</script>

<style lang="scss" scoped>
 
</style>