import React, { Component } from 'react';
import {
  Button,
  Item,
  Grid,
  Sticky,
  Header,
  Container,
  Form,
  Checkbox,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { CartItem, AddressForm, CheckoutWidget } from '../components';
import { finalizeOrder, emptyCart, emptyReduxCart } from '../store';
import history from '../history';
import { reduxForm, FormSection } from 'redux-form';

export class Checkout extends Component {
  constructor() {
    super();
    this.state = {
      checkBox: true,

    };
    this.handleOrderSubmit = this.handleOrderSubmit.bind(this);
    this.handleSubmitButtonRef = this.handleSubmitButtonRef.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  handleOrderSubmit = async e => {
    const { billing, shipping } = this.props.formState.checkout.values;
    const { subtotal } = this;
    const { user, cart, submitOrder, deleteBackendCart } = this.props;
    const { checkBox } = this.state;
    if (billing) billing.fullName = `${billing.firstName} ${billing.lastName}`;
    shipping.fullName = `${shipping.firstName} ${shipping.lastName}`;
    const order = {
      billing: checkBox ? shipping : billing,
      shipping,
      user,
      subtotal,
      tax: subtotal * 0.1,
      cart,
    };
    try {
      await submitOrder(order);
      if (user.id) {
        await deleteBackendCart();
        history.push('/home');
      } else {
        history.push('/')
      }
    } catch (err) {
      console.err(err);
    }
  };

  handleCheckboxChange(e, { checked }) {
    this.setState({
      checkBox: checked,
    });
  }
  handleStickyContextRef = contextRef => this.setState({ contextRef });

  handleSubmitButtonRef = submitButtonRef => {
    this.submitButtonRef = submitButtonRef;
  };
  render() {
    const { contextRef, checkBox } = this.state;
    const { cart } = this.props;
    this.subtotal = cart.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );
    return (
      <div className="checkout-cart">
        <Container>
          <div ref={this.handleStickyContextRef}>
            <Grid>
              <Grid.Column width={12}>
                <Grid.Row>
                  <Header as="h2" textAlign="center">
                    Checkout
                  </Header>
                </Grid.Row>
                <Grid.Row>
                  <Header as="h4" textAlign="center">
                    Shipping:
                  </Header>
                  <Form onSubmit={this.handleOrderSubmit}>
                    <FormSection name="shipping">
                      <AddressForm />
                    </FormSection>
                    <Form.Group grouped>
                      <Checkbox
                        defaultChecked
                        label="Billing and shipping address are the same."
                        onChange={this.handleCheckboxChange}
                      />
                    </Form.Group>
                    {!checkBox ? (
                      <FormSection name="billing">
                        <AddressForm />
                      </FormSection>
                    ) : (
                      <div />
                    )}
                    <Form.Group>
                      <Button as="button" type="submit" ref={this.handleSubmitButtonRef}>
                        Process Order
                      </Button>
                    </Form.Group>
                  </Form>
                </Grid.Row>
                <Grid.Row>
                  <Header as="h4" textAlign="center">
                    Payment information:
                  </Header>
                </Grid.Row>
                <Grid.Row>
                  <Header as="h4" textAlign="center">
                    Review and confirm order:
                  </Header>
                  {cart.length ? (
                    <Item.Group divided>
                      {cart.map(item => (
                        <CartItem isCheckout={true} key={item.id} item={item} />
                      ))}
                    </Item.Group>
                  ) : (
                    <Header as="h4" textAlign="center">
                      No items in cart
                    </Header>
                  )}
                </Grid.Row>
              </Grid.Column>
              <Grid.Column width={4}>
                <Sticky
                  bottomOffset={50}
                  context={contextRef}
                  offset={50}
                  pushing
                >
                  <CheckoutWidget
                    handleOrderSubmit={this.handleOrderSubmit}
                    subtotal={this.subtotal}
                    submitButtonRef={this.submitButtonRef}
                  />
                </Sticky>
              </Grid.Column>
            </Grid>
          </div>
        </Container>
      </div>
    );
  }
}
const mapState = ({ cart, user, form: formState }) => ({ cart, user, formState });

const mapDispatch = dispatch => ({
  submitOrder(order, isLoggedIn) {
    if (isLoggedIn) dispatch(emptyCart());
    else dispatch(emptyReduxCart());
    return dispatch(finalizeOrder(order));
  },
  deleteBackendCart() {
    return dispatch(emptyCart());
  },
});

Checkout = reduxForm({ form: 'checkout' })(Checkout);

export default connect(mapState, mapDispatch)(Checkout);
