import React from 'react';
import * as Icon from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native'

export default class NavigationBarButton extends React.Component {

  constructor(props) {
    super(props)
  }

  onClickListen = () => { }

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 18,
        }}>

        <Icon.Ionicons
          name={this.props.name}
          size={28}
          color={'white'}
        />
      </TouchableOpacity>
    );
  }
}