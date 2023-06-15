import React from "react";
import { Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

//import fetchModel from '../../lib/fetchModelData.js';
import axios from "axios";

import "./styles.css";

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    this.fetchData(this.props.match.params.userId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.userId !== prevProps.match.params.userId) {
      this.fetchData(this.props.match.params.userId);
    }
  }

  fetchData(userId) {
    axios
      .get(`http://localhost:3000/user/${userId}`)
      .then((response) => {
        this.setState({ user: response.data });
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }

  render() {
    const { user } = this.state;

    if (!user) {
      return null; // Return early if user is null
    }

    const header = user.coach ? "Coach" : "Player";

    // let header = "";
    // if (user.coach()) {
    //   header = "Coach";
    // } else {
    //   header = "Player";
    // }

    if (user) {
      return (
        <>
          <div className="title">
            <Typography variant="h4">
              {user.first_name} {user.last_name}
            </Typography>

            {user.coach && (
              <Button
                component={RouterLink}
                to={`/workouts/${user._id}`}
                variant="outlined"
              >
                Workouts
              </Button>
            )}
          </div>

          <div className="bio">
            <Typography variant="h5">{header}</Typography>
            <Typography variant="h6">
              {user.year} - {user.position}
            </Typography>
          </div>
        </>
      );
    } else {
      return null;
    }
  }
}

export default UserDetail;
