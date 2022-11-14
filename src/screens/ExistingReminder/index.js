import React, {useState} from 'react';
import {Text,TextInput,View,Pressable,Alert} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';

import { openDatabase } from "react-native-sqlite-storage";

const myRemindersDB = openDatabase({ name: 'MyReminders.db' });
const remindersTableName = 'reminders';
const reminderPrioritiesTableName = "reminder_priorities";


const ExistingReminderScreen = props => {
    const navigation = useNavigation();

    const post = props.route.params.post;

    const [title, setTitle] = useState(post.title);
    const [description, setDescription] = useState(post.description);
    const [date, setDate] = useState(post.date);

    const onReminderUpdate = () => {
            if (!title){
                alert('Please enter a reminder title.');
                return
            }
            if (!description){
                alert('Please enter a reminder description.');
                return
            }
            if (!date){
                alert('Please enter a date in format MM-DD-YYYY');
                return
            }

            myRemindersDB.transaction(txn =>{
                txn.executeSql(
                    `UPDATE ${remindersTableName} SET title = '${title}', description = '${description}', date = '${date}' WHERE id = ${post.id}`,
                    [],
                    () => {
                        console.log(`${title} updated sucessfully`);
                    },
                    error => {
                        console.log('Error on updating reminder' + error.message);
                    }
                );
            });

            alert(title + ' updated!');
            navigation.navigate('Get Reminders!');
    
    }
    const onReminderDelete = () => {
        return Alert.alert(
            'Confirm',
            'Are you sure you want to delete this reminders?',
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        myRemindersDB.transaction(txn =>{
                            txn.executeSql(
                                `DELETE FROM ${remindersTableName} WHERE id = ${post.id}`,
                                [],
                                () => {
                                    console.log(`${title} deleted sucessfully`);
                                },
                                error => {
                                    console.log('Error on deleting reminder' + error.message);
                                }
                            );
                        });

                        alert(' Reminder Deleted!');
                        navigation.navigate('Get Reminders!');

                        myRemindersDB.transaction(txn =>{
                            txn.executeSql(
                                `DELETE FROM ${reminderPrioritiesTableName} WHERE reminder_id = ${post.id}`,
                                [],
                                () => {
                                    console.log(`reminder priority deleted sucessfully`);
                                },
                                error => {
                                    console.log('Error on deleting reminder priority' + error.message);
                                }
                            );
                        });
                    },
                },
                {
                    text: 'No',
                },
            ],
        );
       
    }
    const onAddPriority = () => {
        navigation.navigate('Add ReminderPriority',{post:post});
        
    }
    return(
        <View style={styles.container}>
        <View style = {styles.topContainer}>
            <TextInput 
            value = {title}
            onChangeText={value=>setTitle(value)}
            style = {styles.title}
            clearButtonMode = {'while-editing'}
            placeholder = {'Enter Title'}
            placeholderTextColor = {'grey'}
            />
            <TextInput 
            value = {description}
            onChangeText={value=>setDescription(value)}
            style = {styles.description}
            clearButtonMode = {'while-editing'}
            placeholder = {'Enter Description'}
            placeholderTextColor = {'grey'}
            />
            <TextInput 
            value = {date}
            onChangeText={value=>setDate(value)}
            style = {styles.date}
            clearButtonMode = {'while-editing'}
            placeholder = {'Enter Date in format MM-DD-YYY'}
            placeholderTextColor = {'grey'}
            
            />
        </View>
        <View style ={styles.bottomContainer}>
            <Pressable style={styles.updateButton} onPress={onReminderUpdate}>
                <Text style={styles.buttonText}>Update</Text>
            </Pressable>
        </View>
        <View style ={styles.bottomContainer}>
            <Pressable style={styles.deleteButton} onPress={onReminderDelete}>
                <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
        </View>
        <View style ={styles.bottomContainer}>
            <Pressable style={styles.addButton} onPress={onAddPriority}>
                <Text style={styles.buttonText}>Add Priority</Text>
            </Pressable>
        </View>
        </View>

    );
};


export default ExistingReminderScreen;