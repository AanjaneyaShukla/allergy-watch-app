import React, { Component } from 'react';
import {ToolbarAndroid, StyleSheet, Alert, AsyncStorage,ScrollView } from 'react-native';
import { Container, Icon, View, Title,Button, Card, CardItem, Header, Text, Content , ListItem, List, Image} from 'native-base';
import StarRating from 'react-native-star-rating';
import Popup from 'react-native-popup'; 

const USER_REFERENCE = 'email';

var styles = StyleSheet.create({
                    camscanner: {
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "transparent",
                    }
});

export default class History extends Component {
   constructor(props) {
        super(props);
        this.state = { ola:[], email: '' }
        this.upVote = this.upVote.bind(this);
        this.fetchData = this.fetchData.bind(this);
      }

    upVote(rating,identifier){
        console.log(this.state.email);
        console.log(rating);
        console.log(identifier);
        var rate = ""+rating;
        var url='https://allergywatch.herokuapp.com/ratings/'
        fetch(url, {method: 'PUT',
             headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
             },
            body: JSON.stringify({
             email:this.state.email,
             itemId: identifier,
             rating: rate
            })})
           .then((responseJson) => {
              this.fetchData();
             })
           .catch((error) => {
               console.error(error);
             })
           .done;

    }
    async fetchData(){
          try {
                        let email = await AsyncStorage.getItem(USER_REFERENCE);
                        console.log("Inside Getemail",email)
                        if(!email) {
                            this.redirect('login');
                        } else {
                            this.setState({email: email});
                             var self = this;
                            var url = "https://allergywatch.herokuapp.com/itemHistory/" + this.state.email;
                             fetch( url, {method: "GET"})
                            .then((response) => response.json())
                            .then((responseData) => {
                                 var n = Object.keys(responseData).length;
                                 var info = [];
                                 console.log(responseData.itemHistory[0]);
                                 self.setState({ ola:responseData.itemHistory  });
                                 console.log(self.state.ola)
                            })
                            .done();
                        }
                  }
                catch(error) {
                      console.log(error);
                  }
    }

    componentDidMount(){

                this.fetchData();

            }






    render() {
        var arr=[];
        x=this.state.ola
        for(i=0;i<this.state.ola.length;i++){
                 var refer = x[i].itemId;
                 var refer1 = x[i].itemName;
                console.log(refer);
                  if(x[i].rating == 0){
                      arr.push(<CardItem key={i} style={{ backgroundColor: '#a3dbf6'}} >
                             <Text >{x[i].itemName}</Text>
                             <Text>Global rating: {x[i].globalRating}</Text>
                             <StarRating 
                                disabled={false}
                                maxStars={5}
                                identifier={refer}
                                selectedStar={(rating,identifier) => this.upVote(rating,identifier)}/>                            
                            </CardItem> 
                    );        
                  }else{
                      arr.push(<CardItem key={i} style={{ backgroundColor: '#a3dbf6'}} >
                             <Text >{x[i].itemName}</Text>
                             <Text>Global rating: {x[i].globalRating}</Text>
                             <StarRating 
                                disabled={false}
                                maxStars={5}
                                rating={x[i].rating}
                                identifier={refer}
                                selectedStar={(rating,identifier) => this.upVote(rating,identifier)}/>                            
                            </CardItem> 
                    );        
                      
                  }
                
        }

        return (
            <Container>
                <Content>
                 <ScrollView>
                    <Card style={{ flex: 0 }}>
                    {arr}
                    </Card>
                </ScrollView>
             </Content>  
            </Container>
        );
    }
}

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#2a7d5e',
    height: 56,
  },
});
