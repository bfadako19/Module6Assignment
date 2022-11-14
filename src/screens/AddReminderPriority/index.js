import React ,{useState,useEffect}from 'react';
import { View,FlatList } from 'react-native';
import Priority from '../../components/Priority';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';

import { openDatabase } from "react-native-sqlite-storage";


const myRemindersDB = openDatabase({ name: 'MyRemindersDB' });
const prioritiesTableName = 'priorities';

const AddReminderPrioritiesScreen = props => {
const post = props.route.params.post;
const navigation = useNavigation();
const[priorities,setPriority] = useState([]);
useEffect(() => {
    listener = navigation.addListener('focus', () => {
     let results = [];
     myRemindersDB.transaction(txn => {
     txn.executeSql(
       `SELECT * FROM ${prioritiesTableName}`,
       [],
       (_, res) => {
       let len = res.rows.length;
       console.log('Length of items ' + len);
       if (len>0){
         for(let i = 0; i < len; i++){
           let item = res.rows.item(i);
           results.push({
           id : item.id,
           title: item.title,
           description: item.description, 
           reminder_id : post.id,
           });
         }
         setPriority(results);
  
       } else{
         setPriority([]);
       } 
       },
       error => {
       console.log('Error getting priorities' + error.message);  
       },
     )  
     });
   });
   return listener;
  });
  
    return(
        <View style = {styles.container}>
        <View>
        <FlatList
          data={priorities}
          renderItem={({item}) => < Priority post={item}/>}
          keyExtractor={item => item.id}
        />
        </View>
        </View>
    );
};

export default AddReminderPrioritiesScreen;