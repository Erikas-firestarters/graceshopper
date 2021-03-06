import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth} from '../store'

/**
 * COMPONENT
 */
const AuthForm = (props) => {
  const {name, displayName, handleSubmit, error, cart} = props

  return (
    <div className="ui middle aligned center aligned grid">
      <div className="column">
      <h2 className="ui image header">
        <div className="content">
        {displayName} to your account
        </div>
      </h2>
      {error && error.response && <div className="ui error message">
        <div> {error.response.data} </div>
      </div>}
      <form onSubmit={(e) => handleSubmit(e, cart)} name={name} className="ui large form">

        <div className="ui left icon input">
          <i className="user icon" />
          <input type="text" name="email" placeholder="E-mail address" />
        </div>
        <div className="ui left icon input">
            <i className="lock icon" />
            <input type="password" name="password" placeholder="Password" />
        </div>
        <div>
          <button type="submit" className="ui fluid large teal submit button">{displayName}</button>
        </div>
      </form>
      <a className="ui large teal submit button" href="/auth/google">{displayName} with Google</a>
    </div>
    </div>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error,
    cart: state.cart
  }
}

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSubmit (evt, cart) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      let currCart = cart
      dispatch(auth(email, password, formName, currCart))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
