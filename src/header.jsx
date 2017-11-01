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
    marginTop: theme.spacing.unit * 3,
    width: '100%',
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
  render() {
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography type="title" color="inherit" className={classes.flex}>
              React Chat
            </Typography>
            <Button color="contrast" className={this.state.loggedIn ? classes.hidden: classes.noHide}>Login</Button>
            <Button color="contrast" className={this.state.loggedIn ? classes.noHide: classes.hidden}>Logout</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
