<template>
  <v-snackbar v-model="flag" multi-line :timeout="5000" top right>
    {{ text }}
    <v-btn dark text @click="flag = false">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
  export default {
    name: "Notification",
    props: ['text'],
    data() {
      return {
        flagstate: false
      }
    },
    computed: {
      flag: {
        get() {
          return this.flagstate;
        },
        set(value) {
          if(!value && this.flagstate)
            this.$emit('done');
          this.flagstate = value;
        }
      }
    },
    mounted() {
      this.flagstate = true;
    }
  }
</script>

<style scoped>

</style>
