import React, { Component } from 'react';
import { Container,Header,Title, Content, List, ListItem, InputGroup, Input, Icon, Text, Picker, Button,Tabs } from 'native-base';
import {View } from 'react-native';
import Login from './Login'
import Signup from './Signup'

export default class LoginSignup extends Component {
    
        constructor(props) {
        super(props);
        this.state = {
            }
        };

render(){
 return(
        <Container> 
         <Header>
         <Title>AllergyWatch</Title>
         </Header>
         <Content>
          <Tabs>
            <Login tabLabel="Login" loginCallBack={this.props.loginCallBack} />
            <Signup tabLabel="Signup" loginCallBack={this.props.loginCallBack}/>
          </Tabs>
         </Content>
        </Container>
     );   
  }
}
