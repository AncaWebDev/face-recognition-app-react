import React, { Component } from 'react';
import Navigation from './Components/Navigation/navigation.js';
import Signin from './Components/Signin/signin.js';
import Register from './Components/Register/register.js';
import FaceRec from './Components/FaceRec/facerec.js';
import Rank from './Components/Rank/rank.js';
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
      value: 50,
      density: {
        enable: true,
        density_auto: true,
        value_area: 800
      }
    },
   line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.3,
      width: 1
    },
    "opacity": {
      "value": 0.2,
      "random": false,
    }
  }
}


const initialState = {
    input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
}


class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }


loadUser = (data) => {
  this.setState({user: {
    id: data.id,
    name: data.name,
    email: data.email,
    password: data.password,
    entries: data.entries,
    joined: data.joined
  }})
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
    .then(response => {
      if (response) {
        fetch('https://magic-brain-app.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
       })
    })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user,{entries:count}))
        })
        .catch(console.log)
    }
    this.displayFaceBox(this.calculateFaceLocation(response))
   })
    .catch(err => console.log(err))
  }

 onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageURL, route, box } = this.state;
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <Form
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRec box={box} imageURL={imageURL} />
            </div>
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
