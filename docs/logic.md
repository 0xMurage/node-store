user navigate to site,
  - All products are retrieved {/products}
  - specific product can be retrieved {/products/:code}
  
User add items into cart, if authenticated (token is valid),
  - create a cart (if code is empty) {/carts}
  - sync with local copy
  - If items are added/deleted, update the server copy by sending the ids to {/carts/:code}

User checks out the cart
  - confirm the order (before creation)
  - if user is not authenticated, allow them to either:
     - login (then retrieve their address {/addresses})
     - sign up (they provide personal info, address,login info) {/customers}
     - checkout as guest (they provide personal info & address) {/customers}
     
     "N.B" all above processes returns a JWT access token with user info (name,code,id). 
     Subsequent request should contain the token in header (bearer)
     
show their address as default shipping address
  - if they update, make request to create new one (POST) {/addresses/shipping}

On confirmation, create an order with the cart items & shipping address {/orders}

On success, take them  to select payment method & proceed with payment
  - retrieve possible methods through a get request {/payment/methods}

send the details (payment method ID ) to {/orders/:code/payments}
  - this will initiate payment request
  - On success take them to confirmation page (in case payment method requires user confirmation)
  
Periodically check if the order has been paid {/orders/:code/statuses}
 - If paid, take the to print the receipt
 - If payment cancelled, you can ask if they need to try pay again
    - if yes, take them to payment method selection page
    - else cancel and take them to order cancelled page
