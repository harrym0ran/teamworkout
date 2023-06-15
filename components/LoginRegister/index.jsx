import React from "react";
import {
  Typography,
  Button,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { withRouter } from "react-router-dom";

//import fetchModel from '../../lib/fetchModelData.js';
import axios from "axios";

import "./styles.css";

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      l_login_name: "",
      l_password: "",

      r_first_name: "",
      r_last_name: "",
      r_password: "",
      r_login_name: "",
      r_coach: false,
    };
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleAlignment = (event, newStatus) => {
    console.log(newStatus);
    this.setState({ r_coach: newStatus });
  };

  handleLogin = (event) => {
    event.preventDefault();

    const { l_login_name, l_password } = this.state;
    axios
      .post("/admin/login", { l_login_name, l_password })
      .then((response) => {
        this.props.onLogin(response.data);
        this.props.history.push(`/users/${response.data._id}`);
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  handleRegister = (event) => {
    event.preventDefault();

    const {
      r_first_name,
      r_last_name,
      r_password,
      r_login_name,
      r_coach
    } = this.state;

    const coach = r_coach === "true";

    axios
      .post("/user", {
        r_first_name,
        r_last_name,
        r_password,
        r_login_name,
        r_coach: coach,
      })
      .then((response) => {
        this.props.onRegister(response.data);
        this.props.history.push(`/users/${response.data._id}`);
      })
      .catch((error) => {
        console.error("Registration failed:", error);
      });
  };

  render() {
    const { r_coach } = this.state;

    return (
      <div className="content">
        <div className="division" style={{ height: "300px" }}>
          <form onSubmit={this.handleLogin} className="form">
            <Typography variant="h4">Log In:</Typography>
            <div className="form-row">
              <TextField
                name="l_login_name"
                label="Username"
                variant="outlined"
                onChange={this.handleInputChange}
              />

              <TextField
                name="l_password"
                label="Password"
                variant="outlined"
                type="password"
                onChange={this.handleInputChange}
              />
            </div>

            <Button variant="contained" type="submit" className="button">
              Log In
            </Button>
          </form>
        </div>

        <div className="division" style={{ height: "400px" }}>
          <form onSubmit={this.handleRegister} className="form">
            <Typography variant="h4">Register:</Typography>
            <div className="form-row">
              <TextField
                name="r_first_name"
                label="First Name"
                variant="outlined"
                onChange={this.handleInputChange}
              />

              <TextField
                name="r_last_name"
                label="Last Name"
                variant="outlined"
                onChange={this.handleInputChange}
              />
            </div>

            <div className="form-row">
              <TextField
                name="r_password"
                label="Password"
                variant="outlined"
                type="password"
                onChange={this.handleInputChange}
              />

              <ToggleButtonGroup
                value={r_coach}
                exclusive
                onChange={this.handleAlignment}
                aria-label="text alignment"
              >
                <ToggleButton value="false" aria-label="left aligned">
                  Player
                </ToggleButton>
                <ToggleButton value="true" aria-label="right aligned">
                  Coach
                </ToggleButton>
              </ToggleButtonGroup>
            </div>

            <Button variant="contained" type="submit" className="button">
              Register Me
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(LoginRegister);
