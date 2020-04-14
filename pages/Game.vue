<template>
  <div class="profile">
    <h1>Welcome to Choose Your Own Adventure: Bragan's Wrath</h1>
    <v-card
      class="mx-auto"
      tile
      v-if="currentQuestion.length > 0"
    >
      <v-list >
        <v-subheader>{{currentQuestion[0].questionText}}</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="(answer, i) in currentAnswers"
            :key="i"
            @click="chooseAnswer(answer.id, answer.nextQuestion)"
          >
            <v-list-item-icon>
              <v-icon>mdi-help</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{answer.answer}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import {HTTP} from '@/api/http-common';

export default {
  data() {
    return {
      currentCharacter: [],
      currentQuestion: [],
      currentAnswers: [],
      savedCharacter: [],
      hasCharacter: false
    }
  },
  created() {
    this.getUserCharacter(1);
  },
  methods: {
    chooseAnswer: function (id, nextQuestion) {
      console.log('CHOSEN ANSWER ID', id);
      console.log('NEXT QUESTION TO LOAD', nextQuestion);
      this.getCurrentQuestion(nextQuestion);
    },
    getUserCharacter: function(userID){
      HTTP.get(`/user/${userID}`).then(response => {
        console.log(JSON.stringify(response.data));
        if(response.data.length > 0){
          this.savedCharacter = response.data;
          this.hasCharacter = true;
          console.log('got something')
          if(this.savedCharacter[0].currentQuestion === null){
            this.savedCharacter[0].currentQuestion = 1;
          }
          this.getCurrentQuestion(this.savedCharacter[0].currentQuestion);
        }
        else {
          console.log('no char')
          this.hasCharacter = false;
        }
      })
    },
    getCurrentQuestion: function(currentCharacterQuestion){
      console.log('Question being loaded...',currentCharacterQuestion)
      let currentQuestion = [];
      let currentAnswers = [];
      HTTP.get(`/question/${currentCharacterQuestion}`).then(response => {
        console.log('Question: ',JSON.stringify(response.data));
        currentQuestion = response.data;
        this.currentQuestion = currentQuestion;
        console.log(JSON.stringify(currentQuestion[0].id));
        HTTP.get(`/answer/${currentQuestion[0].id}`).then(response => {
          console.log('Answers: ', JSON.stringify(response.data))
          currentAnswers = response.data;
          this.currentAnswers = currentAnswers;
        })
      })
      console.log('Current question: ', JSON.stringify(this.currentQuestion))
      console.log('Current Answers: ', JSON.stringify(this.currentAnswers))
    }
  }
}
</script>
