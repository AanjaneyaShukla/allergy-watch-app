import React, { Component } from 'react';
import { Text,TouchableHighlight, View, Navigator, AsyncStorage, Image, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { Container, Content, Card, CardItem, Thumbnail,Button, Icon } from 'native-base';

const USER_REFERENCE = 'email';

export default class DrawerContents extends Component {
      constructor(props) {
      super(props);
      this.goHome = this.goHome.bind(this);
      this.goToFoo = this.goToFoo.bind(this);
      this.goHistory = this.goHistory.bind(this);
      this.goToPersonalInfo = this.goToPersonalInfo.bind(this);
      this.goToLogout = this.goToLogout.bind(this);
    }

    goHome() {
      // you can use different instead of push .. Information is provided on react-native page in navigation section
      this.props.navRef.replace({name: 'home'});
      this.props.drawerRef.closeDrawer();
    }

    goToFoo() {
      this.props.navRef.replace({name: 'foo'});
      this.props.drawerRef.closeDrawer();
    }

    goHistory(){
      this.props.navRef.replace({name: 'history'});
      this.props.drawerRef.closeDrawer();

    }

    goToPersonalInfo(){
     this.props.navRef.replace({name: 'personalinfo'});
     this.props.drawerRef.closeDrawer();
    }

    async goToLogout(){
        try {
        await AsyncStorage.removeItem(USER_REFERENCE);
        this.props.logoutCallBack();
        } catch(error) {
        console.log("Error");
    }
    }

    render() {
      return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Card style={{ flex: 0 }}>
          <CardItem>
          <Image source={require('./images/nav.jpg')}
                style={{width: 300, height: 200}} />
          </CardItem>
        </Card>
          <TouchableHighlight onPress={this.goHome} style={styles.container}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>HOME</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.goHistory} style={styles.container}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>HISTORY</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.goToPersonalInfo} style={styles.container}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>PERSONAL INFO </Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.goToLogout} style={styles.container}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>LOGOUT</Text>
          </TouchableHighlight>
        </View>
      );
    }
}

var styles = StyleSheet.create({
  container: {
    flex: 0,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
