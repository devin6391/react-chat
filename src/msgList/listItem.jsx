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
import fire from '../fire';

const styles = theme => ({
  card: {
    borderRadius: 30,
    margin: 10,
    maxWidth: "calc(100vw - 50px)",
    boxShadow: "5px 0px -1px 0px rgba(0, 0, 0, 0.2), 0px 7px 1px 0px rgba(13, 5, 0, 0.14), 0px 4px 12px 8px rgba(0, 0, 0, 0.12)",
    "border-top-left-radius": 0,
    "&.margin": {
      marginLeft: 40,
      "border-top-left-radius": 30,
      "border-top-right-radius": 0,
    }
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
  cardContentRoot: {
    boxShadow: "0px 1px 0px 0px rgba(0, 0, 0, 0.1)",
    "& span": {
      textAlign: "left"
    }
  }
});

@withStyles(styles)
export default class ChatItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: null
    }
  }

  componentDidMount() {

  }

  render() {
    let classes = this.props.classes;
    let message = this.props.message;
    return(
      <div>
        <Card className={this.props.self ? `margin ${classes.card}`: classes.card}>
          <CardHeader
            avatar={
              <Avatar
                aria-label="Recipe"
                className={classes.avatar}
                src={message.photoURL}
              >
                {message.photoURL ? null : message.displayName.toString().charAt(0).toUpperCase()}
              </Avatar>
            }
            title={message.displayName.toString().toUpperCase()}
            subheader={moment(message.dateTime).format("dddd, MMMM Do YYYY, h:mm:ss a")}
            classes={{
              root: classes.cardContentRoot
            }}
          />
          <CardContent>
            <Typography component="p">{message.msg}</Typography>
          </CardContent>
        </Card>
      </div>
    )
  }
}
