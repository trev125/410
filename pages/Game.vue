<template>
  <div class="profile">
    <h1>Welcome to Choose Your Own Adventure: Bragan's Wrath</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentCharacter: [],
      currentQuestion: [],
      currentAnswers: [],
    }
  },
  created() {
    // this.getUserCharacter().then(()=> {
    //   this.getCurrentQuestion(this.currentCharacter)
    // })

    //CURRENT ISSUE: the async way these are called
    this.getUserCharacter();
    this.getCurrentQuestion(this.currentCharacter);
  },
  methods: {
    getUserCharacter: function (){
    let currentCharacter = [{
        "id": 1,
        "userId": 1,
        "name": 'Trevor Allen',
        "strength": 8,
        "dex": 7,
        "speech": 6,
        "intel": 4,
        "currentQuestion": 1,
      }];
      this.currentCharacter = currentCharacter;
    },
    getCurrentQuestion: function(currentCharacter){
      let currentQuestionID = currentCharacter.currentQuestion;
      //get question based on question ID
      console.log(currentQuestionID);
      if(currentQuestionID === 1){
        this.currentQuestion = [{
          "id": 1,
          "question": "You come to a fork in the road. You have been told the Caves of Yorgmire are 'East, towards the mountains'. Which way do you go?"
        }]
        this.currentAnswers = [
          {
            "id":1,
            "question":1,
            "answer": "Go to the left, where you think you see a mountain through the trees"
          },
          {
            "id":2,
            "question":1,
            "answer": "Go to the right, where you see some swamps"
          },
          {
            "id":2,
            "question":1,
            "answer": "Sit on the ground and think"
          }
        ]
      }
      console.log(JSON.stringify(this.currentQuestion), JSON.stringify(this.currentAnswers))
    }
  }
}
</script>
