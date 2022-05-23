import { Component } from "react";

import ErrorMessage from "../errorMessage/errorMessage";

class ErrorBoundary extends Component {
  state = {
    error: false
  }

  // Можно также сохранить информацию об ошибке в соответствующую службу журнала ошибок
  componentDidCatch(error, info) {
    console.log(error, info);
    this.setState({
      error: true
    })
  }


  render() {
    if (this.state.error) {
      return <ErrorMessage/>
    }

    return this.props.children;
    
  }

}

export default ErrorBoundary;