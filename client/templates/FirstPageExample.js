import React, { Component } from 'react';
import { StyleSheet,Alert,ActivityIndicator, AsyncStorage } from 'react-native';
//import  Camera from 'react-native-camera';
import BarcodeScanner from 'react-native-barcodescanner';
import { Container, Button,Icon, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Content, Spinner } from 'native-base';
import Popup from 'react-native-popup';
import Modal from 'react-native-modalbox';


const USER_REFERENCE = 'email';

var styles = StyleSheet.create({
                    camscanner: {
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "transparent",
                    },
                      activity: {
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8,
                  },

});


export default class FirstPageExample extends Component {
   constructor(props) {
        super(props);
        this.state = { inSideScanner:false, content: [], allergies: [], result: [],information: false, contentInfo: false, id : "", key: "" }
        this.onScanComplete = this.onScanComplete.bind(this);
        this.storeScanData = this.storeScanData.bind(this);
        this.fetchAllergies = this.fetchAllergies.bind(this);
        this.getAppKey = this.getAppKey.bind(this);
        this.contentInfo = this.contentInfo.bind(this);
        this.information = this.information.bind(this);
        this.closecontentInfo = this.closecontentInfo.bind(this);
        this.closeinformation = this.closeinformation.bind(this);

   }
   
    componentDidMount(){
        this.getAppKey();

    }
    componentWillMount(){
        this.fetchAllergies();

    }
    
    getAppKey(){
        var self = this;
        console.log("Inside getAppKey");
        fetch( "https://allergywatch.herokuapp.com/getKey/", {method: "GET",      
              headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json',
                  }
                                                             })
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData){
                    self.setState({
                        id : responseData.appIdValue,
                        key: responseData.appKeyValue
                    });
                }
                console.log("Response:" + responseData);
                console.log("ID:" + self.state.id);
                console.log("Key:"+ self.state.key);
            })
            .done();

    }

    
    async fetchAllergies(){
                        try {
                        let email = await AsyncStorage.getItem(USER_REFERENCE);
                        console.log("Inside Getemail",email)   
                        if(!email) {
                            this.redirect('login');
                        } else {
                            this.setState({email: email});
                             var self = this;
                             var url = "https://allergywatch.herokuapp.com/allergy/" + this.state.email;
                             fetch(url, {method: "GET"})
                            .then((response) => response.json())
                            .then((responseData) => {
                                 al = [];
                                 for(var i=0; i< responseData.allergy.length; i++){
                                    al.push(responseData.allergy[i].allergyName);
                                 }
                                 self.setState({allergies : al});

                                 console.log("Allergies: "+ self.state.allergies);
                                 console.log("Email: "+ self.state.email);


                            })
                            .done(); 
                        }
                  } 
                catch(error) {
                      console.log("Something went wrong");
                  }

    }

    storeScanData(dataarr){
        console.log("insode storeScanData:"+ dataarr)
        var url='https://allergywatch.herokuapp.com/itemHistory/'
        fetch(url, {method: 'PUT',
             headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
             },
            body: JSON.stringify({
             email:this.state.email,
             itemName:dataarr[3],
             itemBrand:dataarr[2],
             itemId:dataarr[1],
             ingredient: dataarr[0]})}) 
           .then((responseJson) => {
              console.log(responseJson);
             })
           .catch((error) => {
               console.error(error);
             })
           .done;


    }
    
    
    

    onScanComplete(e){
        this.setState({inSideScanner:true});
        var scan_code = ""+e.data;
       // var scan_code = "52200004265"
        var self = this;
        
var url = 'https://api.nutritionix.com/v1_1/item?upc=' + scan_code+ '&appId='+ this.state.id + '&appKey=' + this.state.key;
       // var dummy = "https://glacial-tor-77897.herokuapp.com/banned-words";
        fetch(url, {method: "GET"})
        .then((response) => response.json())
        .then((responseData) => {
            var nutrient = responseData.nf_ingredient_statement;
            var itemid = responseData.item_id;
            var brandname = responseData.brand_name;
            var itemname = responseData.item_name;
            if(nutrient){
                            dataarr=[];
                            dataarr.push(nutrient);
                            dataarr.push(itemid);
                            dataarr.push(brandname);
                            dataarr.push(itemname);
                            self.setState({
                                content: dataarr
                            })
                                console.log("The response is:"+ this.state.content)
                                if (!String.prototype.contains) {
                            String.prototype.contains = function(val) {
                                return this.indexOf(val) > -1
                            }
                        }

                        var arr = responseData.nf_ingredient_statement.split(',');
                        //console.log(arr);
                        //Appending item metadata according to parsed JSON 
                         if(responseData.allergen_contains_milk){
                            arr.push("milk");
                        }

                        if(responseData.allergen_contains_eggs){
                            arr.push("eggs");
                        }

                        if(responseData.allergen_contains_fish){
                            arr.push("fish");
                        }

                        if(responseData.allergen_contains_shellfish){
                            arr.push("shellfish");
                        }

                        if(responseData.allergen_contains_tree_nuts){
                            arr.push("tree nuts");
                        }

                        if(responseData.allergen_contains_peanuts){
                            arr.push("peanuts");
                        }

                        if(responseData.allergen_contains_wheat){
                            arr.push("wheat");
                        }

                        if(responseData.allergen_contains_soybeans){
                            arr.push("soybeans");
                        }

                        if(responseData.allergen_contains_gluten){
                            arr.push("gluten");
                        }
                        result = [];
                        allergies = this.state.allergies;
                        for(var i=0; i< arr.length ; i++){
                            var aller = ''+arr[i];
                            for(var j=0; j<allergies.length; j++){
                                var nut = ''+allergies[j];
                                if(aller.toLowerCase().replace(/\s/g,'').contains(nut.toLowerCase())){
                                    if(result.indexOf(nut) == -1)
                                        result.push(nut);
                                }
                            }
                        }


                        if(result.length == 0){
                                    this.contentInfo(arr);

                        }else{
                                    this.information(arr,result);
                        }

                          this.storeScanData(dataarr);

                
            }else{
                
                       this.popup.tip({
                        content: ['Item not found!', 'Try another Item'],
                        btn: {
                            text: 'OK',
                            style: {
                                color: 'red'
                            },
                            callback: () => {
                                this.setState({inSideScanner:false})
                            },
                        },
                    });

            }
        })
        .done();
    }
    
    contentInfo(arr){
        this.setState({contentInfo: true, content: arr});
    }
    
    information(arr,result){
       this.setState({information: true, result: result});
    }
    
    closecontentInfo(){
        this.setState({contentInfo: false, inSideScanner:false});
    }
    
    closeinformation(){
        this.setState({information: false, inSideScanner:false});
    }
  


    render() {
        var Button1 = <Button onPress={this.closecontentInfo} style={{position: "absolute",top: 0,right: 0,width: 50,height: 50,
                            backgroundColor: "transparent"}}>X</Button>;
        var Button2 = <Button onPress={this.closeinformation} style={{position: "absolute",top: 0,right: 0,width: 50,height: 50,
                            backgroundColor: "transparent"}}>X</Button>;

        var show = [];
        if(this.state.inSideScanner){
            show.push(
                      <ActivityIndicator
                        animating={this.state.animating}
                        style={styles.centering}
                        size="large"
                          />
            );
        }else{
                    show.push(     <BarcodeScanner
                    onBarCodeRead={this.onScanComplete}
                    style={{ flex: 1 }} 
                    torchMode={'off'}
                    cameraType={'back'}
                        />
            );

        }
        console.log("Show"+show)
        return (
              <View>
                    {show}
              <Popup ref={popup => this.popup = popup }/>
              <Modal isOpen={this.state.contentInfo} onClosed={this.closecontentInfo} style={{justifyContent: 'center',
                        alignItems: 'center', height: 300}} position={"center"} backdropContent={Button1}>
              <Text >No Allergic content found</Text>
              </Modal>    
              <Modal isOpen={this.state.information} onClosed={this.closeinformation} style={{justifyContent: 'center',
                        alignItems: 'center', height: 300}} position={"center"} backdropContent={Button2}>
              <Text >Allergic content found</Text>
              </Modal>        
              </View>
        );
    }
}
