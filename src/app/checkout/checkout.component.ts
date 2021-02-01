


import {AfterViewInit, Component, OnInit, NgModule} from '@angular/core';
import { PizzaService } from './../pizza/services/pizza.service';
declare var SqPaymentForm : any; //magic to allow us to access the SquarePaymentForm lib

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})


export class CheckoutComponent implements OnInit{

  constructor(
    private pizzaService : PizzaService,
  ){}
  isFormLoaded : any
  paymentForm; //this is our payment form object

  ngOnInit(){
    // Set the application ID
    var applicationId = "sandbox-sq0idb-aZ5h03luwaRATKAuRQq1YA";
    this.paymentForm = new SqPaymentForm({

    // Initialize the payment form elements
    applicationId: applicationId,
   // locationId: locationId,
    inputClass: 'sq-input',
  
    // Customize the CSS for SqPaymentForm iframe elements
   inputStyles: [{
        fontSize: '18px',
        fontFamily: 'Helvetica Neue',
        padding: '15px',
        color: '#373F4A',
        lineHeight: '24px',
        placeholderColor: '#BDBFBF'
      }],
  
  
  
    // Initialize the credit card placeholders
    cardNumber: {
      elementId: 'sq-card-number',
      placeholder: '•••• •••• •••• ••••'
    },
    cvv: {
      elementId: 'sq-cvv',
      placeholder: 'CVV'
    },
    expirationDate: {
      elementId: 'sq-expiration-date',
      placeholder: 'MM/YY'
    },
    postalCode: {
      elementId: 'sq-postal-code'
    },
  
    // SqPaymentForm callback functions
    callbacks: {
  
      /*
       * callback function: methodsSupported
       * Triggered when: the page is loaded.
       */
      methodsSupported: function (methods) {
  
        var applePayBtn = document.getElementById('sq-apple-pay');
        var applePayLabel = document.getElementById('sq-apple-pay-label');
        var masterpassBtn = document.getElementById('sq-masterpass');
        var masterpassLabel = document.getElementById('sq-masterpass-label');
  
        // Only show the button if Apple Pay for Web is enabled
        // Otherwise, display the wallet not enabled message.
        if (methods.applePay === true) {
          applePayBtn.style.display = 'inline-block';
          applePayLabel.style.display = 'none' ;
        }
        // Only show the button if Masterpass is enabled
        // Otherwise, display the wallet not enabled message.
        if (methods.masterpass === true) {
          masterpassBtn.style.display = 'inline-block';
          masterpassLabel.style.display = 'none';
        }
      },
  
      /*
       * callback function: createPaymentRequest
       * Triggered when: a digital wallet payment button is clicked.
       */
      createPaymentRequest: function () {
        // The payment request below is provided as
        // guidance. You should add code to create the object
        // programmatically.
        return {
          requestShippingAddress: true,
          currencyCode: "USD",
          countryCode: "US",
          total: {
            label: "Hakuna",
            amount: "{{REPLACE_ME}}",
            pending: false,
          },
          lineItems: [
            {
              label: "Subtotal",
              amount: "{{REPLACE_ME}}",
              pending: false,
            },
            {
              label: "Shipping",
              amount: "{{REPLACE_ME}}",
              pending: true,
            },
            {
              label: "Tax",
              amount: "{{REPLACE_ME}}",
              pending: false,
            }
          ]
        };
      },
  
      /*
       * callback function: cardNonceResponseReceived
       * Triggered when: SqPaymentForm completes a card nonce request
       */
      cardNonceResponseReceived: function (errors, nonce, cardData)  {
       
        if (errors) {
          // Log errors from nonce generation to the Javascript console
          console.log("Encountered errors:");
          errors.forEach(function(error) {
            console.log('  ' + error.message);
          });
  
          return;
        }
  
        alert('Nonce received: ' + nonce); /* FOR TESTING ONLY */
  
        // Assign the nonce value to the hidden form field
        // document.getElementById('card-nonce').value = nonce;
        //needs to be extracted from the
        (<HTMLInputElement>document.getElementById('card-nonce')).value = nonce; //casting so .value will work
        //get this value from the database when the user is logged in
        (<HTMLInputElement>document.getElementById('sq-id')).value = "CBASEC8F-Phq5_pV7UNi64_kX_4gAQ";
  
        // POST the nonce form to the payment processing page
        (<HTMLFormElement>document.getElementById('nonce-form')).submit();
  
      },
  
      /*
       * callback function: unsupportedBrowserDetected
       * Triggered when: the page loads and an unsupported browser is detected
       */
      unsupportedBrowserDetected: function() {
        /* PROVIDE FEEDBACK TO SITE VISITORS */
      },
  
      /*
       * callback function: inputEventReceived
       * Triggered when: visitors interact with SqPaymentForm iframe elements.
       */
      inputEventReceived: function(inputEvent) {
        switch (inputEvent.eventType) {
          case 'focusClassAdded':
            /* HANDLE AS DESIRED */
            break;
          case 'focusClassRemoved':
            /* HANDLE AS DESIRED */
            break;
          case 'errorClassAdded':
            /* HANDLE AS DESIRED */
            break;
          case 'errorClassRemoved':
            /* HANDLE AS DESIRED */
            break;
          case 'cardBrandChanged':
            /* HANDLE AS DESIRED */
            break;
          case 'postalCodeChanged':
            /* HANDLE AS DESIRED */
            break;
        }
      },
  
      /*
       * callback function: paymentFormLoaded
       * Triggered when: SqPaymentForm is fully loaded
       */
      paymentFormLoaded: function() {
       
        /* HANDLE AS DESIRED */
      }
    }
  });
  this.paymentForm.build();
 
}
requestCardNonce(event) {

  // Don't submit the form until SqPaymentForm returns with a nonce
  event.preventDefault();

  // Request a nonce from the SqPaymentForm object
  this.paymentForm.requestCardNonce();
  this.pizzaService.createPayment();
}
test(){
  this.pizzaService.createPayment();
}

   }