import React from 'react';
import {Link} from "react-router-dom"
import{Row,Col} from "react-bootstrap"
const Footer = () => {
return(
<div className="footer">
			<div className="">
				{/* <Row className="flex-row-reverse"> */}
				<Row className='app-content mt-0'>
				<Col className="text-left" sm={6} md={6} lg={6}>
						 Privacy | Terms of Use | Cookies
					</Col>
					<Col className="text-right" sm={6} md={6} lg={6}>
						 Copyright © 2024 <Link to="#">Janma-Mrityu Tathya</Link>. All rights reserved
					</Col>
				</Row>
			</div>
		</div>

);
}
  
export default Footer;
