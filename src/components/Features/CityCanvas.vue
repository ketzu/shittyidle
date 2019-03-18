<template>
  <div style="width: 100%; height: 100%;">
    <canvas width="700" height="250" v-draw-city="15"></canvas>
  </div>
</template>

<script>
  import * as Vue from "vue";

  export default {
    name: "CityCanvas",
    directives: {
      drawCity: (canvasElement, state) => {
        // Get canvas context
        let ctx = canvasElement.getContext("2d");

        // make size appropriate
        if(canvasElement.parentNode !== null) {
          ctx.width = canvasElement.parentNode.clientWidth;
          ctx.height = canvasElement.parentNode.clientHeight;
        }

        // Clear the canvas
        ctx.clearRect(0, 0, ctx.width, ctx.height);

        // draw something on the canvas
        ctx.strokeStyle="white";
        ctx.lineWidth=1;
        ctx.fillStyle = "#2e7d32";
        ctx.beginPath();
        ctx.rect(0,0,ctx.width,ctx.height);
        ctx.fill();
        ctx.stroke();
      }
    }
  }
</script>

<style scoped>

</style>