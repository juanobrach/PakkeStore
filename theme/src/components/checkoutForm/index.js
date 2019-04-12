import React from 'react';
import { themeSettings, text } from '../../lib/settings';
import CheckoutStepContacts from './stepContacts';
import CheckoutStepShipping from './stepShipping';
import CheckoutStepPayment from './stepPayment';
import Lscache from 'lscache';

export default class CheckoutForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			step: 1
		};
	}

	componentDidMount() {
		this.props.loadShippingMethods();
		this.props.loadPaymentMethods();
		this.props.customerData({
			token: Lscache.get('auth_data')
		});

		this.props.cartLayerInitialized({
			cartlayerBtnInitialized: false
		})
	}

	changeStep = step => {
		this.setState({ step: step });
	};

	handleContactsSave = () => {
		this.changeStep(2);
	};

	handleContactsEdit = () => {
		this.changeStep(1);
	};

	handleShippingSave = () => {
		this.changeStep(3);
	};

	handleShippingEdit = () => {
		this.changeStep(2);
	};

	handleContactsSubmit = values => {
		let { shipping_address, billing_address } = values;
		shipping_address = Object.assign({full_name: `${values.first_name} ${values.last_name}`}, shipping_address);
		this.props.updateCart({
			email: values.email,
			mobile: values.mobile,
			first_name: values.first_name,
			last_name: values.last_name,
			password: values.password,
			shipping_address,
			billing_address
		});

		this.handleContactsSave();
	};

	handleLocationSave = shippingLocation => {
		this.props.updateCart(
			{
				shipping_address: shippingLocation,
				billing_address: shippingLocation,
				payment_method_id: null,
				shipping_method_id: null
			},
			cart => {
				this.props.loadShippingMethods();
				this.props.loadPaymentMethods();
			}
		);
	};

	handleShippingMethodSave = shippingMethodId => {
		this.props.updateCart(
			{
				payment_method_id: null,
				shipping_method_id: shippingMethodId
			},
			cart => {
				this.props.loadPaymentMethods();
			}
		);
	};

	handlePaymentMethodSave = paymentMethodId => {
		this.props.updateCart({
			payment_method_id: paymentMethodId
		});
	};

	isShowPaymentForm = () => {
		const { payment_method_gateway } = this.props.state.cart;
		const paymentGatewayExists =
			payment_method_gateway && payment_method_gateway !== '';
		return paymentGatewayExists;
	};

	handleShippingSubmit = values => {
		if (this.isShowPaymentForm()) {
			const { shipping_address, billing_address, comments } = values;

			this.props.updateCart({
				shipping_address,
				billing_address,
				comments
			});
			this.handleShippingSave();
		} else {
			this.props.checkout(values);
		}
	};

	handleSuccessPayment = () => {
		this.props.checkout(null);
	};

	handleCheckoutWithToken = tokenId => {
		this.props.updateCart(
			{
				payment_token: tokenId
			},
			cart => {
				this.props.checkout(null);
			}
		);
	};

	render() {
		const { step } = this.state;

		const {
			settings,
			cart,
			customerProperties,
			paymentMethods,
			shippingMethods,
			shippingMethod,
			loadingShippingMethods,
			loadingPaymentMethods,
			checkoutFields,
			processingCheckout,
			cartlayerBtnInitialized
		} = this.props.state;

		const {
			checkoutInputClass = 'checkout-field',
			checkoutButtonClass = 'checkout-button',
			checkoutEditButtonClass = 'checkout-button-edit'
		} = themeSettings;

		if (cart && cart.items.length > 0) {
			const showPaymentForm = this.isShowPaymentForm();

			let shippingMethod = null;
			let paymentMethod = null;
			const { shipping_method_id, payment_method_id } = cart;
			if (shipping_method_id && shippingMethods && shippingMethods.length > 0) {
				shippingMethod = shippingMethods.find(
					method => method.id === shipping_method_id
				);
			}
			if (payment_method_id && paymentMethods && paymentMethods.length > 0) {
				paymentMethod = paymentMethods.find(
					method => method.id === payment_method_id
				);
			}

			return (
				<div className="checkout-form">
					
				</div>
			);
		} else {
			return <p>{text.emptyCheckout}</p>;
		}
	}
}
