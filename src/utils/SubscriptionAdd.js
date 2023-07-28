function SubscriptionAdd(subscriptionValidity, lastValidityTime) {
    var present = Date.now();
    var lastValidity = (lastValidityTime * 1000);
    var subscriptionEndDate;
  
    if (lastValidity <= present) {
      // Add subscription validity to the present time
      subscriptionEndDate = ((present + (subscriptionValidity * 24 * 60 * 60 * 1000)));
    } else {
      // Add subscription validity to the last validity time
      subscriptionEndDate = ((lastValidityTime + (subscriptionValidity * 24 * 60 * 60 * 1000)));
    }
  
    return subscriptionEndDate
  
  }
  
  export default SubscriptionAdd;
  