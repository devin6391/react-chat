import React, { Component } from 'react';
import 'typeface-roboto';
import firebase from 'firebase';
import moment from 'moment';

import { withStyles } from 'material-ui/styles';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import red from 'material-ui/colors/red';
import FavoriteIcon from 'material-ui-icons/Favorite';
import ShareIcon from 'material-ui-icons/Share';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import fire from './fire';

import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/PlayArrow';
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import Input, { InputLabel } from 'material-ui/Input';
import TextField from 'material-ui/TextField';

const styles = theme => ({
  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: 16,
    position: "fixed",
    width: "calc(100vw - 32px)",
    maxWidth: 500,
    bottom: 0,
    boxShadow: "0px -2px 6px 4px rgba(0,0,0,0.4)",
    height: 70,
    backgroundColor: "#fff"
  },
  media: {
    height: 194,
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  flexGrow: {
    flex: '1 1 auto',
  },
  button: {
    margin: theme.spacing.unit,
  },
});

@withStyles(styles)
export default class MsgInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      otherValues: {},
      loggedIn: false,
      online: true
    }
    this.inputEl = null;
  }

  componentDidMount() {
    this.updateOnlineStatus();
    var user = JSON.parse(window.localStorage.getItem('fireAuthInfo'));
    if(user && user.uid) {
      this.setState({
        otherValues: {
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid
        },
        loggedIn: true
      })
    }
    let self = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        self.setState({
          otherValues: {
            displayName: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid
          },
          loggedIn: true
        })
      } else {
        self.setState({
          otherValues: {},
          loggedIn: false
        })
      }
    });

    window.addEventListener('online',  this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online',  this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  }

  updateOnlineStatus = (e) => {
    if(navigator.onLine) {
      this.setState({
        online: true
      })
    } else {
      this.setState({
        online: false
      })
    }
  }

  sendMessage = (e) => {
    e.preventDefault();
    var dateTime = new Date();
    fire.database().ref('messages').push(Object.assign(
      {},
      this.state.otherValues,
      {
        msg: this.state.message,
        dateTime: dateTime.toString()
      }
    ));
    this.inputEl.value = "";
  }

  handleChange = event => {
    this.setState({message: event.target.value});
  }

  render() {
    let classes = this.props.classes;
    return(
      <div>
        <div className={classes.card}>
          <TextField
            defaultValue=""
            label="Your Message"
            InputProps={{
              disableUnderline: true,
              classes: {
                root: classes.textFieldRoot,
                input: classes.textFieldInput,
              },
            }}
            InputLabelProps={{
              className: classes.textFieldFormLabel,
            }}
            onChange={this.handleChange}
            inputRef={el => this.inputEl = el}
          />
          <Button
            fab
            color="primary"
            aria-label="add"
            className={classes.button}
            onClick={this.sendMessage}
            disabled={!(this.state.loggedIn && this.state.online)}
          >
            <AddIcon />
          </Button>
        </div>
      </div>
    )
  }
}
