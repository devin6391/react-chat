import React, { Component } from 'react';
import 'typeface-roboto';
import firebase from 'firebase';
import fire from './fire';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import Header from "./header";
import MsgInput from "./msgInput";
import ChatView from "./msgList/listView";

import logo from './logo.svg';
import './App.css';

const theme = createMuiTheme();

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      online: true,
    }
  }

  componentDidMount() {
    var connectedRef = firebase.database().ref(".info/connected");
    var self = this;
    connectedRef.on("value", function(snap) {
      if (snap.val() === true) {
        self.setState({online: true});
      } else {
        self.setState({online: false});
      }
    });
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <Header online={this.state.online} />
          <ChatView online={this.state.online} />
          <MsgInput online={this.state.online} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
