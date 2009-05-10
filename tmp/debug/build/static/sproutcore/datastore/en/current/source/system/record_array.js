// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple, Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/**
  @class

  A RecordArray wraps an array of storeKeys, converting them into materialized
  record objects from the owner store on demand.  A Record Array instance is
  usually returned when you call SC.Store#findAll() or SC.Store#recordsFor().
  
  @extends SC.Object
  @extends SC.Enumerable
  @extends SC.Array
  @since SproutCore 1.0
*/

SC.RecordArray = SC.Object.extend(SC.Enumerable, SC.Array,
  /** @scope SC.RecordArray.prototype */ {
    
  /**
    The store that owns this record array.  All record arrays must have a 
    store to function properly.
  
    @property {SC.Store}
  */
  store: null,

  /**
    SC.Array object that will provide the store keys for the array.  The 
    record array will register itself as an observer for this array.
    
    @property {SC.Array}
  */
  storeKeys: null,
  
  /**
    SC.Query object that is set if record array is based on a query.
    Whenever the store keys content change, the SC.Query will be
    reapplied so that only matching storeKeys are set on the record
    array.
    
    @property {SC.Query}
  */
  queryKey: null,

  // ..........................................................
  // ARRAY PRIMITIVES
  // 

  /**
    Returned length is a pass-through to the storeKeys array.
  */
  length: function() {
    var storeKeys = this.get('storeKeys');
    return storeKeys ? storeKeys.get('length') : 0;
  }.property('storeKeys').cacheable(),

  /**
    Looks up the store key in the store keys array and materializes a
    records.
    
    @param {Number} idx index of the object
    @return {SC.Record} materialized record
  */
  objectAt: function(idx) {
    var recs      = this._records, 
        storeKeys = this.get('storeKeys'),
        store     = this.get('store'),
        storeKey, ret ;
    
    if (!storeKeys || !store) return undefined; // nothing to do
    if (recs && (ret=recs[idx])) return ret ; // cached
    
    // not in cache, materialize
    if (!recs) this._records = recs = [] ; // create cache
    storeKey = storeKeys.objectAt(idx);
    if (storeKey) {
      
      // if record is not loaded already, then ask the data source to 
      // retrieve it
      if (store.readStatus(storeKey) === SC.Record.EMPTY) {
        store.retrieveRecord(null, null, storeKey);
      }
      recs[idx] = ret = store.materializeRecord(storeKey);
    }
    return ret ;
  },
  
  /**
    Pass through to the underlying array.  The passed in objects must be
    records, which can be converted to storeKeys.
    
    @param {Number} idx start index
    @param {Number} amt end index
    @param {SC.RecordArray} recs to replace with records
    @return {SC.RecordArray} 'this' after replace
  */
  replace: function(idx, amt, recs) {
    var storeKeys = this.get('storeKeys'), 
        len       = recs ? (recs.get ? recs.get('length') : recs.length) : 0,
        i, keys;
        
    if (!storeKeys) throw "storeKeys required";
    
    // map to store keys
    keys = [] ;
    for(i=0;i<len;i++) keys[i] = recs.objectAt(i).get('storeKey');
    
    // pass along - if allowed, this should trigger the content observer 
    storeKeys.replace(idx, amt, keys);
    return this; 
  },
  
  /**
    Apply the SC.Query again. This is invoked when new records are loaded
    or changed in the store (or directly on the array with .replace() ) and 
    and when we need to refresh all SC.Query 'based' record arrays accordingly.
    
    @param {Array} storeKeys to evaluate against the query
    @param {Boolean} notify to send length notifyPropertyChange()
  */
  applyQuery: function(notify) {
    var newStoreKeys = SC.Query.storeKeysForQuery(this.get('queryKey'), this.get('store'));
    this.storeKeys = newStoreKeys.addObserver('[]', this, this._storeKeysContentDidChange);
    if(notify) this.notifyPropertyChange('length');
  },
  
  // ..........................................................
  // INTERNAL SUPPORT
  // 
  
  /** @private 
    Invoked whenever the storeKeys array changes.  Observes changes.
  */
  _storeKeysDidChange: function() {
    
    var storeKeys = this.get('storeKeys');
    
    var prev = this._prevStoreKeys, f = this._storeKeysContentDidChange;
    
    if (storeKeys === prev) return this; // nothing to do
    
    if (prev) {
      prev.removeObserver('[]', this, f);
    }

    this._prevStoreKeys = storeKeys;
    
    if (storeKeys) {
      storeKeys.addObserver('[]', this, f);
    }
    
    var rev = (storeKeys) ? storeKeys.propertyRevision : -1 ;
    this._storeKeysContentDidChange(storeKeys, '[]', storeKeys, rev);
    
  }.observes('storeKeys'),
  
  /** @private
    Invoked whenever the content of the storeKeys array changes.  This will
    dump any cached record lookup and then notify that the enumerable content
    has changed.
  */
  _storeKeysContentDidChange: function(target, key, value, rev) {
    this._records = null ; // clear cache
    
    // if this record array is based on a queryKey reapply the
    // the query before setting the storeKeys to ensure it always conforms
    if(SC.instanceOf(this.queryKey, SC.Query)) {
      this.applyQuery();
    }
    
    this.beginPropertyChanges()
      .notifyPropertyChange('length')
      .enumerableContentDidChange()
    .endPropertyChanges();
  },
  
  init: function() {
    arguments.callee.base.apply(this,arguments);
    this._storeKeysDidChange();
  }
  
  
});

