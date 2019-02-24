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
    ...mapGetters(['resource', 'resourcegain','tickrate','basegain',
      'towntype','nexttowntype','title','currency',
      'citylevel', 'cityupgradeable',
      'infrastructure',
      'alltime','resetresource',
      'resettable','resets',
      'experience','expgain','expmult'])
  }
}