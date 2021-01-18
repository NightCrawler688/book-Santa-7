import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity,FlatList} from 'react-native';
import{Card,Header,Icon,ListItem} from 'react-native-elements';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import db from '../config.js';

export default class MyDonation extends Component{
    constructor(){
        super();
        this.state = {
            userId:firebase.auth().currentUser.email,
            allDonations:[]
        }
        this.requestRef = null;
    }
    static navigationOptions = { header: null };
    sendNotification=(bookDetails,requestStatus)=>{
        var requestId = bookDetails.request_id
        var donorId = bookDetails.donor_id
        db.collection('all_notifications').where('request_id','==',requestId)
        .where('donor_id','==',donorId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
              var message = ''
              if(requestStatus==='Book Sent'){
                  message = this.state.donorName + ' Sent You Book'
              }
              else {
                message = this.state.donorName + ' Has shown in donating the book'
              }
              db.collection('all_notifications').doc(doc.id).update({
                message:message,
                notification_status:'unread',
                date:firebase.firestore.FieldValue.serverTimestamp()
              })
            })
        })
    }
    sendBook=(bookDetails)=>{
        if(bookDetails.request_status === 'Book Send') {
          var requestStatus = 'Donor Interested';
          db.collection('all_donations').doc(bookDetails.doc_id).update({
            request_status:requestStatus
          })
          this.sendNotification(bookDetails,requestStatus);
        }
        else{
          var requestStatus = 'Book Sent'
          db.collection('all_donations').doc(bookDetails.doc_id).update({
            request_status:requestStatus
          })
          this.sendNotification(bookDetails,requestStatus);
        }
    }
    getAllDonations =()=>{
        this.requestRef = db.collection("all_donations").where("donor_id" ,'==', this.state.userId)
        .onSnapshot((snapshot)=>{
          var allDonations = []
          snapshot.docs.map((doc) =>{
            var donation = doc.data()
            donation["doc_id"] = doc.id
            allDonations.push(donation)
          });
          this.setState({
            allDonations : allDonations
          });
        })
      }
    keyExtractor=(item,index)=>{
        index.toString();
    }
    renderItem = ( {item, i} ) =>(
        <ListItem
          key={i}
          title={item.book_name}
          subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
          leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
          titleStyle={{ color: 'black', fontWeight: 'bold' }}
          rightElement={
              <TouchableOpacity
               style={[
                 styles.button,
                 {
                   backgroundColor : item.request_status === "Book Sent" ? "green" : "#ff5722"
                 }
               ]}
               onPress = {()=>{
                 this.sendBook(item)
               }}
              >
                <Text style={{color:'#ffff'}}>{
                  item.request_status === "Book Sent" ? "Book Sent" : "Send Book"
                }</Text>
              </TouchableOpacity>
            }
          bottomDivider
        />
      )
    componentDidMount(){
        this.getAllDonations();
    }
    componentWillUnmount(){
        this.requestRef();
    }
    
render(){
    return(
        <View style = {{flex:1}}>
           <MyHeader title = {'My Donations'} navigation = {this.props.navigation}/>
           <View style = {{flex:1}}>
                {
                    this.state.allDonations.length===0 ? 
                    (
                        <View style = {styles.subtitle}> 
                            <Text>
                                List Of All Book Donations
                            </Text>
                        </View>
                    )
                    :
                    (
                        <FlatList 
                        keyExtractor = {this.keyExtractor}
                        data = {this.state.allDonations}
                        renderItem = {this.renderItem}
                        />
                    )
                }
           </View>
        </View>
    )
}
}
const styles = StyleSheet.create({
    button:{
      width:100,
      height:30,
      justifyContent:'center',
      alignItems:'center',
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8
       },
      elevation : 16
    },
    subtitle :{
      flex:1,
      fontSize: 20,
      justifyContent:'center',
      alignItems:'center'
    }
  })
  