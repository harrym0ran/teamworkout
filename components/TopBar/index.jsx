import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  TextField,
  Modal,
  ButtonGroup,
} from "@mui/material";
import { withRouter } from "react-router-dom";
import axios from "axios";

import "./styles.css";

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      openUpload: false,
      title: "",
      notes: "",

      isPreviewPage: false,
      selectedImage: null,

      isCoach: false,
    };
  }

  coachCheck() {
    if (this.props.currUser) {
      axios
        .get(`/user/${this.props.currUser._id}`)
        .then((response) => {
          console.log("User data retrieved:", response.data);
          console.log("Is Coach:", response.data.coach);
          this.setState({ isCoach: response.data.coach }); // This line is changed
        })
        .catch((error) =>
          console.error(
            "There has been a problem with your axios request:",
            error
          )
        );
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.checkRoute(this.props.location);
      this.coachCheck();
    }
  }

  handleTitleChange = (event) => {
    this.setState({ title: event.target.value });
  };

  handleNotesChange = (event) => {
    this.setState({ notes: event.target.value });
  };

  handleFileChange = (event) => {
    this.setState({
      selectedImage: event.target.files[0],
      isPreviewPage: true,
    });
  };

  handleOpenUpload = () => {
    this.setState({ openUpload: true });
  };

  handleCloseUpload = () => {
    this.setState({ openUpload: false });
  };

  checkRoute(location) {
    // const userView = location.pathname.startsWith("/users/");
    // const exerciseView = location.pathname.startsWith("/workouts/");
    const currUser = location.pathname.split("/")[2];

    if (currUser) {
      axios
        .get(`/user/${currUser}`)
        .then((response) => {
          this.setState({ user: response.data });
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }

  handleLogout = () => {
    this.props.onLogout();

    // Reset state
    this.setState({
      user: null,
      openUpload: false,
    });
  };

  handleUploadButtonClicked = (e) => {
    e.preventDefault();
    if (this.state.selectedImage) {
      const domForm = new FormData();
      domForm.append("uploadedexercise", this.state.selectedImage);

      domForm.append("title", this.state.title || "");
      domForm.append("notes", this.state.notes || "");

      axios
        .post("/workouts/new", domForm)
        .then((res) => {
          console.log(res);
          this.handleCloseUpload();
          this.props.onRefresh();
        })
        .catch((err) => console.log(`POST ERR: ${err}`));
    }
  };

  render() {
    let message = "Please Login";
    if (this.props.userIsLoggedIn && this.state.user) {
      message = `${this.state.user.first_name} ${this.state.user.last_name}`;
      console.log(this.props.currUser);
    }

    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar className="cs142-topbar-content">
          <Typography variant="h5" className="cs142-topbar-message">
            {message}
          </Typography>
          <Box
            component="img"
            style={{ height: 64 }}
            alt="Logo"
            src={"/logo.png"}
          />

          {this.state.user &&
            this.props.userIsLoggedIn &&
            this.props.currUser && (
              <div className="barItem">
                {this.state.isCoach ? (
                  <ButtonGroup className="group">
                    <Button
                      variant="contained"
                      className="cs142-topbar-addButton"
                      onClick={this.handleOpenUpload}
                    >
                      Upload Workout
                    </Button>
                    <Button
                      variant="contained"
                      className="cs142-topbar-logoutButton"
                      onClick={this.props.onLogout}
                    >
                      Log Out
                    </Button>
                  </ButtonGroup>
                ) : (
                  <Button
                    variant="contained"
                    className="cs142-topbar-logoutButton"
                    onClick={this.props.onLogout}
                  >
                    Log Out
                  </Button>
                )}
              </div>
            )}
        </Toolbar>

        <Modal open={this.state.openUpload} onClose={this.handleCloseUpload}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            {this.state.isPreviewPage ? (
              <div className="cs142-image-preview-container">
                <Typography variant="h6" id="modal-title">
                  Preview Image
                </Typography>
                <img
                  src={URL.createObjectURL(this.state.selectedImage)}
                  alt="Preview"
                  className="cs142-image-preview"
                />
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => this.setState({ isPreviewPage: false })}
                >
                  Back
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={this.handleUploadButtonClicked}
                >
                  Upload
                </Button>
              </div>
            ) : (
              <>
                <Typography variant="h6" id="modal-title">
                  Upload Workout
                </Typography>
                <TextField
                  variant="outlined"
                  label="Title"
                  value={this.state.title}
                  onChange={this.handleTitleChange}
                />
                <TextField
                  variant="outlined"
                  label="Notes"
                  value={this.state.notes}
                  onChange={this.handleNotesChange}
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={this.handleFileChange}
                />
                <Button
                  variant="outlined"
                  color="inherit"
                  disabled={!this.state.selectedImage}
                  onClick={() => this.setState({ isPreviewPage: true })}
                >
                  Next
                </Button>
              </>
            )}
          </Box>
        </Modal>
      </AppBar>
    );
  }
}

export default withRouter(TopBar);
