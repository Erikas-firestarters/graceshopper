/* eslint react/prefer-stateless-function: 0 class-methods-use-this:0*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import ProductItem from './product-item.js';
import Sidebar from '../sidebar';


class ProductList extends Component {
  constructor () {
    super()
    this.state = {
    }
  }
  findCategoryMatch (products, catId) {
    let match = (elem) => elem.id === catId;
    return products.filter(product => product.categories.some(match)
    )
  }
  handleStickyContextRef = contextRef => this.setState({ contextRef });

  render() {
    const { contextRef } = this.state;
    const { products, activeCategory } = this.props;
    const subRoute = this.props.match.params.type || '';
    return (
      <div ref={this.handleStickyContextRef}>
      <Grid >
        <Grid.Row columns={2}>
          <Grid.Column width={2} stretched>
            <div className="sidebar">
              <Sidebar contextRef={contextRef} />
            </div>
          </Grid.Column>
          <Grid.Column width={14}>
            <Grid stackable>
            <Grid.Row columns={3} centered>
              {subRoute ?
                this.findCategoryMatch(products, activeCategory.id)
                .map(product => (
                    <Grid.Column key={product.id}>
                      <ProductItem
                        product={product}
                      />
                    </Grid.Column>
                ))
                :
                products.map(product => (
                    <Grid.Column key={product.id}>
                      <ProductItem
                        product={product}
                      />
                    </Grid.Column>
                  ))}

            </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      </div>
    );
  }
}

const mapState = ({ products, activeCategory, cart, user }) => ({
  products,
  activeCategory,
  cart,
  user,
  isLoggedIn: !!user.id,
});

const mapDispatch = null;

export default connect(mapState, mapDispatch)(ProductList);
