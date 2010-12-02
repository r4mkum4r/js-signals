	
	/**
	 * Object that represents a binding between a Signal and a listener function.
	 * <br />- Constructor shouldn't be called by regular user, no point on creating a new binding without a Signal.
	 * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
	 * @author Miller Medeiros
	 * @constructor
	 * @param {Function} listener	Handler function binded to the signal.
	 * @param {boolean} isOnce	If binding should be executed just once.
	 * @param {Object} listenerScope	Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	 * @param {signals.Signal} signal	Reference to Signal object that listener is currently binded to.
	 */
	signals.SignalBinding = function SignalBinding(listener, isOnce, listenerScope, signal){
		
		/**
		 * Handler function binded to the signal.
		 * @type Function
		 */
		this.listener = listener;
		
		/**
		 * If binding should be executed just once.
		 * @type boolean
		 * @private
		 */
		this._isOnce = isOnce;
		
		/**
		 * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
		 * @type Object
		 */
		this.listenerScope = listenerScope;
		
		/**
		 * Reference to Signal object that listener is currently binded to.
		 * @type signals.Signal
		 * @private
		 */
		this._signal = signal;
	};
	
	
	signals.SignalBinding.prototype = {
		
		/**
		 * @type boolean
		 * @private
		 */
		_isEnabled : true,
		
		/**
		 * Call listener passing arbitrary parameters.
		 * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p> 
		 * @param {Array} paramsArr	Array of parameters that should be passed to the listener
		 * @return {*} Value returned by the listener.
		 */
		execute : function(paramsArr){
			if(this._isEnabled){
				if(this._isOnce) this.detach();
				return this.listener.apply(this.listenerScope, paramsArr);
			}
		},
		
		/**
		 * Detach binding from signal.
		 * - alias to: mySignal.remove(myBinding.listener);
		 * @return {Function} Handler function binded to the signal.
		 */
		detach : function(){
			return this._signal.remove(this.listener);
		},
		
		/**
		 * Remove binding from signal and destroy any reference to external Objects (destroy SignalBinding object).
		 */
		dispose : function(){
			this.detach();
			//remove reference to all objects
			delete this._signal;
			delete this.listener;
			delete this.listenerScope;
		},
		
		/**
		 * Disable SignalBinding, block listener execution. Listener will only be executed after calling `enable()`.  
		 * @see signals.SignalBinding.enable()
		 */
		disable : function(){
			this._isEnabled = false;
		},
		
		/**
		 * Enable SignalBinding. Enable listener execution.
		 * @see signals.SignalBinding.disable()
		 */
		enable : function(){
			this._isEnabled = true;
		},
		
		/**
		 * @return {boolean} If SignalBinding is currently paused and won't execute listener during dispatch.
		 */
		isEnabled : function(){
			return this._isEnabled;
		},
		
		/**
		 * @return {boolean} If SignalBinding will only be executed once.
		 */
		isOnce : function(){
			return this._isOnce;
		},
		
		/**
		 * @return {string} String representation of the object.
		 */
		toString : function(){
			return '[SignalBinding listener: '+ this.listener +', isOnce: '+ this._isOnce +', isEnabled: '+ this._isEnabled +', listenerScope: '+ this.listenerScope +']';
		}
		
	};
