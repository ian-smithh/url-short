import React, { Component} from "react";
import "./App.css";
import URLShortHome from "../app/Home";

class App extends Component{
  render(){
    return(
      <div className="App">
        <URLShortHome/>
      </div>
    );
  }
}

export default App;