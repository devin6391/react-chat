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
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <Header />
          <ChatView />
          <MsgInput />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
