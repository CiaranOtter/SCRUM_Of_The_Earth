import React, { Component, useState } from 'react';
import { StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
//import {ImageBackground, SafeAreaView, StyleSheet, TouchableOpacity, Alert, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { StackActions } from "@react-navigation/native";

import PitchTracker from 'react-native-pitch-tracker';

const pitchNoteC = require("../classes/pitchNoteClassification.js");


export default class ChromaticScreen extends Component{

  
  
  constructor(){
    super();

    this.pitchNoteClass = new pitchNoteC();
    const note = this.pitchNoteClass.getNote(5021);
    const classification = this.pitchNoteClass.getClassification(5021);

    this.state = {
      tuner_type: ["4 String Tuner", "6 String Tuner", "Chromatic Tuner"],
      pitch: 5021,
      NoteClass: classification,
      note: note
    }



    PitchTracker.prepare();

    PitchTracker.noteOff((res) => {
      console.log(res);
      
      const pitch = res['midiNum']*10;

      this.setState({
        note: this.pitchNoteClass.getNote(pitch),
        NoteClass: this.pitchNoteClass.getClassification(pitch),
        pitch: pitch
      });
      
      console.log("note: "+ this.state.note)
    }); 

    PitchTracker.noteOn((res) => {
      console.log(res);
      
      const pitch = res['midiNum']*10;

      this.setState({
        note: this.pitchNoteClass.getNote(pitch),
        NoteClass: this.pitchNoteClass.getClassification(pitch),
        pitch: pitch
      });
      
      console.log("note: "+ this.state.note)
    });

    PitchTracker.start()
  }
  
  endTunerSession = () => {
    PitchTracker.stop();
  }

  selectedTuner = (selectedItem) =>{
    PitchTracker.stop();
    if(selectedItem == this.state.tuner_type[0]){
        this.props.navigation.dispatch(StackActions.replace('4SMTuner'));
        return this.state.tuner_type[0];
    }
    else if(selectedItem == this.state.tuner_type[1]){
        this.props.navigation.dispatch(StackActions.replace('6SMTuner'));
        return this.state.tuner_type[1]
    }
    else if(selectedItem == this.state.tuner_type[2]){
        this.props.navigation.dispatch(StackActions.replace('Chromatic'));
        return this.state.tuner_type[2]
    }
  }

  render(){
    // const note = this.pitchNoteClass.getNote(this.pitch);
    // const classification = this.pitchNoteClass.getClassification(this.pitch);
    // const pitch = this.pitch;

    return (

      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={{marginTop:-100, marginLeft:-160}}>
            <SelectDropdown 
                data={this.state.tuner_type}
                onSelect={() => {}}
                buttonTextAfterSelection={(selectedItem, index) => {
                return this.selectedTuner(selectedItem)
                }}
                rowTextForSelection={(item, index) => {
                  return item
                }}
                defaultButtonText={this.state.tuner_type[2]}
                buttonStyle={styles.DropDownStyle}
                buttonTextStyle={{fontSize:15}}
                rowTextStyle={{fontSize: 15}}
            />
        </TouchableOpacity>
        <Text style={styles.title}>{this.state.note}</Text>
        <Text style={styles.frequency}>{this.state.pitch}Hz</Text>
        <Text style={styles.indicator}>{this.state.NoteClass}</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  DropDownStyle: {
    width:150,
    backgroundColor: '#55B7AD'
  },
  title: {
    fontSize: 150,
    color: 'gray',
    marginTop: 100
  },
  indicator:{
    fontSize: 24
  },
  frequency: {
    fontSize: 30,
    color: '#55B7AD'
  }
});