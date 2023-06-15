import React from "react";
import ReactDOM from "react-dom";
import { Grid, Typography, Paper } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
// import { MuiThemeProvider, createMuiTheme } from "@mui/styles";

import axios from "axios";
import "./styles/main.css";
import theme from './theme';

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import Workout from "./components/Workout";
import LoginRegister from "./components/LoginRegister";

class TeamWorkout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userIsLoggedIn: false,
      currUser: null,
      exerciseRefresh: false,
    };
  }

  handleLogin = (currUser) => {
    this.setState({
      userIsLoggedIn: true,
      currUser,
    });

    console.log(currUser);
  };

  handleLogout = () => {
    axios
      .post("/admin/logout")
      .then(() => {
        this.setState({
          userIsLoggedIn: false,
          currUser: null,
        });
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  handleRegister = (newUser) => {
    this.setState({
      userIsLoggedIn: true,
      currUser: newUser,
    });
  };

  handleRefresh = () => {
    this.setState((prevState) => ({ exerciseRefresh: !prevState.refreshExercises }));
  };

  // theme = createTheme({
  //   palette: {
  //     primary: '#7730A4',
  //     secondary: "#9D2715",
  //     error: "red",
  //   },
  // });

  render() {
    return (
      <ThemeProvider theme={theme}>
        <HashRouter>
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TopBar
                  userIsLoggedIn={this.state.userIsLoggedIn}
                  currUser={this.state.currUser}
                  onLogout={this.handleLogout}
                  onRefresh={this.handleRefresh}
                />
              </Grid>
              <div className="cs142-main-topbar-buffer" />
              <Grid item sm={3}>
                <Paper className="cs142-main-grid-item">
                  {this.state.userIsLoggedIn ? <UserList /> : null}
                </Paper>
              </Grid>
              <Grid item sm={9}>
                <Paper className="cs142-main-grid-item">
                  <Switch>
                    {this.state.userIsLoggedIn ? (
                      <Redirect exact path="/" to="/users/:userId" />
                    ) : (
                      <Redirect exact path="/" to="/login-register" />
                    )}

                    {this.state.userIsLoggedIn ? (
                      <Route
                        path="/users/:userId"
                        render={(props) => <UserDetail {...props} />}
                      />
                    ) : (
                      <Redirect path="/users/:userId" to="/login-register" />
                    )}

                    {this.state.userIsLoggedIn ? (
                      <Route
                        path="/workouts/:userId"
                        render={(props) => (
                          <Workout
                            {...props}
                            currUser={this.state.currUser}
                            exerciseRefresh={this.state.exerciseRefresh}
                          />
                        )}
                      />
                    ) : (
                      <Redirect path="/workouts/:userId" to="/login-register" />
                    )}

                    <Route path="/users" component={UserList} />

                    <Route
                      path="/login-register"
                      render={(props) => (
                        <LoginRegister
                          {...props}
                          onLogin={this.handleLogin}
                          onRegister={this.handleRegister}
                        />
                      )}
                    />
                  </Switch>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </HashRouter>
      </ThemeProvider>
    );
  }
}

ReactDOM.render(<TeamWorkout />, document.getElementById("teamworkoutapp"));
