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
      ownUid: null,
    }
    this.appReadyForNotification = false;
    this.rootEl = null;
    this.notificationSound = new Audio(`${process.env.PUBLIC_URL}/notify.mp3`);
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
          setTimeout(() => {
            self.appReadyForNotification = true;
          }, 20000);
        }
      });
    } else {
      document.addEventListener("dbReady", this.populateFromLocalDb);
      this.appReadyForNotification = false;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let self = this;
    let timer = null;
    if(prevProps.online != this.props.online) {
      if(timer) {
        window.clearTimeout(timer);
        timer = null;
      }
      if(this.props.online) {
        timer = window.setTimeout(() => {
          self.setState({
            messages: [],
            loader: true
          });
          self.populateFromFirebase();
        }, 2000);
        setTimeout(() => {
          self.appReadyForNotification = true;
        }, 20000);
      } else {
        timer = window.setTimeout(() => {
          self.setState({
            messages: [],
            loader: true,
          });
          self.appReadyForNotification = false;
          self.populateFromLocalDb();
        }, 2000);
      }
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
    messagesRef.off('child_added', this.saveFirebaseSnapshot);
    messagesRef.on('child_added', this.saveFirebaseSnapshot);
  }

  saveFirebaseSnapshot = snapshot => {
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
      if(this.appReadyForNotification) {
        this.notificationSound.play();
        navigator.vibrate && navigator.vibrate(200);
      }
    });
    addDataToDb(message)
    .then(result => console.log("message successfully added to db"))
    .catch(e => console.error("Error occurred in db during txn", e));
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
