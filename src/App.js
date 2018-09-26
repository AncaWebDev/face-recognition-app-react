import React, { Component } from 'react';
import Navigation from './Components/Navigation/navigation.js';
import Signin from './Components/Signin/signin.js';
import Register from './Components/Register/register.js';
import FaceRec from './Components/FaceRec/facerec.js';
import Logo from './Components/Logo/logo.js';
import Form from './Components/Form/form.js';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';

const app = new Clarifai.App({
 apiKey: '558f64b147a94907b9652492110b2e90'
});

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}



class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
}

displayFaceBox = (box) => {
    this.setState({box: box});
  }

 onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err))
  }

onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState({isSignedIn: false})
  } else if (route === 'home'){
    this.setState({isSignedIn: true})
  }  
  this.setState({route: route});
}

  render() {
    const {isSignedIn, imageURL, route, box} = this.state
    return (
      <div className="App">
        <Particles className='particles'
              params={particlesOptions}
            />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
          {route === 'home' 
            ?  <div>
                <Logo />
                <Form onInputChange={this.onInputChange}
                      onButtonSubmit={this.onButtonSubmit}/>
                <FaceRec box={box} imageURL={imageURL} />
            </div> 
            : (
                this.state.route === 'signin' 
                ? <Signin onRouteChange={this.onRouteChange} />
                : <Register onRouteChange={this.onRouteChange} />
              )
        }
       </div>
    );
  }
}

export default App;
