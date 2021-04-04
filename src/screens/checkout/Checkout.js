import React, { Component } from 'react';
import Header from '../../common/header/Header';
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
import { IconButton } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


function getSteps() {
  return ['Delivery', 'Payment'];
}




const steps = getSteps();

let value;

let val = 0;

let addresses = [];

let activeStep = 0;

let index = 0;

let valueRadio;
let i = 0;

class Checkout extends Component {

  constructor() {
    super()
    this.state = {
      activeStep: 0,
      value: 0,
      addresses: [{}],
      flag: false,
      payment: "",
      index: 0,
      valueRadio: ""
    }
  }


  handleNext = () => {

    let deliveryFlag = false

    let a = document.getElementsByClassName('icon')
    for (var x = 0; x < a.length; x++) {
      if (a[x].style.color === 'green') {
        deliveryFlag = true
      }
    }

    if (deliveryFlag) {
      activeStep++
      this.setState({ activeStep: activeStep, flag: false, index: 1, addresses: [{}] })
    }
  };

  handleBack = () => {
    activeStep--
    this.setState({ activeStep: activeStep, index: 0, flag: false, payment: "" })
  };



  handleReset = () => {
    this.setState({ activeStep: 0, i: 0 })
  };


  handleChange = (event, value) => {
    this.setState({ value: value, i: 0 })
  };

  componentDidMount() {
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
            that.setState({ addresses: JSON.parse(this.responseText), flag: true })
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
            that.setState({ payment: JSON.parse(this.responseText), flag: true })
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
    }
    a.style.borderStyle = "solid"
    a.style.borderColor = "red"
    a.style.boxShadow = 'brown'
    let d = document.getElementById('i' + key)
    let e = document.getElementsByClassName('icon')
    for (var x = 0; x < b.length; x++) {
      e[x].style.color = 'black'
    }

    d.style.color = 'green'




  }

  render() {
    let a = this.state.addresses
    let b = a.addresses
    return (
      < div >
        <Header />
        <div>
          <div style={{ width: '70%', height: '85%' }}>
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
                      <GridList cols={3}>
                        {

                          this.state.addresses.addresses != undefined && this.state.value === 0 ? this.state.addresses.addresses.map((address) => (

                            <GridListTile key={val} >
                              <div className='address' id={'c' + val}>
                                <span>{'' + address.flat_building_name}</span><br />
                                <span> {'' + address.locality}</span><br />
                                <span> {'' + address.city}</span><br />
                                <span> {'' + address.state.state_name}</span><br />
                                <span>{'' + address.pincode}</span><br />
                                <IconButton id={'b' + val} onClick={this.iconAddressHandler.bind(this, val)} style={{ marginLeft: '60%' }}><CheckCircleIcon className='icon' id={'i' + val++} /></IconButton>
                              </div >
                            </GridListTile>

                          )) : ""}
                      </GridList>

                      {this.state.payment != "" ? <div>
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
            {this.state.activeStep === steps.length && (
              <Paper square elevation={0}>
                <Typography>All steps completed - you&apos;re finished</Typography>
                <Button onClick={this.handleReset}>
                  Reset
          </Button>
              </Paper>
            )}
          </div>
          <div>

          </div>
        </div>
      </div >
    );
  }
}
export default Checkout;