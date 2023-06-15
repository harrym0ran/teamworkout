import React from 'react';
import { Link as RouterLink } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

//import fetchModel from '../../lib/fetchModelData.js';
import axios from 'axios';

import "./styles.css";

const LinkComponent = React.forwardRef((props, ref) => {
  const { to, ...rest } = props;
  return <RouterLink to={to} ref={ref} {...rest} role={undefined} />;
});

LinkComponent.displayName = 'LinkComponent';

function ListItemLink({ primary, to }) {
  return (
    <li>
      <ListItem button component={LinkComponent} to={to}>
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    axios.get('/user/list')
      .then((response) => {
        this.setState({ users: response.data });
      })
      .catch((error) => {
        console.error('Error fetching user list:', error);
      });
  }

  render() {
    return (
      <div>
        <List component="nav">
          {this.state.users.map((user) => (
            <div key={user._id}>
              <ListItemLink
                to={`/users/${user._id}`}
                primary={`${user.first_name} ${user.last_name}`}
              />
            </div>
          ))}
        </List>
      </div>
    );
  }
}

export default UserList;
