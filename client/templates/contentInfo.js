import React, { Component } from 'react';
import { Container,Header,Title, Content, List, ListItem, InputGroup, Input, Icon, Text, Picker, Button,Tabs } from 'native-base';
import {View } from 'react-native';
import Login from './Login'
import Signup from './Signup'

export default class Test extends Component {

        constructor(props) {
        super(props);
        this.state = {
            }
        };

render(){
 return(
        <Container>
         <Header>
         <Title>Allergic Content Found</Title>
         </Header>
        </Container>
     );
  }
}
