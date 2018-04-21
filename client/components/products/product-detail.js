/* eslint react/prefer-stateless-function: 0 class-methods-use-this:0*/
import React, { Component } from 'react';
import ReviewList from './review-list';
import ProductForm, {ProductImg, ProductDescription }  from './product-view-parts';
import { Button, Modal, Icon} from 'semantic-ui-react';

class ProductDetail extends Component {
  render() {
    return (
      <Modal trigger={<Button icon color="pink"><Icon name="magnify" /></Button>}>
        <Modal.Header>{this.props.product.name}</Modal.Header>
        <Modal.Content image>
          <ProductImg imageUrl={this.props.product.imageUrl} />
          <Modal.Description>
             <ProductDescription
              price={this.props.product.price}
              description={this.props.product.description}
            />
            <ProductForm product={this.props.product} addCartItem={this.props.addCartItem} />
          </Modal.Description>
        </Modal.Content>
        <Modal.Content>
        <ReviewList productId={this.props.product.id} />
        </Modal.Content>
      </Modal>
    );
  }
}

export default ProductDetail
