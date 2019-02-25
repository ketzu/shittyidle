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
    ...mapGetters(['resource', 'resourcegain','tickrate','basegain','cityname',
      'towntype','nexttowntype','title','currency',
      'citylevel', 'cityupgradeable',
      'infrastructure',
      'alltime','resetresource',
      'resettable','resets',
      'experience','expgain','expmult'])
  }
}