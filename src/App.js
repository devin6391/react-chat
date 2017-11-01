import React, { Component } from 'react';
import 'typeface-roboto';
import firebase from 'firebase';
import fire from './fire';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import Header from "./header";

import logo from './logo.svg';
import './App.css';

const theme = createMuiTheme();

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <Header />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
