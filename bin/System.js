
System = 
  {
		_cycle: null,
		
		_startCycle: function()
		  {
			  this._cycle = setInterval("System.Queue.walk()",1);
			},
			
		_stopCycle: function()
		  {
			  clearInterval(this._cycle);
			},

		_initialize: function()
		  {
				// start the cycle
				this._startCycle();
				
				// set the document monitor
				document.onmousemove = System.Document._monitor;
			},
			
	  attach: function()
		/* 
		 * Interface method shared by all subclasses.  
		 * Used to attach an object to the queue.
		 * Ex. System.Behaviours.attach("elastic",args);
		 */
		  {
			  try
				  {
						// create an instance of object
						var inst = eval("new this." + arguments[0]);
			
            // what will be the argument object passed to object
						var args = new Array(); 
						
						// now add in any remaining argument values (all properties
						// of 'arguments' >= [1] since [0] == method name 
						for(a=1; a < arguments.length; a++)
						  {
							  args[a-1] = arguments[a];
							}
							
						// call the instance constructor
						eval("inst." + arguments[0] + "(args)");
						
						// add it to the Queue
						System.Queue.push(inst);
					}
				catch(e)
				  {
					  System.handleException(e,arguments);
					}
			},
			
		register: function(scr)
		  {
		    try
				  {
					  // set prototype of new object to System
					  eval(scr + ".prototype = System");
								
           	// add new object to System collection
				    eval("this." + scr + " = new " + scr + "()");
								
				  	// try to call constructor, if any
						try
						  {
							  eval("this." + scr + "." + scr + "()");
							} catch(e) {;}
								
						/* Some System function are private, and are indicated by
						 * a leading underscore ("_").  To avoid any accidental
						 * collisions with extended instances calling private methods,
						 * override private methods by assigning null function to extended instance.
						 */
						for(p in System)
						  {
							  if(p.charAt(0) == "_")
								  {
							      eval("this." + scr + "." + p + " = new Function()");
									}
							}
					}
				catch(e)
				  {
					  this.handleException(e,arguments);
					}
			},
			
		handleException: function(e,ar)
		  {
			  var cler = (ar.caller) ? ar.caller.callee : 'n/a';
				var clee = ar.callee || 'n/a';
				
			  var err = '>> ' + e + '\n';
				
			  for(p in e)
				  {
					  err += '>> ' + p + ': ' + eval('e.'+p) + '\n';
					}
			  alert('Callee ->\n' + clee + '\n\nCaller ->\n' + cler + '\n\nInfo -> '+err);
			},
		
		Document: 
		/*
		 * Interface to document and event data
		 *
		 */
		  {
			  // private event data storage, exposed to document.methods
			  _eventInfo:
		      {
			      element: new Object(),
			      xPos: null,
				    yPos: null
			    },

		    // mousemove handler, bound in _initialize()
		    _monitor: function(e)
		      {
			      var ns = (e);
				    var ev = (ns) ? e : window.event;
						// note that this function executes in the event scope, so
						// we need to build a direct ref to System
						var eInf = System.Document._eventInfo;
				    eInf.element = (ns) ? ev.target : ev.srcElement;
				    eInf.xPos = (ns) ? ev.pageX : ev.clientX;
				    eInf.yPos = (ns) ? ev.pageY : ev.clientY;
			    },				
					
		    cursorX: function()
		      {
			      return(System.Document._eventInfo.xPos);
			    },
						
 		    cursorY: function()
		      {
			      return(System.Document._eventInfo.yPos);
			    },
			
		    currentElement: function()
		      {
			      return(System.Document._eventInfo.element);
			    }
		  },
			
		Queue:
		  {
			  _queue: new Array(),
				
			  push: function(ob)
		      {
			      var sOb = ob || new Object();
				    sOb.main = sOb.main || new Function();
				
				    this._queue.push(sOb);
			    },
					
				kill: function(ref)
				  {
					  for(q=0; q<this._queue.length; q++)
						  {
							  if(this._queue[q] == ref)
								  {
									  this._queue.splice(q,1);
										return(true);
									}
							}
						return(false);
					},
				
		    walk: function()
		      {
			      var instance = false;
				
				    // because the queue may be appended to during this routine, the terminal
				    // instruction of the start set is needed to flag termination of the run
				    var terminal = this._queue[this._queue.length-1];
				
			      while(instance = this._queue.shift())
				      {
					      try
						      {
						        // execute main routine of object and
                    // reintroduce to queue if main() returns true
      					    instance.main() && this.push(instance);
									}
						    catch(e)
						      {
									  // note that if an error occurs in instance.main() the instance
										// is removed from the queue by force: ie. it will never get pushed
							      System.handleException(e,arguments);
							    }
						    // die if we've reached the end of the ORIGINAL queue
						    if(instance == terminal) 
						      { 
							      break; 
							    }
					    }
			    }
			},
				
    XMLHTTP: 
		/*
		 * Interface to file loading functions 
		 * Handles SOAP, .xml, and any accessible HTTP file
		 *
		 */
      {
		    loadHTTP: function(method,file,callback,SOAP)
		      {
			      /*
				     * Because data stream is loaded asynchronously, add a monitor to the queue,
				     * and let that object carry until its stream is completed.
				     *
				     */
				 
				    try
				      {
					      var ob = new this._handler();
				        ob.httpHandle.open(method,file,true);
                ob.httpHandle.send(SOAP || null);
							
				        var monitor = 
                  {
							      ref: ob.httpHandle,
						        callback: callback,
					          main: function()
						          {
 						            if(this.ref.readyState == 4)
					                {
                            this.callback(this.ref.responseText);
												    return(false);
									        }
										    else
										      {
											      return(true);
											    }
									    }
							    };
							
						    System.Queue.push(monitor);
					    }
				    catch(e)
				      {
					      System.handleException(e,arguments);
					    }
			    },

		    loadXML: function(file,callback)
		      {
			      /*
				     * Because data stream is loaded asynchronously, add a monitor to the queue,
				     * and let that object carry until its stream is completed.
				     *
				     */
				
				    try
				      {
					      var ob = new this._handler();
					      if(window.XMLHttpRequest)
				          { 
                    ob.xmlHandle.open("GET",file,true);
                    ob.xmlHandle.send(null);
					        }
				        else
				          {
  		              ob.xmlHandle.async = false;
                    ob.xmlHandle.load(file);
					        }
						
				        var monitor = 
                  {
						    	  ref: ob.xmlHandle,
						        callback: callback,
					          main: function()
						          {
 						            if(this.ref.readyState == 4)
					                {
					                  var result = (window.XMLHttpRequest) 
											    	             ? this.ref.responseXML 
											    							 : this.ref.documentElement;
                            this.callback(result);
											    	return(false);
									        }
									    	else
								    		  {
								    			  return(true);
								    			}
								    	}
							    };
							
						    System.Queue.push(monitor);
					    }
				    catch(e)
				      {
					      System.handleException(e,arguments);
					    }
			    },
		
        serialize: function(obj)
          {
	          try
		          {
					      // moz
			          var s = new XMLSerializer();
				        var ser = s.serializeToString(obj);
			        }
		        catch(e)
			        {
					      // ie
				        var ser = obj.xml;
			        }	
		        return(ser);
	        },	
				
				_handler: function()
				  {
		        // mozilla
            if(window.XMLHttpRequest) 
		          {
			          this.httpHandle = new XMLHttpRequest();
				        this.xmlHandle = new XMLHttpRequest();
			        }
		        else
		          {
	              // create the Microsoft handle
                var prefixes = ["MSXML4","MSXML3","MSXML2","MSXML","Microsoft"];
                for (var i = 0; i < prefixes.length; i++) 
		              {
                    try 
				              {
                        http = new ActiveXObject(prefixes[i] + ".XmlHttp");
                        xml = new ActiveXObject(prefixes[i] + ".XmlDom");
                        this.httpHandle = http;
					              this.xmlHandle = xml;
								    		break;
							        }
                    catch(ex) {;}
									}
              }
          }
	    }
  };

