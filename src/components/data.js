import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['resource', 'resourcegain','tickrate','basegain',
      'towntype','nexttowntype','title','currency','citylevel', 'cityupgradeable',
      'alltime','resetresource',
      'resettable','resets',
      'experience','expgain','expmult'])
  }
}