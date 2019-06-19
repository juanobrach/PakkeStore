import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { themeSettings, text } from '../../lib/settings';
import Lscache from 'lscache';







import { Redirect } from 'react-router-dom';


import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';


import Button from '@material-ui/core/Button';
import StepButton from '@material-ui/core/StepButton';
import Typography from '@material-ui/core/Typography';

import ShippingStep from './ShippingStep';
import PaymentStep from './PaymentStep';
import ConfirmStep from './ConfirmStep';


const styles = theme => ({
  root: {
    width: '100%',
    background:'transparent',
    [theme.breakpoints.only('sm')]: {
      padding:0
    }
  },
  backButton: {
    marginRight: theme.spacing.unit,
    borderRadius: '12px',
    padding: '5px 20px',
    border: '1px solid #cccccc',
    fontFamily: 'open_sansregular'
  },
  MuiButtonBase:{
    root:{
      [theme.breakpoints.only('sm')]: { 
        padding:0
      }
    }
  },
  MuiStepButton:{
    [theme.breakpoints.only('sm')]: { 
      padding:0
    }
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  MuiPaper:{
    backgroundColor:'whitesmoke',
    [theme.breakpoints.only('sm')]: {
      padding:0,
      paddingTop: '40px',
      paddingLeft: '2%'
    }
  },
  MuiStepConnector:{
    top: '20%',
    left: 'calc(-40% + 40px)',
    right: 'calc(40% + 40px)',
    position: 'absolute',
    width: '60%',
    [theme.breakpoints.only('sm')]: {
      display:'none'      
    }
  },
  connectorActive: {
    '& $connectorLine': {
      borderColor: '#ff5959',
    },
  },
  connectorCompleted: {
    '& $connectorLine': {
      borderColor: '#ff5959',
    },
  },
  connectorDisabled: {
    '& $connectorLine': {
      borderColor:'gray',
    },
  },
  connectorLine: {
    transition: 'all .5s',
  },
  wizardContainer:{
    backgroundColor:'white',
    borderRadius: '10px',
    minHeight: '500px',
    padding: '30px 30px 40px 30px'

  }
});


function getSteps() {
  return ['Envío', 'Pago', 'Confirmación'];
}


class StepCheckout extends React.Component {

  constructor(props){
    super(props);
    props.loadShippingMethods();
    props.loadPaymentMethods();
    let customerProperties = props.state.customerProperties;  
    if( customerProperties != undefined &&  customerProperties.customer_settings ){ 
      props.updateCart({  
        customer_id: customerProperties.customer_settings.id, 
        email: customerProperties.customer_settings.email 
      })  
    }
  }

  state = {
    activeStep: 0,
  };

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleStepButton = ( step ) =>{
    this.setState({
      activeStep: step,
    });
  }



  componentDidMount() {
    this.props.customerData({
      token: Lscache.get('auth_data')
    });

    this.props.cartLayerInitialized({
      cartlayerBtnInitialized: false
    })

    if (Lscache.get('auth_data') === null && customerProperties === undefined) {
      Lscache.flush();
      return (
        <Redirect to={{
            pathname: '/login'
        }}/>
      );
    }
  }

  // Asigno metodo de envio y pago ya que por el momento solo existe una variante por cada uno
  componentDidUpdate( prevProps ){
    if( this.props.state.shippingMethods != prevProps.state.shippingMethods  ){
      let shippingMethods = this.props.state.shippingMethods;
      if( shippingMethods != undefined && shippingMethods.length > 0){
        this.handleShippingMethodSave( shippingMethods[0].id );
      }
    }
    if( this.props.state.paymentMethods != prevProps.state.paymentMethods  ){
      let paymentMethods  = this.props.state.paymentMethods;
      if( paymentMethods != undefined && paymentMethods.length > 0){
        this.handlePaymentMethodSave( paymentMethods[0].id );
      }
    }
  }


  handleContactsSubmit = values => {
    let { shipping_address, billing_address } = values;
    shipping_address = Object.assign({full_name: `${values.first_name}`}, shipping_address);
    this.props.updateCart({
      mobile: values.mobile,
      first_name: values.first_name,
      last_name: values.last_name,
      shipping_address,
      billing_address
    });
    this.handleNext()
  };

  handleLocationSave = shippingLocation => {
    this.props.updateCart(
      {
        shipping_address: shippingLocation,
        billing_address: shippingLocation,
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


  handleSetFetchedShipping = shippingAddressId => {
    let customerSettings = this.props.state.customerProperties.customer_settings;
    let selectedAddress = customerSettings.addresses[shippingAddressId];
    this.props.updateCart({
      mobile: selectedAddress.phone,
      first_name: customerSettings.first_name,
      last_name: customerSettings.last_name,
      shipping_address: customerSettings.addresses[shippingAddressId],
      billing_address : {}
    });
    this.handleNext()


  }

  handlePaymentMethodSave = paymentMethodId => {
    this.props.updateCart({
      payment_method_id: paymentMethodId
    });
  };

  handlePaymentStepSubmit = data =>{

  }

  handlePaymentStepSuccess = data => {
    this.props.updateCart({
      etomin_card_token: data
    })
    this.handleNext()
  }

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
    const { classes, checkout } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;
    // const activeStep  = 2;

    const {
      settings,
      cart,
      customerProperties,
      paymentMethods,
      shippingMethods,
      shippingMethod,
      checkoutFields,
      cartlayerBtnInitialized,
      processingCheckout
    } = this.props.state;


    const {
      checkoutInputClass = 'checkout-field',
      checkoutButtonClass = 'checkout-button',
      checkoutEditButtonClass = 'checkout-button-edit'
    } = themeSettings;


    
    const StepIcon = ({ label, color = 'gry', textColor = '#ff5959', activeStep }) => (
      <div style={{ position: 'relative', padding: '0 38px'}}>

        {

          label == 'Envío' ? <img src="../../../assets/images/checkout-steps/envio.png" alt=""/> : ''
        }
        {
          label == 'Pago' ?
            activeStep  == 1 || activeStep  == 2  ? <img src="../../../assets/images/checkout-steps/pago.png" alt=""/> : 
                                    <img src="../../../assets/images/checkout-steps/pago-off.png" alt=""/>
            :""         
        }

        {
          label == 'Confirmación' ?
            activeStep  == 2 ? <img src="../../../assets/images/checkout-steps/confirmacion.png" alt=""/> :
                                            <img src="../../../assets/images/checkout-steps/confirmacion-off.png" alt=""/>
            : ""
        }
        <div style={{ color: textColor, 
          lineHeight: '24px', 
          fontFamily:'open_sanssemibold',
          fontSize:'15px', marginTop:'15px' }}>{label}</div>
      </div>
    );
    const connector = (
      <StepConnector
        className={classes.MuiStepConnector}
        classes={{
          active: classes.connectorActive,
          completed: classes.connectorCompleted,
          disabled: classes.connectorDisabled,
          line: classes.connectorLine,
        }}
      />
      );
    return (
      <div className={classes.root}>
          <Stepper className={classes.MuiPaper} activeStep={activeStep} connector={connector} alternativeLabel>
              <Step key="Envío" className={activeStep}>
                <StepButton
                   icon={<StepIcon label="Envío" activeStep={this.state.activeStep} />}
                   onClick={() => this.handleStepButton(0) }
                   className={classes.MuiStepButton}
                />
              </Step>
              <Step key="Pago">
                <StepButton
                   icon={<StepIcon label="Pago" activeStep={this.state.activeStep} textColor={ (activeStep == 0 ? 'gray' : '#ff5959') } />}
                   onClick={() => this.handleStepButton(1) }
                   className={classes.MuiStepButton}

                />
              </Step>
              <Step key="Confirmación">
                <StepButton
                   icon={<StepIcon label="Confirmación" 
                                   activeStep={this.state.activeStep} 
                                   textColor={ (activeStep == 0 || activeStep == 1   ? 'gray' : '#ff5959') }
                                   />}
                   onClick={() => this.handleStepButton(2)}
                   className={classes.MuiStepButton}

                />
              </Step>
          </Stepper>
         <div className={classes.wizardContainer}>
            <div>
              
              { activeStep === 0 ? 
                <ShippingStep
                  customerProperties={customerProperties}
                  saveShippingLocation={this.handleLocationSave}
                  checkoutFields={checkoutFields}
                  handleContactsSubmit={this.handleContactsSubmit}
                  onSubmit={this.handleNext}
                  shippingMethod={shippingMethod}
                  shippingMethods={shippingMethods}
                  handleSetFetchedShipping={this.handleSetFetchedShipping}
                  {...this.props}
                /> : ''
              }


              { activeStep === 1 ? 
                <PaymentStep
                  customerProperties={customerProperties}
                  initialValues={cart}
                  checkoutFields={checkoutFields}
                  onSubmit={this.handleNext}
                  cart={cart}
                  settings={settings}
                  processingCheckout={processingCheckout}
                  handleSuccessPayment={this.handleSuccessPayment}
                  onCreateToken={this.handleCheckoutWithToken}
                  handlePaymentStepSuccess={this.handlePaymentStepSuccess}
                  handlePaymentStepSubmit={this.handlePaymentStepSubmit}
                  updateCart={this.props.updateCart}
                  handleBack={this.handleBack}
                  classes={classes}

                /> : ''
              }

              { activeStep === 2 ? 
                <ConfirmStep
                  customerProperties={customerProperties}
                  initialValues={cart}
                  checkoutFields={checkoutFields}
                  onSubmit={this.handleContactsSubmit}
                  handleSuccessPayment={this.handleSuccessPayment}
                  handleBack={this.handleBack}
                  classes={classes}
                  checkout={checkout}
                  cart={cart}

                  {...this.props}
                /> : ''
              }

            </div>
         </div>
      </div>
    );
  }
}

StepCheckout.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(StepCheckout);