import React, { Component } from "react";
import io from "socket.io-client";
import PropTypes from "prop-types";
import moment from 'moment';
import ChatView from 'react-chatview';
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import { purple } from "@material-ui/core/colors";
import {
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  Menu,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import NotificationsIcon from "@material-ui/icons/Notifications";
import PersonIcon from "@material-ui/icons/Person";
import DownvoteIcon from "@material-ui/icons/ExpandMore";
import UpvoteIcon from "@material-ui/icons/ExpandLess";
import PostIcon from "@material-ui/icons/Create";

const styles = theme => ({
  root: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    //justifyContent: "center",
    alignItems: "center"

    //backgroundColor: theme.palette.background.paper
  },
  grow: {
    flexGrow: 0.5
  },
  inline: {
    display: "inline"
  },
  listNav: {
    position: "absolute",
    bottom: 10,
    left: 10
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  postButton: {
    marginRight: -12,
    marginLeft: 20
  },
  button: {
    margin: 0
    // alignSelf: "center"
  },
  voteButton: {
    display: "block"
  },
  input: {
    display: "none"
  },
  bottomNav: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },
  container: {
    flexDirection: "column",
    justifyContent: "flex-end"
    //alignItems: "center"
  }
});

class SimpleDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //empty: true,
      message: '',
      messages: [],
      votes: []
    };

    this.socket = io();

    const upVote = data => {
      this.setState({ votes: [...this.state.votes] });
    };

    this.sendMessage = ev => {
      ev.preventDefault();
      if (this.state.message != '' && this.state.message != ' ') {
        //this.setState({empty: false})
      
      this.socket.emit('SEND_MESSAGE', {
        message: this.state.message
      });
      this.setState({ message: '' });
      //this.props.cursor.set(this.state.message);
      this.props.onClose(this.props.selectedValue);
    }};
    this.handleClose = () => {
      this.props.onClose(this.props.selectedValue);
    };
  }

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        {...other}
      >
        <DialogContent>
          <TextField
            id="outlined-textarea"
            //label="Multiline Placeholder"
            placeholder="Say something mean..."
            input type="text"
            multiline
            className={classes.textField}
            margin="normal"
            variant="outlined"
            value={this.state.message} 
            onChange={ev => this.setState({message: ev.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.sendMessage} color="primary">
            Post
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

SimpleDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string
};

const SimpleDialogWrapped = withStyles(styles)(SimpleDialog);

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      value: 0,
      auth: true,
      anchorEl: null,
      messages: [],
      votes: []
    };

    this.socket = io();
    
    this.socket.on('RECEIVE_MESSAGE', function(data) {
      console.log('recieved')
      addMessage(data);
    });

    const addMessage = data => {
      console.log(data);
      this.setState({ messages: [...this.state.messages, data] });
      console.log(this.state.messages);
    };

    this.handleClickOpen = () => {
      this.setState({
        open: true
      });
    };

    this.handleChange = (event, value) => {
      this.setState({
        value,
        auth: event.target.checked
      });
    };
    /* handleChange = event => {
    this.setState({ auth: event.target.checked });
  };
*/
    this.handleMenu = event => {
      this.setState({ anchorEl: event.currentTarget });
    };

    this.handleClose = () => {
      this.setState({ anchorEl: null, open: false });
    };
  }
  render() {
    const { classes } = this.props;
    const { value } = this.state;
    const { anchorEl } = this.state;
    const theme = createMuiTheme({
      palette: {
        primary: purple,
        secondary: {
          main: "#f3e5f5"
        }
      }
    });
    var controller = this.props.messagesController;
    var rows = this.state.messages.map(message => {
      return (
        <div>
          <ListItem alignItems="flex-start">
            <ListItemText
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {message.message}
                  </Typography>
                </React.Fragment>
              }
            />
            <Grid className={classes.container}>
              <IconButton
                className={classes.voteButton}
                aria-label="Upvote"
              >
                <UpvoteIcon />
              </IconButton>
              <IconButton
                className={classes.voteButton}
                aria-label="Downvote"
              >
                <DownvoteIcon />
              </IconButton>
            </Grid>
            <Typography
              component="span"
              className={classes.listNav}
              color="textPrimary"
            >
              {moment(this.props).format('m')}min
            </Typography>
          </ListItem>
          <Divider />
        </div>
      );
    })

    return (
      <Grid className={classes.root}>
        <MuiThemeProvider theme={theme}>
          <AppBar position="static" className={classes.appBar}>
            <Toolbar>
              <IconButton
                className={classes.menuButton}
                aria-owns={anchorEl ? "Menu" : undefined}
                aria-haspopup="true"
                onClick={this.handleMenu}
                aria-label="Menu"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="Menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleClose}>Messages</MenuItem>
                <MenuItem onClick={this.handleClose}>idk</MenuItem>
                <MenuItem onClick={this.handleClose}>Logout</MenuItem>
              </Menu>
              <div className={classes.grow} />
              <Button
                variant="outlined"
                color="secondary"
                className={classes.button}
              >
                New
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                className={classes.button}
              >
                Hot
              </Button>
              <div className={classes.grow} />
              <IconButton
                className={classes.postButton}
                aria-label="Post"
                onClick={this.handleClickOpen}
              >
                <PostIcon />
              </IconButton>
              <SimpleDialogWrapped
                selectedValue={this.state.selectedValue}
                open={this.state.open}
                onClose={this.handleClose}
              />
              
            </Toolbar>
          </AppBar>
          <List className={classes.messages}>
          <ChatView className="message-list"
                    flipped={true}
                    scrollLoadThreshold={50}
            onInfiniteLoad={this.props.loadMoreHistory}>
            {rows}
          </ChatView>
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      I just pooped my pants in class
                    </Typography>
                  </React.Fragment>
                }
              />
              <Grid className={classes.container}>
                <IconButton className={classes.voteButton} aria-label="Upvote">
                  <UpvoteIcon />
                </IconButton>
                <IconButton
                  className={classes.voteButton}
                  aria-label="Downvote"
                >
                  <DownvoteIcon />
                </IconButton>
              </Grid>
              <Typography
                component="span"
                className={classes.listNav}
                color="textPrimary"
              >
                5h
              </Typography>
            </ListItem>
            <Divider />
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      Omg starbucks is my life
                    </Typography>
                  </React.Fragment>
                }
              />
              <div className={classes.container}>
                <IconButton className={classes.voteButton} aria-label="Upvote">
                  <UpvoteIcon />
                </IconButton>
                <IconButton
                  className={classes.voteButton}
                  aria-label="Downvote"
                >
                  <DownvoteIcon />
                </IconButton>
              </div>
              <Typography
                      component="span"
                      className={classes.listNav}
                      color="textPrimary"
                    >
                      12h
                    </Typography>
            </ListItem>
            <Divider />
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      This class is way too long tbh
                    </Typography>
                  </React.Fragment>
                }
              />
              <div className={classes.container}>
                <IconButton className={classes.voteButton} aria-label="Upvote">
                  <UpvoteIcon />
                </IconButton>
                <IconButton
                  className={classes.voteButton}
                  aria-label="Downvote"
                >
                  <DownvoteIcon />
                </IconButton>
              </div>
              <Typography
                      component="span"
                      className={classes.listNav}
                      color="textPrimary"
                    >
                      23h
                    </Typography>
            </ListItem>
            <Divider />
          </List>
          <BottomNavigation
            value={value}
            onChange={this.handleChange}
            showLabels
            className={classes.bottomNav}
          >
            <BottomNavigationAction label="Home" icon={<HomeIcon />} />
            <BottomNavigationAction
              label="Notifications"
              icon={<NotificationsIcon />}
            />
            <BottomNavigationAction label="Me" icon={<PersonIcon />} />
          </BottomNavigation>
        </MuiThemeProvider>
      </Grid>
    );
  }
}

Chat.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Chat);
