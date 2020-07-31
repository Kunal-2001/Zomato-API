import React, { Component } from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import './Restaurant.css';
import { AiFillStar } from 'react-icons/ai';

class Restaurant extends Component {
	render() {
		const {
			avgCost,
			cuisines,
			onlineDelivery,
			address,
			name,
			rating,
			url,
			contact,
			image,
			menu,
			currency,
			timings
		} = this.props;
		const isAvailable = onlineDelivery ? 'Order Now' : 'Book a table';
		const imageAvailable =
			image !== ''
				? image
				: 'https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-stock-vector-no-image-available-icon-flat-vector-illustration.jpg?ver=6';
		return (
			<div>
				<Card className="restaurant" style={{ width: '18rem' }}>
					<Card.Img variant="top" src={imageAvailable} />
					<Card.Body>
						<Card.Title>
							{name}
							<span className="rating">
								{rating} <AiFillStar />
							</span>
						</Card.Title>
						<Card.Text>{address}</Card.Text>
					</Card.Body>
					<ListGroup className="list-group-flush">
						<ListGroupItem>Cuisines : {cuisines}</ListGroupItem>
						<ListGroupItem>Timings : {timings}</ListGroupItem>
						<ListGroupItem>
							Cost For Two : {currency}
							{avgCost}
						</ListGroupItem>
						<ListGroupItem>Contact : {contact}</ListGroupItem>
					</ListGroup>
					<Card.Body>
						<Card.Link href={url} target="_blank">
							{isAvailable}
						</Card.Link>
						<Card.Link href={menu} target="_blank">
							View Menu
						</Card.Link>
					</Card.Body>
				</Card>
			</div>
		);
	}
}

export default Restaurant;
