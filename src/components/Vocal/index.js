import React, { Component } from "react";
import annyang from "annyang";
import * as sp from "../utils/speech-recognition";

class Vocal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      command: "",
      commandType: ""
    }
  }

  componentDidMount() {
    console.log(annyang);
    if (annyang) {
      console.log("Speech recognition launched --");
      const commands = {
        "bonjour": () => {
          this.setState({ command: "Bonjour !" });
        },
        "teste": () => {
          this.setState({ comand: "test" });
        },
        "play *song": song => {
          const result = `https://api.spotify.com/v1/search?q=${encodeURI(song)}`;
          this.setState({ command: song, commandType: "play", toShow: result });
        },
        // "*anything": (anything) => this.setState({ command: anything });
      };
      annyang.addCommands(commands);
      annyang.setLanguage('fr-FR');
      annyang.start();
    }
  }

  render() {
    const { command, commandType, toShow } = this.state;

    return (
      <div>
        <p className="output">MSG</p>
        <p className="hints">{command || "Parlez un peu..."}  --> Type : {commandType}</p>
        <p className="hints">{toShow}</p>
      </div>
    );
  }
}
// "start": "react-scripts start",
export default Vocal;