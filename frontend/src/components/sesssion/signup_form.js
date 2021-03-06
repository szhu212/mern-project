import React from "react";
import { withRouter } from "react-router-dom";
import './signup.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faLock, faUser } from "@fortawesome/free-solid-svg-icons";

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      password2: "",
      errors: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearedErrors = false;
    this.handleDemo = this.handleDemo.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated) {
      this.props.history.push("/");
      this.props.closeModal();
    }

    this.setState({ errors: nextProps.errors });
  }

  update(field) {
    return e =>
      this.setState({
        [field]: e.currentTarget.value
      });
  }

  handleSubmit(e) {
    e.preventDefault();
    let user = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.signup(user, this.props.history);
  }

  handleDemo(e) {
    e.preventDefault();

    let demoUser = {
      email: "song5@song5.song",
      password: "111111"
    }

    this.props.loginDemo(demoUser);
    this.props.closeModal();
  }


  renderErrors() {
    return (
      <ul>
        {Object.keys(this.state.errors).map((error, i) => (
          <li key={`error-${i}`}>{this.state.errors[error]}</li>
        ))}
      </ul>
    );
  }

  render() {
    return (
      <div className="signup-form-container">
        <div onClick={this.props.closeModal} className="close-x">
          ×
        </div>
        <h1>Signup</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="signup-form">
            <div className="textbox">
              <FontAwesomeIcon icon={faAt} className="icon" />
              <input
                type="text"
                value={this.state.email}
                onChange={this.update("email")}
                placeholder="Email"
              />
            </div>
            <div className="textbox">
              <FontAwesomeIcon icon={faUser} className="icon" />
              <input
                type="text"
                value={this.state.username}
                onChange={this.update("username")}
                placeholder="Username"
              />
            </div>
            <div className="textbox">
              <FontAwesomeIcon icon={faLock} className="icon" />
              <input
                type="password"
                value={this.state.password}
                onChange={this.update("password")}
                placeholder="Password"
              />
            </div>
            <div className="textbox">
              <FontAwesomeIcon icon={faLock} className="icon" />
              <input
                type="password"
                value={this.state.password2}
                onChange={this.update("password2")}
                placeholder="Confirm Password"
              />
            </div>

            <input type="submit" value="Sign Up" />
            <div className="session-errors">
              {this.renderErrors()}
            </div>
          </div>
        </form>
        <button className="demo-button" onClick={this.handleDemo}>Demo User</button>
      </div>
    );
  }
}

export default withRouter(SignupForm);
