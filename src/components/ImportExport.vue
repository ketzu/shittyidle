<template>

  <v-dialog v-model="dialog" max-width="600px">
    <v-btn slot="activator" icon id="importexporttoggle">
      <v-icon>fas fa-exchange-alt</v-icon>
    </v-btn>
    <v-card>
      <v-card-title style="background-color: #2e7d32; color: white;">
        <v-container fluid>
          <v-layout>
            <v-flex xs12 align-end flexbox>
              <span class="headline">
                <v-icon large color="white">fas fa-exchange-alt</v-icon>
                Import / Export
              </span>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-lg>
          <v-layout align-start justify-center row wrap>
            <v-flex xs10>
              <v-text-field
                  ref="exportfield"
                  :value="exportstate"
                  label="Export"
                  readonly
              ></v-text-field>
            </v-flex>

            <v-flex xs10>
              <v-text-field
                  v-model="importstate"
                  label="Import"
                  clearable
              >
                <v-btn style="top: -12px" slot="append-outer" @click="completeimport()">Import</v-btn>
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions style="background-color: #2e7d32;">
        <v-spacer></v-spacer>
        <v-btn color="white" flat @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "ImportExport",
    data() {
      return {
        dialog: false,
        importstate: ""
      }
    },
    computed: {
      exportstate: {
        get() {
          return btoa(encodeURIComponent(localStorage.getItem('cidle-v1')).replace(/%([0-9A-F]{2})/g,
            (match, p1) => {
              return String.fromCharCode('0x' + p1);
          }));
        }
      }
    },
    methods: {
      completeimport() {
        localStorage['cidle-v1'] = decodeURIComponent(atob(this.importstate).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        location.reload();
      }
    }
  }
</script>

<style scoped>

</style>