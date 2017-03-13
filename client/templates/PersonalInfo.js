import React, { Component } from 'react';
import {AsyncStorage,ToastAndroid, StyleSheet, ToolbarAndroid,ScrollView} from 'react-native';
import { Container,Header,Title, Content, List, ListItem, InputGroup, Input, Icon, Text, Picker, Button, Card,CardItem, Fab } from 'native-base';


const USER_REFERENCE = 'email';

export default class PersonalInfo extends Component {
        constructor(props) {
        super(props);
        this.state = {
            fname:'',
            email:'',
            allergys:'',
            allergyName:''
            }
        this.addNewAllergy=this.addNewAllergy.bind(this);
        this.removeAllergy=this.removeAllergy.bind(this);
        this.updateAllergyName=this.updateAllergyName.bind(this);
        this.getEmail=this.getEmail.bind(this);
        };


async getEmail() {
    var self=this;
   try {
     let email = await AsyncStorage.getItem(USER_REFERENCE);
     console.log("Inside Getemail",email)
     if(!email) {
         console.log("Error");
     } else {
         console.log("Success",email);
         self.setState({email: email})
         var url= 'https://allergywatch.herokuapp.com/allergy/'+ this.state.email
          fetch(url,{method: "GET"})
           .then((response) => response.json())
           .then((responseData) => {
            alrgys =[];
            for(var i=0; i<responseData.allergy.length; i++){
            if(i<(responseData.allergy.length-1))
            alrgys.push(responseData.allergy[i].allergyName + ', ');
            else
            alrgys.push(responseData.allergy[i].allergyName);
            }
           console.log(responseData);

           self.setState({
            fname:responseData.firstName,
            allergys:alrgys
           })})

          .catch((error) => {
            console.error(error);
          })
        .done;
     }
   } catch(error) {
       console.log("Something went wrong");
   }
 }

updateAllergyName(){
 console.log("Before", this.state.allergyName);
 this.setState({allergyName:''});
 console.log("After", this.state.allergyName);

var self=this;
console.log("Logging the API")
var url= 'https://allergywatch.herokuapp.com/allergy/'+ this.state.email
fetch(url,{method: "GET"})
        .then((response) => response.json())
        .then((responseData) => {

         alrgys =[];
         for(var i=0; i<responseData.allergy.length; i++){
            if(i<(responseData.allergy.length-1))
            alrgys.push(responseData.allergy[i].allergyName + ', ');
            else
            alrgys.push(responseData.allergy[i].allergyName);
            }
           console.log(responseData);

           self.setState({
            allergys:alrgys
           })})

          .catch((error) => {
            console.error(error);
          })
        .done;

}

componentWillMount(){
    this.getEmail();        
}        




  addNewAllergy(){
     var url='https://allergywatch.herokuapp.com/allergy/'

     fetch(url, {method: 'PUT',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
      },
     body: JSON.stringify({
      email:this.state.email,
      allergyName:this.state.allergyName,
      ingredient: this.state.allergyName})})
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        console.log(responseJson.message)
         if(responseJson.message=='success'){
           this.updateAllergyName();
           ToastAndroid.showWithGravity("Allergy Added", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        }})
    .catch((error) => {
        console.error(error);
      })
    .done;
   }

   removeAllergy(){
    var url='https://allergywatch.herokuapp.com/allergy/'
      fetch(url, {method: 'DELETE',
       headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       },
      body: JSON.stringify({
      email:this.state.email,
      allergyName:this.state.allergyName})})
    .then((response) => response.json())
    .then((responseJson) => {
       console.log(responseJson);
       console.log(responseJson.message)
         if(responseJson.message=='success'){
           this.updateAllergyName();
           ToastAndroid.showWithGravity("Allergy Deleted", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
        }})
    .catch((error) => {
        console.error(error);
      })
    .done;
  }

    render(){
        console.log("InsideRender")
        var self = this;
        return(
            <Container>            
            <Content style={{ alignSelf: 'center', marginBottom: 10 }}>
            <ScrollView>
              <Card>
               <CardItem>
                  <Text>Name : <Text>{this.state.fname}</Text> </Text>
               </CardItem>
               <CardItem>
                  <Text>Email : <Text>{this.state.email}</Text> </Text>
               </CardItem>
               <CardItem>
                  <Text>Allergies : {this.state.allergys}</Text>
               </CardItem>
             </Card>


            <List>
            <ListItem>
                <InputGroup>
                    <Input style={{marginTop: 50 }} onChangeText={(text)=>this.setState({allergyName: text})} 
                      value={this.state.allergyName} placeholder="Enter Allergy Name to Add/Delete" />
                </InputGroup>
            </ListItem>
            <Fab
                active='true'
                direction="right"
                containerStyle={{ marginLeft: 10 }}
                position="bottomRight"
            >
              <Icon name="ios-add" style={{fontSize: 20, color: 'red'}} onPress={this.addNewAllergy} />
            </Fab>
            <Fab
                active='true'
                direction="right"
                containerStyle={{ marginLeft: 10 }}
                position="bottomLeft"
            >
              <Icon name="ios-remove" style={{fontSize: 20, color: 'red'}} onPress={this.removeAllergy} />
            </Fab>
            </List>
                </ScrollView>
           </Content>
            
        </Container>
        );
     }
}

const styles = StyleSheet.create({
  
  toolbar: {
    backgroundColor: '#2a7d5e',
    height: 56,
  },
});
