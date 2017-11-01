import React, { Component } from 'react';
import 'typeface-roboto';
import firebase from 'firebase';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import fire from './fire';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 0,
    width: '100%',
    position: "fixed",
    top: 0
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  hidden: {
    display: "none"
  },
  noHide: {
    display: "flex"
  }
});

@withStyles(styles)
export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    }
  }

  componentDidMount() {
    var user = JSON.parse(window.localStorage.getItem('fireAuthInfo'));
    var credential = JSON.parse(window.localStorage.getItem('fireCredential'));
    if (user && user.uid && credential) {
      console.log("USER is logged in");
      this.setState({loggedIn: true});
    } else {
      console.log("USER is not logged in");
    }
  }

  signin = (e) => {
    if(e) e.preventDefault();
    var provider = new firebase.auth.GoogleAuthProvider();
    let fireAuth = firebase.auth();
    fireAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    fireAuth.signInWithPopup(provider)
      .then(result => {
        console.log("google signin result", result);
        this.setState((prevState, props) => {
          return Object.assign({}, prevState, {
            loggedIn: true
          })
        }, () => {
          window.localStorage.setItem('fireAuthInfo', JSON.stringify(firebase.auth().currentUser));
          window.localStorage.setItem('fireCredential', JSON.stringify(result.credential));
        });
      })
      .catch(e => {
        console.error("signin unseccessful because of :", e);
      });
  }

  signout = e => {
    e.preventDefault();
    let self = this;
    firebase.auth().signOut().then(function() {
      console.log("signout successful");
      self.setState((prevState, props) => {
        return Object.assign({}, prevState, {
          loggedIn: false
        })
      }, () => {
        window.localStorage.removeItem('fireAuthInfo');
        window.localStorage.removeItem('fireCredential');
      });
    }).catch(function(error) {
      console.error("signout unseccessful", error);
    });
  }

  render() {
    let classes = this.props.classes;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography type="title" color="inherit" className={classes.flex}>
              React Chat
            </Typography>
            <Button
              color="contrast"
              className={this.state.loggedIn ? classes.hidden: classes.noHide}
              onClick={this.signin}
            >
              Login
            </Button>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
