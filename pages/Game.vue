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
            @click="chooseAnswer(answer)"
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
    <v-card
      v-if="bag.length > 0"
      color="pink darken-2"
    >
      <v-list >
        <v-subheader><v-icon>mdi-sack</v-icon>Current Items in Inventory</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="(item, i) in bag"
            :key="i"
          >
            <v-list-item-icon>
              <v-icon>mdi-sword-cross</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{item.name}}</v-list-item-title>
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
      hasCharacter: false, 
      bag: [],
    }
  },
  created() {
    this.getUserCharacter(1);
  },
  methods: {
    chooseAnswer: function (answer) {
      console.log('ANSWER!!!!', answer);
      console.log('CHOSEN ANSWER ID', answer.id);
      console.log('NEXT QUESTION TO LOAD', answer.nextQuestion);
      let charId = this.savedCharacter[0].id
      this.getCurrentQuestion(answer.nextQuestion);
      HTTP.put(`/character/${charId}/question/${answer.nextQuestion}`).then(response => {
        console.log(JSON.stringify(response.data));
      })
      if(answer.isItem){
        console.log("adding to bag", JSON.stringify(answer))
        this.bag.push(answer);
        let bag = this.bag;
        HTTP.post(`/bag/${charId}/item/${answer.id}`).then(response => {
          console.log(JSON.stringify(response.data))
          console.log(JSON.stringify(bag))
        })
      }
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
          if(this.currentQuestion[0].hasItem){
            HTTP.get(`/item/${currentQuestion[0].id}`).then(response => {
              console.log('Item: ', JSON.stringify(response.data[0].name), ' with buff: ', JSON.stringify(response.data[0].strengthBuff));
              currentAnswers.push(response.data[0]);
              this.currentAnswers = currentAnswers;
            })
          }
        })
      })
      console.log('Current question: ', JSON.stringify(this.currentQuestion))
      console.log('Current Answers: ', JSON.stringify(this.currentAnswers))
    }
  }
}
</script>
