import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class IframeWidget extends Component {

  constructor(props){
      super(props);
  }

  componentDidMount () {
    let iframe = ReactDOM.findDOMNode(this.refs.iframe)
  }

  render () {
    const iframeStyle = {
      width: '100%',
      height: '500px',
      border: '0'
    }

    return (
      <iframe
        className={this.props.class}
        ref="iframe"
        frameBorder={'0'}
        style={iframeStyle}
        src={this.props.url}
      />
    )
  }

}

export default IframeWidget