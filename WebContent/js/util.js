/**
* A Singleton class which is automatically created at runtime.  Access is with Util.method_name.  Responsible for...
* - Simple Messaging System - Pub/Sub (Publish . Suscribe)
* - Logging and debug methods
* - Method that supports simple JS inheritance
*  
*  @module Util
*/
var Util = Util || {

// ******************************
// Tiny, Tiny Pub Sub Framework
// ******************************

	debug: false,
	
	debugMessages: [],
	
	subscribers: {},
	
	timer:null,

	getMessageFor: function(){
		var error = new Error();
		console.log("STACK TRACE: "+error.stack);
	},

/**
 * Private method that returns true if the arguments match a known subscriber.  DO NOT use this method.
 * 
 * @private
 * @param {String} theMessageId - In the form of "MSG_xxxxx".    Defined in constants.js
 * @param {Object} theContext - If your callback function belongs to an object, pass it here.  Otherwise, pass undefined.
 * @param {Function} theCallback - The callback method
 */
	doesSubscriptionExistFor: function(theMessageId,theContext,theCallback){

		var subscriber = Util.getSubscriptionFor(theMessageId,theContext,theCallback);
	
		if(subscriber !== null)	
			return true;
		else
			return false;
	},
	
/**
 * Private method used to return index for subscriber storage array.  DO NOT use this method.
 * 
 * @private
 * @param {String} theMessageId - In the form of "MSG_xxxxx".  Defined in constants.js
 * @param {Object} theContext - If your callback function belongs to an object, pass it here.  Otherwise, pass undefined.
 * @param {Function} theCallback - The callback method
 */
	getSubscriptionFor: function(theMessageId,theContext,theCallback){
		var subscribers = Util.subscribers[theMessageId];
			
		// Make sure we do not duplicate subscritpions to messages
		for(var i=0;i<subscribers.length;i++){
			var subscriber = subscribers[i];
			var context    = subscriber.context;
			var callback   = subscriber.callback;
			
			if(context === theContext && callback === theCallback)
				return i;
		}
		return null;
	},
	
/**
 * Method used to register a subscriber to a message.  The argument theContext is used to register a callack method associated with a class.  If the callback is in the global namespace, theContext should be passed as undefined.
 * 
 * @param {String} theMessageId - In the form of "MSG_xxxxx".  Defined in constants.js
 * @param {Object} theContext - If your callback function belongs to an object, pass it here.  Otherwise, pass undefined.
 * @param {Function} theCallback - The callback method
 */
	subscribeWithContext: function(theMessageId,theContext,theCallback){
	
		var callbackDetails = {context:theContext,callback:theCallback};
		
		if(Util.subscribers[theMessageId] == undefined)
			Util.subscribers[theMessageId] = [];
			
		if(! Util.doesSubscriptionExistFor(theMessageId,theContext,theCallback))
			Util.subscribers[theMessageId].push(callbackDetails);
	},
	
/**
 * Method used to un-register a subscriber to a message.  If you have created a transiaent subscriber, it is essential you cleanup with this method before being destroyed so messagesa are not dispatched to a subscriber who no longer exists.  The argument theContext is used to register a callack method associated with a class.  If the callback is in the global namespace, theContext should be passed as undefined.
 * 
 * @param {String} theMessageId - In the form of "MSG_xxxxx".  Defined in constants.js
 * @param {Object} theContext - If your callback function belongs to an object, pass it here.  Otherwise, pass undefined.
 * @param {Function} theCallback - The callback method
 */
	unsubscribeWithContext: function(theMessageId,theContext,theCallback){
		var subscriberIdx = Util.getSubscriptionFor(theMessageId,theContext,theCallback);
		
		// Remove subscription
		Util.subscribers[theMessageId].splice(subscriberIdx,1);
	},
	
/**
 * Method used send a message.  The argument anObject contains the message payload which differs dependant on the message.  This message payload contains information about the event so the subscriber has all the pertinant info and does not need to make additional calls to get anything else.
 * 
 * @param {String} messageId - In the form of "MSG_xxxxx".  Defined in constants.js
 * @param {Object} anObject - Message specific object
 */
	publish: function(messageId,anObject){
		var subscribers = Util.subscribers[messageId];
		
		if(subscribers == undefined){
            if(this.debug === true){
    			Util.log("WARN","util.js","publish()","There are no subscribers for message type:"+messageId);
    			var theError = new Error();
    			var thePubObject = "Sorry, cannot determine publishing object (IE11 only)";
    			if(theError.stack !== undefined)
    				thePubObject = theError.stack.split("\n")[2];
    			
    			Util.log("INFO", "util.js","publish()", "Publishing Object: "+thePubObject);
			}	
			return;
		}
				
		// Messages will be delivered based on subscrition order.
		// These calls are synchronous
		for(var i=0;i<subscribers.length;i++){
			var callbackDetails = subscribers[i];
			var context  = callbackDetails.context;
			var callback = callbackDetails.callback;
			
			// We need to make sure that an error in a callback 
			// does not disrupt callback for other clients
			// Therefore, the try catch block here
			
			try{
				if(context !== null)
					context[callback](anObject);
				else
					callback(anObject);
			} catch(err) {
				var objectName = "object";
				try{
					// We have coded a function on h5e object to get the object name
					// This is helpful in debugging
					objectName = context.objectName();
				} catch(err) {
					// Nothing to do
				}
				Util.log("ERROR","util.js","publish()","Error during callback to "+objectName+"."+callback+"() - "+err);
			}
		}
	},

/**
 * This method sets up a timer to broadcast a message on a given interval.  Only a single timed message is currently supported
 * 
 * @param {String} messageId - In the form of "MSG_xxxxx".  Defined in constants.js
 * @param {Number} intervalSec - Seconds
 */
	publishOnIntervalFor: function(messageId,intervalSec){
		Util.timer = setInterval(
		   function(){
			   Util.publish(messageId,"Your wakeup call.  Interval (sec) : "+ intervalSec); },intervalSec);
			
	},
	
/**
 * This method clears the timer to broadcast a message on a given interval.
 */
	unpublishOnInterval: function(){
		clearInterval(Util.timer);
	},

// ****************
// Logging & Debug
// ****************

/**
 * Used as a central point for logging H5e Messages.  Log messages are sent to the JS console (browser) and messages that are ERROR level are sent to alert boxes.
 * There is a mechanism to store debug messgaes in memory so the System App can have the ability to display all message without resorting to the JS console.
 * @param {String} theLevel - INFO|WARN|ERROR
 * @param {String} thsSource - Source file where logging is taking place
 * @param {String} theFunction - Method or function in which logging is taking place
 * @param {String} theMessage - Log message
 */

log : function(theLevel, theSource, theFunction, theMessage){
	var message = theLevel + " : " + theSource + " - " + theFunction + " - " + theMessage;
	console.log(message);
	
	if(theLevel === "ERROR")
		alert(message);
	
	this.debugMessages.push(message);
},

/**
 * Return all collected log messages
 * 
 * @method getDebugMessages
 */
getDebugMessages : function(){
	return this.debugMessages;
},

/**
 * Clear all the log messages collected since engine was initialized
 * 
 * @method clearDebugMessages
 */
clearDebugMessages : function(){
	this.debugMessages = [];
},

// ******************************
// Inheritance Utility Function
// ******************************

/**
 * Utility function used to implement Javascript inheritance
 * @function inheritsFrom
 */
inheritsFrom : function(child,parent){
    child.prototype = Object.create(parent.prototype);
}

};  // End Util
