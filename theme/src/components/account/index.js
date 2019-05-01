import React from 'react';
import { Redirect } from 'react-router-dom';
import Lscache from 'lscache';
import { themeSettings, text } from '../../lib/settings';
import AuthHeader from '../../../../src/server/auth-header';
import Account from './account';

export default class AccountForm extends React.Component {
	constructor(props) {
		super(props);
		console.log('props',props)
	}

	handlecustomerProperties = () => {
    	this.props.customerData({
			token: Lscache.get('auth_data')
		});
	};

	handleFormSubmit = values => {
		const { shipping_address, billing_address } = values;
		this.props.changecustomerProperties({
			first_name: values.first_name,
			last_name: values.last_name,
			email: values.email,
			password: AuthHeader.encodeUserPassword(values.password),
			token: Lscache.get('auth_data'),
			shipping_address,
			billing_address,
			history: this.props.history
		});

		this.props.updateCart({
			shipping_address: shipping_address,
			billing_address: billing_address,
			payment_method_id: null,
			shipping_method_id: null
		});
	}

	handleUpdateAddress = values => {
		this.props.changecustomerProperties({});
	}

	componentDidMount(){
		this.props.updateCustomerAddress("5cb2324f42a88910b1ebcc1e", "5cc9f54b49ae3c30d165f45f", { "full_name" : "Predo Manuel" });
	}

	render() {

		const {
      		settings,
			customerProperties,
			initialValues,
			cartlayerBtnInitialized
		} = this.props.state;

		console.log( this.props );
		Lscache.flushExpired();

		if (Lscache.get('auth_data') === null && customerProperties === undefined) {
			Lscache.flush();
			return (
			  <Redirect to={{
						pathname: '/login'
				}}/>
			);
		} else {
			const cacheTimeStamp = localStorage.getItem('lscache-auth_data-cacheexpiration');
			if (Number (cacheTimeStamp) <= Math.floor((new Date().getTime()) / 1000)) {
				Lscache.flush();
				return (
					<Redirect to={{
						pathname: '/login'
					}}/>
				)
			}
				
			const {
				checkoutInputClass = 'checkout-field',
				checkoutButtonClass = 'checkout-button',
				checkoutEditButtonClass = 'checkout-button-edit'
			} = themeSettings;
	
			return (
				<Account
					inputClassName={checkoutInputClass}
					buttonClassName={checkoutButtonClass}
					editButtonClassName={checkoutEditButtonClass}				
					settings={settings}
					customerProperties={customerProperties || this.handlecustomerProperties()}
					initialValues={initialValues}
					cartlayerBtnInitialized={cartlayerBtnInitialized}
					onSubmit={this.handleFormSubmit}
					addCustomerAddress={this.props.addCustomerAddress}
				/>
			);
		}
	}
}
