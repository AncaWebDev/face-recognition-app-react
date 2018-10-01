import React from 'react';
import Tilt from 'react-tilt';
import brain from './brain.png';
import './logo.css';

const Logo = () => {
	return(
		<div className="ma3 mt0 brain">
			<Tilt className="Tilt br3 shadow-3" options={{ max : 55 }} style={{ height: 130, width: 130 }} >
			<div className="Tilt-inner pa2"><img style={{paddingTop:'7px'}} alt='logo' src={brain}/><p className='f5 logoText'>Magic Brain App</p></div>
			</Tilt>
		</div>
		);
}

export default Logo;