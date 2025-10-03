/* get two parties
    * 1. buyer
    * 2. seller (owner.shop)
    * get stripe accounts for both parties
    * 1. buyer.stripeCustomerId
    * 2. seller.stripeAccountId
    * 
    * create payment intent with application fee and transfer to seller
    * 
    * return client secret to frontend
*/