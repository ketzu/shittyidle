<template>
  <div>{{name}}: {{textvalue}}
  <v-progress-linear
      :color="color"
      height="30"
      :value="value"
  ></v-progress-linear></div>
</template>

<script>
  export default {
    name: "FutureFeature",
    props: ['name', 'state'],
    computed: {
      color() {
        switch (this.state) {
          case "notstarted":
            return "error";
          case "alpha":
            return "warning";
          case "beta":
            return "success";
        }
        return "info";
      },
      value() {
        switch (this.state) {
          case "notstarted":
            return 10;
          case "alpha":
            return 50;
          case "beta":
            return 90;
        }
        return 0;
      },
      textvalue() {
        switch (this.state) {
          case "notstarted":
            return "Not started";
          case "alpha":
            return "Alpha";
          case "beta":
            return "Beta";
        }
        return "";
      }
    }
  }
</script>

<style scoped>

</style>