// ==========================================================================
// Project:   SproutCore Costello - Property Observing Library
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple, Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/**
  @namespace
  
  Support methods for the Delegate design pattern.
  
  The Delegate design pattern makes it easy to delegate a portion of your 
  application logic to another object.  This is most often used in views to 
  delegate various application-logic decisions to controllers in order to 
  avoid having to bake application-logic directly into the view itself.
  
  The methods provided by this mixin make it easier to implement this pattern
  but they are not required to support delegates.
  
  h2. The Pattern
  
  The delegate design pattern typically means that you provide a property,
  usually ending in "delegate", that can be set to another object in the 
  system.  
  
  When events occur or logic decisions need to be made that you would prefer
  to delegate, you can call methods on the delegate if it is set.  If the 
  delegate is not set, you should provide some default functionality instead.
  
  Note that typically delegates are not observable, hence it is not necessary
  to use get() to retrieve the value of the delegate.
  
*/
SC.DelegateSupport = {  
  
  /**
    Selects the delegate that implements the specified method name.  Pass one
    or more delegates.  The receiver is automatically included as a default.
    
    This can be more efficient than using invokeDelegateMethod() which has
    to marshall arguments into a delegate call.
    
    @param {String} methodName
    @param {Object...} delegate one or more delegate arguments
    @returns {Object} delegate or null
  */
  delegateFor: function(methodName) {
    var idx = 1,
        len = arguments.length,
        ret ;
        
    while(idx<len) {
      ret = arguments[idx];
      if (ret && ret[methodName]) return ret ;
      idx++;      
    }
    
    return this[methodName] ? this : null;
  },
  
  /**
    Invokes the named method on the delegate that you pass.  If no delegate
    is defined or if the delegate does not implement the method, then a 
    method of the same name on the receiver will be called instead.  
    
    You can pass any arguments you want to pass onto the delegate after the
    delegate and methodName.
    
    @param {Object} delegate a delegate object.  May be null.
    @param {String} methodName a method name
    @param {*} args (OPTIONAL) any additional arguments
    
    @returns value returned by delegate
  */
  invokeDelegateMethod: function(delegate, methodName, args) {
    args = SC.A(arguments); args = args.slice(2, args.length) ;
    if (!delegate || !delegate[methodName]) delegate = this ;
    
    var method = delegate[methodName];
    return method ? method.apply(delegate, args) : null;
  },
  
  /**
    Gets the named property from the delegate if the delegate exists and it
    defines the property.  Otherwise, gets the property from the receiver.
    
    @param {Object} delegate the delegate or null
    @param {String} key the property to get.
  */
  getDelegateProperty: function(delegate, key) {
    return (delegate && (delegate[key] !== undefined) && delegate[key]!==null) ? delegate.get(key) : this.get(key) ;
  }
  
};
