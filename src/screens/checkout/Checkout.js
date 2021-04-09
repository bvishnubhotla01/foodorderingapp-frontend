import React, { Component } from 'react';
import Header from '../../common/header/Header';
import './Checkout.css';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { FormHelperText, IconButton, MenuItem } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { Select } from '@material-ui/core';
import { Input, InputLabel } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRupeeSign, faStopCircle } from '@fortawesome/free-solid-svg-icons';
import { Divider } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import { Redirect } from 'react-router-dom'



function getSteps() {
  return ['Delivery', 'Payment'];
}

let state;

const steps = getSteps();

let value;

let val = 0;

let addresses = [];

let activeStep = 0;

let index = 0;

let valueRadio;
let i = 0;
let x = 1
let check = ""
let discount = 0

let addressIndex = 0

class Checkout extends Component {

  constructor() {
    super()
    this.state = {
      activeStep: 0,
      value: 0,
      addresses: "",
      flag: false,
      payment: "",
      index: 0,
      valueRadio: "",
      state: "",
      flagState: false,
      flagFlat: false,
      flagLocality: false,
      flagCity: false,
      flagPin: false,
      stateName: "",
      flat: "",
      locality: "",
      city: "",
      pin: "",
      checkoutSummary: "",
      showMessage: false,
      activeStepFlag: false,
      checkoutAddress: "",
      coupon: "",
      percentDiscount: "",
      couponId: "",
    }
  }
  //check = this.props.location.checkoutSummary

  handleNext = () => {
    let deliveryFlag = false
    activeStep = 0

    let a = document.getElementsByClassName('icon')
    let id;
    for (var x = 0; x < a.length; x++) {
      if (a[x].style.color === 'green') {
        id = x;
        console.log('true')
        deliveryFlag = true
      }
    }

    if (deliveryFlag) {
      activeStep++
      this.setState({ activeStep: activeStep, flag: false, index: 1, activeStepFlag: false, checkoutAddress: this.state.addresses.addresses[id] })
    } else if (this.state.valueRadio != "" && this.state.activeStep === 1) {
      this.setState({ activeStepFlag: true, activeStep: 2 })
    }
  }

  handleBack = () => {
    activeStep--
    this.setState({ activeStep: activeStep, index: 0, flag: false, payment: "", activeStepFlag: false })
  };


  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ showMessage: false });
  }


  handleReset = () => {
    this.setState({ activeStep: 0, i: 0, index: 0, valueRadio: "" })
  };


  handleChange = (event, value) => {
    this.setState({ value: value, i: 0 })
  };

  componentDidMount() {

    let abc = this.getAddress()

    if (!this.state.flag) {
      this.getStepContent(0, "http://localhost:8080/api/")
    }
  }
  getStepContent(step, url) {
    let that = this
    switch (step) {
      case 0:
        let xhr = new XMLHttpRequest()
        xhr.addEventListener('readystatechange', function () {
          if (xhr.readyState === 4) {
            console.log(this.responseText)

            if (JSON.parse(this.responseText).addresses.length > 0) {
              that.setState({ addresses: JSON.parse(this.responseText), flag: true, activeStepFlag: false })
            }
          }
        })

        xhr.open('GET', url + 'address/customer')
        xhr.setRequestHeader('authorization', sessionStorage.getItem('access-token'))
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send()
        break;
      case 1:
        console.log(this.state.index)
        xhr = new XMLHttpRequest()
        xhr.addEventListener('readystatechange', function () {
          if (xhr.readyState === 4) {
            console.log(this.responseText)
            that.setState({ payment: JSON.parse(this.responseText), flag: true, activeStepFlag: false })
          }
        })
        xhr.open('GET', url + 'payment')
        xhr.setRequestHeader('authorization', sessionStorage.getItem('access-token'))
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send()
        break;

      default:
        return 'Unknown step';
    }
  }

  handleChangeRadio = (e) => {
    this.setState({ valueRadio: e.target.value })
  }

  iconAddressHandler = (key) => {
    console.log(key)
    let a = document.getElementById('c' + key)
    let b = document.getElementsByClassName('address')
    for (var x = 0; x < b.length; x++) {
      b[x].style.borderStyle = 'none'
      b[x].style.boxShadow = 'none'
    }
    a.style.borderStyle = "solid"
    a.style.borderColor = "red"
    a.style.boxShadow = 'red 10px 10px'
    let d = document.getElementById('i' + key)
    let e = document.getElementsByClassName('icon')
    for (var x = 0; x < b.length; x++) {
      e[x].style.color = 'black'
    }

    d.style.color = 'green'




  }



  getAddress = () => {


    let xhr = new XMLHttpRequest()
    let that = this;
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        console.log(this.responseText)
        let abc = JSON.parse(this.responseText)
        abc = abc.states
        that.setState({ state: abc })
      }
    })
    xhr.open('GET', 'http://localhost:8080/api/states')
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send()
  }


  onChangeFlatHandler = (e) => {
    console.log(e.target.value)
    this.setState({ flat: e.target.value })
  }


  onChangeCityHandler = (e) => {
    this.setState({ city: e.target.value })
  }


  onChangeSelectHandler = (e) => {
    this.setState({ stateName: e.target.value })
  }


  onChangeLocalityHandler = (e) => {
    this.setState({ locality: e.target.value })
  }


  onChangePinHandler = (e) => {
    this.setState({ pin: e.target.value })
  }


  handleSave = () => {
    let num = 0;
    if (this.state.flat === "") {
      this.setState({ flagFlat: true })
    }
    else {
      num++
      this.setState({ flagFlat: false })
    }
    if (this.state.city === "") {
      this.setState({ flagCity: true })
    }
    else {
      num++
      this.setState({ flagCity: false })
    }
    if (this.state.stateName === "") {
      this.setState({ flagState: true })
    }
    else {
      num++
      this.setState({ flagState: false })
    }

    if (this.state.locality === "") {
      this.setState({ flagLocality: true })
    }
    else {
      num++
      this.setState({ flagLocality: false })
    }

    if (this.state.pin === "") {
      this.setState({ flagPin: true })
    }
    else if (this.state.pin.length !== 6 || (parseInt(this.state.pin) ? false : true)) {
      this.setState({ flagPin: true })
      document.getElementById('pin1').innerHTML = 'Pincode must contain only numbers and must be 6 digits long'

    }
    else {
      num++
      this.setState({ flagPin: false })
    }


    if (num === 5) {
      let xhr = new XMLHttpRequest()
      let that = this;
      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          console.log(this.responseText)
        }
      })
      xhr.open('POST', 'http://localhost:8080/api/address')
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Cache-Control", "no-cache");
      xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      xhr.setRequestHeader("authorization", sessionStorage.getItem('access-token'))
      let data = {};
      data.city = this.state.city
      data.flat_building_name = this.state.flat
      data.locality = this.state.locality
      data.pincode = this.state.pin
      data.state_uuid = this.state.stateName
      data = JSON.stringify(data)
      xhr.send(data)

      this.setState({
        showMessage: true,
        successMessage: "Address Saved Successfully!",
        stateName: "",
        flat: "",
        locality: "",
        city: "",
        pin: ""
      })
    }



  }


  placeOrderHandler = () => {

    let xhr = new XMLHttpRequest()
    let id = ""
    let that = this;
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4 && this.status === 201) {
        console.log(this.responseText)
        id = (JSON.parse(this.responseText).id)
        console.log('ID', id)
        that.setState({ showMessage: true, successMessage: 'Order placed successfully! Your order ID is ' + id })
      }
      else {
        that.setState({ showMessage: true, successMessage: 'Unable to place your order! Please try again!' })
      }
    })
    xhr.open('POST', 'http://localhost:8080/api/order')
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.setRequestHeader("authorization", sessionStorage.getItem('access-token'))
    let data = {};
    console.log('HI')
    data.address_id = this.state.checkoutAddress.id
    let xz = 0
    this.props.location.itemList.map((item) => (
      this.props.location.itemList[xz++].item_id = item.id
    ))

    data.item_quantities = this.props.location.itemList
    console.log('ITEMS', data.item_quantities)
    data.restaurant_id = this.props.location.restaurant_id


    let payment_id = "";
    this.state.payment.paymentMethods.map((pay) => (
      payment_id = this.state.valueRadio === pay.payment_name ? pay.id : payment_id
    ))
    data.payment_id = payment_id
    data.coupon_id = this.state.couponId
    data.discount = discount
    data.bill = parseFloat(Math.round(this.props.location.totalAmount)).toFixed(2)
    data = JSON.stringify(data)
    xhr.send(data)




  }


  couponHandler = (e) => {
    this.setState({ coupon: e.target.value })
  }

  discountHandler = () => {
    console.log(this.state.coupon)

    let xhr = new XMLHttpRequest()
    let that = this;
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        console.log(this.responseText)
        let a = (JSON.parse(this.responseText))
        that.setState({ percentDiscount: a.percent, couponId: a.id })
      }
    })
    xhr.open('GET', 'http://localhost:8080/api/order/coupon/' + this.state.coupon)
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.setRequestHeader("authorization", 'Bearer ' + sessionStorage.getItem('access-token'))
    xhr.send()
  }


  render() {

    console.log('From checkout', this.props.location)
    return (

      this.props.location.restaurant_id === undefined ? <Redirect to="/" /> :
        < div className='uppercontainer'>
          <Header />
          <div className='top1container' style={{ height: '100%' }} id='topmost'>

            <div style={{ width: '70%', height: '100%', marginTop: '0%' }}>
              <Stepper activeStep={this.state.activeStep} orientation="vertical" style={{ height: '70%' }}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      <div className='scrollmenu' style={{ borderBottom: '1 px solid black', overflowX: 'scroll' }}>
                        {this.state.index === 0 ?
                          <AppBar position="static">
                            <Tabs value={this.state.value} onChange={this.handleChange} aria-label="simple tabs example">
                              <Tab label="Existing Address" />
                              <Tab label="New Address" />
                            </Tabs>
                          </AppBar> : ""}

                        {this.state.addresses === "" && (!(this.state.value)) ? <Typography>There are no saved addresses! You can save an address using the 'New Address' tab or using your ‘Profile’ menu option.</Typography> : ""}

                        <GridList cols={3}>
                          {this.state.addresses.addresses != undefined && (this.state.value === 0) && (this.state.activeStep === 0) ? this.state.addresses.addresses.map((address) => (

                            <GridListTile key={val} >
                              <div className='address' id={'c' + val}>
                                <span>{'' + address.flat_building_name}</span><br />
                                <span> {'' + address.locality}</span><br />
                                <span> {'' + address.city}</span><br />
                                <span> {'' + address.state.state_name}</span><br />
                                <span>{'' + address.pincode}</span><br />
                                <IconButton id={'b' + val} onClick={this.iconAddressHandler.bind(this, val)} style={{ marginLeft: '60%' }}><CheckCircleIcon className='icon' id={'i' + val++} /></IconButton>
                              </div >
                              <br /><br /><br />
                            </GridListTile>

                          )) : ""}
                          <br /><br /><br />
                        </GridList>

                        {this.state.payment != "" && this.state.activeStep === 1 ? <div>
                          <br />

                          <FormControl component="fieldset">
                            <FormLabel component="legend">Select Mode Of Payment</FormLabel>
                            <RadioGroup aria-label="gender" name="gender1" value={valueRadio} onChange={this.handleChangeRadio}>
                              {this.state.payment.paymentMethods.map((payment) => (
                                <FormControlLabel value={payment.payment_name} key={i++} control={<Radio />} label={'' + payment.payment_name} />
                              ))
                              }
                            </RadioGroup>
                          </FormControl>  </div> : ""

                        }
                        {(this.state.value === 1) ?
                          <div>
                            <FormControl required>
                              <InputLabel htmlFor="flat">Flat/Buiding No.</InputLabel>
                              <Input id="flat" onChange={this.onChangeFlatHandler} />
                              <FormHelperText style={{ color: 'red' }} className={this.state.flagFlat ? 'dispBlock' : 'dispNone'}>required</FormHelperText>
                            </FormControl><br /><br />

                            <FormControl required>
                              <InputLabel htmlFor="locality">Locality</InputLabel>
                              <Input id="locality" onChange={this.onChangeLocalityHandler} />
                              <FormHelperText style={{ color: 'red' }} className={this.state.flagLocality ? 'dispBlock' : 'dispNone'}>required</FormHelperText>
                            </FormControl><br /><br />

                            <FormControl required>
                              <InputLabel htmlFor="city">City</InputLabel>
                              <Input id="city" onChange={this.onChangeCityHandler} />
                              <FormHelperText style={{ color: 'red' }} className={this.state.flagCity ? 'dispBlock' : 'dispNone'}>required</FormHelperText>
                            </FormControl><br /><br />

                            <FormControl required >
                              <InputLabel htmlFor="state">State</InputLabel>




                              <Select id="state" style={{ width: '200px' }} value={this.state.stateName} onChange={this.onChangeSelectHandler}>
                                {this.state.state.map((state) => (

                                  <MenuItem name={state.state_name} key={state.state_name} value={state.id}>{state.state_name}</MenuItem>
                                ))
                                }
                              </Select>
                              <FormHelperText style={{ color: 'red' }} className={this.state.flagState ? 'dispBlock' : 'dispNone'}>required</FormHelperText>
                            </FormControl><br /><br />



                            <FormControl required>
                              <InputLabel htmlFor="pincode">Pincode</InputLabel>
                              <Input id="pincode" onChange={this.onChangePinHandler} />
                              <FormHelperText id='pin1' style={{ color: 'red' }} className={this.state.flagPin ? 'dispBlock' : 'dispNone'}>required</FormHelperText>
                            </FormControl><br /><br />

                            <Button variant='contained' color='secondary' onClick={this.handleSave}>Save Address</Button>
                          </div>
                          : ""}

                      </div>
                      <Typography> {this.state.flag === false ? this.getStepContent(this.state.index, this.props.baseUrl) : ""}</Typography>
                      <div>
                        <div>
                          <Button
                            disabled={this.state.activeStep === 0}
                            onClick={this.handleBack}
                          >
                            Back
                  </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleNext}
                          >
                            {this.state.activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                          </Button>
                        </div>
                      </div>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {this.state.activeStepFlag && (
                <Paper square elevation={0}>
                  <Typography>View the summary and place your order now!</Typography>
                  <Button onClick={this.handleReset}>
                    Change
          </Button>
                </Paper>
              )}
            </div>
            {this.state.activeStepFlag === true ?
              <div className='summary' >
                <Card>
                  <CardContent>
                    <Typography variant="h2" component="h2">
                      Summary
                </Typography>
                    <Typography variant="h5" component="h2"><br /><br />
                      {this.props.location.restaurant_name}
                    </Typography>
                    {this.props.location.itemList.map((item) => (
                      <div className='mapclass' key={i++}>
                        <div className='fontclass'><FontAwesomeIcon icon={faStopCircle} className={item.item_type === 'NON_VEG' ? "non-veg" : "veg"} />{item.item_name}</div>
                        <div className='quantity' >{item.quantity}</div>
                        <div className='awesomeclass'> <FontAwesomeIcon icon={faRupeeSign} />{parseFloat(Math.round(item.price)).toFixed(2)}</div>

                      </div>
                    ))}
                    <FormControl>
                      <div className='couponclass'>
                        <div >
                          <InputLabel htmlFor='apply'>Coupon Code</InputLabel>
                          <Input id='apply' onChange={this.couponHandler} />
                        </div>
                        <div>
                          <Button variant='contained' color='default' className='applybtn' onClick={this.discountHandler}>APPLY</Button>
                        </div>
                      </div>
                    </FormControl>
                    <Divider />
                    <div className='subtotal' >
                      <div>
                        Sub Total
                  </div>
                      <div className='farupee'>
                        <FontAwesomeIcon icon={faRupeeSign} />
                        {parseFloat(Math.round(this.props.location.totalAmount)).toFixed(2)}
                      </div>

                    </div>

                    <div className='discount' >
                      <div >
                        Discount
                  </div>
                      <div className='farupee'>
                        <FontAwesomeIcon icon={faRupeeSign} />

                        {discount = this.state.percentDiscount != "" ? parseFloat(Math.round(this.props.location.totalAmount * this.state.percentDiscount / 100)).toFixed(2) : 0.00}
                      </div>

                    </div>
                    <Divider />
                    <div className='netamount' >
                      <div>
                        <Typography>
                          Net Amount
                    </Typography>
                      </div>
                      <div className='farupee'>
                        <Typography>
                          <FontAwesomeIcon icon={faRupeeSign} />
                          {parseFloat(Math.round(this.props.location.totalAmount - discount)).toFixed(2)}
                        </Typography>

                      </div>

                    </div>


                    <Button variant="contained" color="primary" style={{ width: '100%' }} onClick={this.placeOrderHandler}>Place Order</Button>
                  </CardContent>
                </Card>
              </div> : ""
            }
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={this.state.showMessage}
              onClose={this.handleClose}
              autoHideDuration={2000}
              ContentProps={{
                'aria-describedby': 'message-id'
              }}
              message={<span id="message-id"> {this.state.successMessage}</span>}
              action={[
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  onClick={this.handleClose}
                >
                  <CloseIcon />
                </IconButton>
              ]}
            />
          </div>
        </div >

    )

  }
}
export default Checkout;