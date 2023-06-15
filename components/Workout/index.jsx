import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import axios from "axios";

import "./styles.css";

function ExerciseView(props) {
  const [comment, setComment] = React.useState("");

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();

    if (!comment) {
      console.log("Comment is empty");
      return;
    }

    props.onCommentSubmit(comment, props.exercise._id);

    setComment("");
  };

  return (
    <Paper className="exerciseView">
      <Typography variant="h5">{props.exercise.title}</Typography>
      <div className="exerciseHeader">
        <img
          className="exerciseImage"
          src={`../../images/${props.exercise.file_name}`}
          alt="Exercise"
        />
        <div className="textBox">
          <Typography>{props.exercise.date_time}</Typography>
          {props.exercise.comments !== undefined ? (
            <List className="commentList">
              {props.exercise.comments.map((currComment, index) => (
                <div key={index}>
                  <ListItem className="comment">
                    <Typography style={{ fontWeight: "bold" }}>
                      {currComment.user.first_name} {currComment.user.last_name}
                    </Typography>
                    <Typography>{currComment.comment}</Typography>
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
          ) : null}
        </div>
      </div>

      <Typography variant="body1">{props.exercise.notes}</Typography>
      <form className="commentForm" onSubmit={handleCommentSubmit}>
        <input
          className="commentInput"
          type="text"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Write a comment..."
        />
        <input className="submitButton" type="submit" value="Submit" />
      </form>
    </Paper>
  );
}

class UserExercises extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      exercises: [],
    };
  }

  componentDidMount() {
    this.fetchData(this.props.match.params.userId);
    this.fetchExercises(this.props.match.params.userId);
  }

  componentDidUpdate(currProps) {
    if (
      this.props.match.params.userId !== currProps.match.params.userId ||
      this.props.exerciseRefresh !== currProps.exerciseRefresh
    ) {
      this.fetchData(this.props.match.params.userId);
      this.fetchExercises(this.props.match.params.userId);
    }
  }

  fetchData(userId) {
    axios
      .get(`/user/${userId}`)
      .then((response) => {
        this.setState({ user: response.data });
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }

  fetchExercises(userId) {
    axios
      .get(`/workouts/${userId}`)
      .then((response) => {
        this.setState({ exercises: response.data });
      })
      .catch((error) => {
        console.error("Error fetching exercises:", error);
      });
  }

  handleCommentSubmit = (comment, exerciseId) => {
    axios
      .post(`/exerciseComments/${exerciseId}`, {
        comment: comment,
      })
      .then((response) => {
        const newComment = response.data.comment;
        newComment.user = this.props.currUser;

        const updatedExercises = this.state.exercises.map((exercise) => {
          if (exercise._id === exerciseId) {
            exercise.comments.push(newComment);
          }
          return exercise;
        });

        this.setState({ exercises: updatedExercises });
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  render() {
    const { user, exercises } = this.state;
    if (user && exercises.length > 0) {
      return (
        <>
          <div className="profileHeader">
            <Typography variant="h4">
              {user.first_name} {user.last_name}
            </Typography>

            <Button
              component={RouterLink}
              to={`/users/${user._id}`}
              variant="outlined"
            >
              Details
            </Button>
          </div>

          <List>
            {exercises.map((exercise) => (
              <div key={exercise._id}>
                <div key={exercise._id}>
                  <ExerciseView
                    exercise={exercise}
                    onCommentSubmit={this.handleCommentSubmit}
                  />
                </div>
              </div>
            ))}
          </List>
        </>
      );
    } else {
      return null;
    }
  }
}

export default UserExercises;
