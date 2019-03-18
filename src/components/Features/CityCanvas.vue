<template>
  <div ref="pdiv" style="width: 100%; height: 100%;">
    <canvas ref="canv"></canvas>
  </div>
</template>

<script>
  const paint = (ctx, parent, store) => {
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.width, ctx.height);

    // make size appropriate
    if(parent !== null) {
      ctx.width = parent.clientWidth;
      ctx.height = parent.clientHeight;
    }

    // draw background
    ctx.strokeStyle="white";
    ctx.lineWidth=1;
    ctx.fillStyle = "#2e7d32";
    ctx.beginPath();
    ctx.rect(0,0,ctx.width,ctx.height);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Building stuff
    const buildings = store.getters.buildinglevels;
    const infra = store.getters.infrastructurelevels;
    const grid = store.getters.citygrid;

    // draw zones
    const wsep = ctx.width/grid.length;
    const hsep = ctx.height/grid.length;
    for(let x=0; x<grid.length; x+=1) {
      for(let y=0; y<grid.length; y+=1) {
        ctx.beginPath();
        ctx.rect(x*wsep, y*hsep, wsep, hsep);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      }
    }
  };

  export default {
    name: "CityCanvas",
    mounted() {
      const canvas = this.$refs.canv;
      const parent = this.$refs.pdiv;
      const ctx = canvas.getContext("2d");

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      const store = this.$store;

      window.requestAnimationFrame(() => paint(ctx,parent, store));

      window.addEventListener("resize", () => paint(ctx,parent, store));
    }
  }
</script>

<style scoped>

</style>