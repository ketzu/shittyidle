import { mapGetters } from 'vuex'

export default {
  computed: {
    buycount: {
      get() {
        return this.$root.buyamount;
      },
      set(value) {
        this.$root.buyamount = value;
      }
    },
    buytoupgrade: {
      get() {
        return this.$root.buytoupg;
      },
      set(value) {
        this.$root.buytoupg = value;
      }
    },
    buildings: {
      get() {
        return this.$root._buildings;
      }
    },
    infrastructure: {
      get() {
        return this.$root._infrastructure.filter(obj => obj.reqlevel<=this.citylevel);
      }
    },
    ...mapGetters(['resource', 'resourcegain','tickrate','basegain','cityname',
      'towntype','nexttowntype','title','currency',
      'citylevel', 'cityupgradeable',
      'alltime','resetresource',
      'resettable','resets',
      'experience','expgain','expmult'])
  }
}