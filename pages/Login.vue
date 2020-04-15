<template>
    <div>
      <h2>Login</h2>
      <v-form
        ref="form"
        v-model="valid"
      >
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          required
          type="password"
        ></v-text-field>
        <v-btn
          color="primary"
          nuxt
          @click="login"
        >
          Login          
        </v-btn>
      </v-form>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark v-on="on">Create Account</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">New User</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field label="Name*" id="email" v-model="newName" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field label="Email*" id="email" v-model="newEmail" :rules="emailRules" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field label="Password*" id="password" v-model="newPassword" type="password" required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialog = false">Close</v-btn>
            <v-btn color="blue darken-1" text @click="dialog = false, createUser()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
</template>

<script>
import {HTTP} from '@/api/http-common';
export default {
  name: "Login",
  data() {
    return {
      dialog: false,
      valid: true,
      newEmail: '',
      newPassword: '',
      newName: '',
      password:'',
      email: 'trev125@gmail.com',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
    }
  },
  methods: {
    login: function () {
      let email = this.email
      let password = this.password
      let data = {
        email: email,
        password: password
      }
      HTTP.post("/api/login", data)
        .then((response) => {
          console.log("Logged in")
          //console.log('this', this)
          //console.log('this.nuxt', this.$nuxt)
          window.$nuxt.$router.push('/')
        })
        .catch((errors) => {
          console.log(errors)
          console.log("Cannot log in")
        })
    },
    createUser: function (){
      if(this.newEmail && this.newPassword && this.newName){
        console.log(this.newName, this.newEmail, this.newPassword)
        HTTP.post('/user', {
          "name": this.newName, 
          "email": this.newEmail, 
          "password": this.newPassword
        })
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    }
  }
}
</script>