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
import { CircularProgress } from 'material-ui/Progress';
import fire from '../fire';

import ChatItem from "./listItem";

import { addDataToDb, clearAllDbData, getAllDataFromDb } from "./dbservice";

const styles = theme => ({
  root: {
    marginTop: 56,
    width: '100%',
    height: "calc(100vh - 160px)",
    overflow: "scroll"
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
  },
  progress: {
    margin: `0 ${theme.spacing.unit * 2}px`,
  },
});

@withStyles(styles)
export default class ChatView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loader: true,
      noValue: false,
      ownUid: null
    }
    this.rootEl = null;
  }
  componentDidMount() {
    var user = JSON.parse(window.localStorage.getItem('fireAuthInfo'));
    if(user && user.uid) {
      this.setState({
        ownUid: user.uid
      })
    }
    if(navigator.onLine) {
      document.addEventListener("dbReady", this.populateFromFirebase);
      let self = this;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          self.setState({
            messages: []
          })
          self.populateFromFirebase();
        }
      });
    } else {
      document.addEventListener("dbReady", this.populateFromLocalDb);
    }
  }

  populateFromFirebase = () => {
    clearAllDbData();
    let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);
    messagesRef.once('value', snapshot => {
      console.log("Getting all message values: ", snapshot.val());
      if(!snapshot.val()) {
        this.setState({noValue: true});
      }
    });
    messagesRef.on('child_added', snapshot => {
      /* Update React state when message is added at Firebase Database */
      console.log("Child added event received from firebase", snapshot.val());
      let message = { text: snapshot.val(), id: snapshot.key };
      this.setState((prevState) => {
        return Object.assign({}, prevState, {
          messages: prevState.messages.concat([message]),
          loader: false
        })
      }, () => {
        this.rootEl.scrollTop = this.rootEl.scrollHeight;
      });
      addDataToDb(message)
      .then(result => console.log("message successfully added to db"))
      .catch(e => console.error("Error occurred in db during txn", e));
    });
  }

  populateFromLocalDb = () => {
    getAllDataFromDb().then(res => {
      console.log("All db data are: ", res);
      this.setState((prevState) => {
        return Object.assign({}, prevState, {
          messages: res,
          loader: false
        })
      }, () => {
        this.rootEl.scrollTop = this.rootEl.scrollHeight;
      });
    }).catch(e => console.error(e));
  }

  componentWillUnmount() {
    document.removeEventListener("dbReady", this.populateFromFirebase);
    document.removeEventListener("dbReady", this.populateFromLocalDb);
  }
  render() {
    let classes = this.props.classes;
    let self = this;
    return(
      <div className={classes.root} ref={el => this.rootEl = el}>
        {
          self.state.loader ? (
            <CircularProgress className={classes.progress} size={50} />
          ) : self.state.messages.map(message => {
            return (<ChatItem
              message={message.text}
              key={message.id}
              self={message.text.uid == this.state.ownUid}
            />)
          })
        }
      </div>
    )
  }
}
