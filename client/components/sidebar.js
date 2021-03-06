import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Sticky } from 'semantic-ui-react';
import {
  getCategories,
  setActiveCategory,
  removeActiveCategory,
} from '../store';
import history from '../history';
import { capitalize } from '../../server/utils/helperFunctions';
class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
    this.handeClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    if (this.props.activeCategory.name === '') {
      this.props.setActiveCategory({ name: 'All Products', id: 0 });
    }
  }
  componentWillUnMount() {
    this.props.removeActiveCategory();
  }
  handleClick(e, cat) {
    this.props.setActiveCategory(cat);
    if (!cat.id) history.push(`/products/`);
    else history.push(`/products/categories/${cat.id}`);
  }
  toggleVisibility = () => this.setState({ visible: !this.state.visible });

  render() {
    const { contextRef } = this.props;
    return (
      <Menu vertical fluid>
        <Sticky
          context={contextRef}
          bottomOffset={50}
          offset={50}
          pushing
        >
          <Menu.Item
            key="00"
            name="All Products"
            active={this.props.activeCategory.name === 'All Products'}
            onClick={e => this.handleClick(e, { name: 'All Products', id: 0 })}
            link
          />
          {this.props.categories.map(category => (
            <Menu.Item
              key={category.id}
              name={capitalize(category.name)}
              active={this.props.activeCategory.name === category.name}
              onClick={e =>
                this.handleClick(e, { name: category.name, id: category.id })
              }
            />
          ))}
        </Sticky>
      </Menu>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = ({ categories, activeCategory }) => ({
  categories,
  activeCategory,
});

const mapDispatch = { getCategories, setActiveCategory, removeActiveCategory };

export default connect(mapState, mapDispatch)(Sidebar);
