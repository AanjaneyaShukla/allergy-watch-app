import React, { Component } from 'react';
import {DrawerLayoutAndroid,View,Text, Navigator, Button, ToolbarAndroid,StyleSheet, navIcon } from 'react-native';
import { Container,Header,Title, Icon,Tabs} from 'native-base';

import DrawerContents from './DrawerContents'
import FirstPageExample from './FirstPageExample'
import SecondPageExample from './SecondPageExample'
import LoginSignup from './LoginSignup'
import History from './history.js'
import PersonalInfo from './PersonalInfo.js'

export default class MainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
         Name:'AlergyWatch'
    }
    this.onPressButton = this.onPressButton.bind(this);
    this.router = this.router.bind(this);
    this.setPageName = this.setPageName.bind(this);
  }

  onPressButton() {
    this.refs.drawer.openDrawer();
  }

  setPageName(name) {
    this.setState({Name: name});
  }

  router(route, navigator) {
       console.log(route);
       switch (route.name)
       {
          case 'home':
            return (
              <FirstPageExample navigator={navigator}/>
            );

           case 'history':
            return (
                <History />
            );

           case 'personalinfo':
                return(
                <PersonalInfo/>
            );
            
            case 'completeInformation':
                return(
                <PersonalInfo/>
            );

        }
     }



render() {
    return (
          <DrawerLayoutAndroid
            drawerWidth={300}
            drawerPosition={DrawerLayoutAndroid.positions.Left}
            renderNavigationView={() => <DrawerContents logoutCallBack={this.props.logoutCallBack} navRef={this.refs.navigator} drawerRef={this.refs.drawer}/>}
            ref='drawer'>

            <ToolbarAndroid
              navIcon={require('./images/menu.png')}
              onIconClicked={this.onPressButton}
              style={styles.toolbar}
              title='BarCodeScanner' />

            <Navigator
              initialRoute={{ name:'home'}}
              ref="navigator"
              renderScene={this.router}
            />
          </DrawerLayoutAndroid>
    );
  }
}

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#ff4f47',
    height: 56,
  },
});
