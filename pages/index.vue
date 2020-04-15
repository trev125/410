<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <div class="text-center">
        <v-icon x-large>mdi-sack</v-icon>
        <v-icon x-large>mdi-sword</v-icon>
        <v-icon x-large>mdi-shield</v-icon>
        <v-icon x-large>mdi-treasure-chest</v-icon>
        <!-- <logo />
        <vuetify-logo /> -->
      </div>
      <v-card>
        <v-card-text>
          <p class="text-center display-2 white--text">
            Choose Your Own Adventure: Bragan's Wrath
          </p>
          <hr class="my-3">
          <p class="headline">
            The land of Frodshire is in peril!
          </p>
          <p>
            Bragan, an evil wizard, has come to destroy all of the inhabitants of the land. 
          </p>
          <p>
            You, a knight of King Dradeer, have an uncanny ability for magic as well as physical strength. 
            This has helped you gain the favor of the king, and he has sent you on an ever-important quest. 
          </p>
          <p>
            Your duty is to:
            <ol>
              <li>Travel to the Caves of Yorgmire</li>
              <li>Find Bragan the Wizard</li>
              <li>Stop Bragan’s reign of terror</li>
            </ol>
          </p>
          <p class="font-italic">
            Good Luck!
          </p>
          <hr class="my-3">
          <p>
            Throughout this game you will be given choices, which if you choose incorrectly will cause your demise. 
            If you make it all the way through this quest and successfully stop Bragan, then Frodshire will be saved 
            and the game will be completed.
          </p>
        </v-card-text>
        <v-card-actions
          v-if="savedCharacter.length > 0"
        >
            <v-btn
              color="primary"
              nuxt
              to="/characterPage"
            >
              View {{savedCharacter[0].name}}
            </v-btn>
            <v-spacer />
            <v-btn
              color="error"
              nuxt
              to="/game"
            >
              Continue to game
            </v-btn>
        </v-card-actions>
        <v-card-actions
          v-else
        >
            <v-btn
              color="primary"
              nuxt
              to="/characterPage"
            >
              Create a Character
            </v-btn>
            <v-spacer />
            <v-tooltip bottom>
              <template v-slot:activator="{ on }" open-on-hover>
                <span v-on="on">
                  <v-btn
                    color="error"
                    nuxt
                    to="/game"
                    disabled
                  >
                    Continue to game
                  </v-btn>
                </span>
              </template>
              <span>Please create a character before playing</span>
            </v-tooltip>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import {HTTP} from '@/api/http-common';

export default {
  data() {
    return {
      hasCharacter: false,
      savedCharacter: [],
    }
  },
  components: {
    Logo,
    VuetifyLogo
  },
  created() {
    this.checkUserCharacter(1);
  },
  methods: {
    checkUserCharacter: function(userID){
      HTTP.get(`/user/${userID}`).then(response => {
        console.log(JSON.stringify(response.data));
        if(response.data.length > 0){
          this.savedCharacter = response.data;
          this.hasCharacter = true;
        }
        else {
          console.log('no char')
          this.hasCharacter = false;
        }
      })
    },
  }
}
</script>
