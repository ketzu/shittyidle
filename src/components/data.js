import { mapGetters } from 'vuex'

export default {
  computed: {
    buycount: {
      get() {
        return this.$store.getters.buycount;
      },
      set(value) {
        if(value>0)
          this.$store.dispatch('setbuycount', value);
      }
    },
    buytoupgrade: {
      get() {
        return this.$store.getters.buytoupgrade;
      },
      set(value) {
        this.$store.dispatch('setbuytoupg', value);
      }
    },
    buildings: {
      get() {
        return this.$root.store_buildings;
      }
    },
    infrastructure: {
      get() {
        return this.$root.store_infrastructure.filter(obj => obj.reqlevel<=this.citylevel);
      }
    },
    ...mapGetters(['resource', 'resourcegain','tickrate','basegain','cityname','upgradeindicator',
      'towntype','nexttowntype','title','currency',
      'citylevel', 'cityupgradeable',
      'alltime','resetresource',
      'resettable','resets',
      'experience','expgain','expmult'])
  }
}