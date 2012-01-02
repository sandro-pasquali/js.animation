/*
TERMS OF USE - EASING EQUATIONS

Open source under the BSD License. 

Copyright © 2001 Robert Penner
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

function Behaviours()
  {
    this.elastic = function()
		  {
			  this.elastic = function(argOb)
				  {
  		      try
				      {
			          this.elementRef = argOb[0];
						    this.elementStyle = this.elementRef.style;
								
								this.condition = argOb[1] 
								|| function() 
									   { 
										   return(true)
										 }
										 
								this.tension = (argOb[2]) ? (argOb[2] < 1) 
								                            ? argOb[2] 
																						: .04
																					: .04;
								this.currentX = 0;
								this.currentY = 0;
                this.ddx=0;
                this.ddy=0;
                this.PX=0;
                this.PY=0;

						    // determine target x,y
						    switch(typeof(argOb[3]))
								  {
									  case 'object':
										  this.master = argOb[3].style;

										  this.targetX = function()
											  {
												  return(parseInt(this.master.left));
												}
										  this.targetY = function()
											  {
												  return(parseInt(this.master.top));
												}
										break;
												
									  case 'string':
										  this.targetX = function()
											  {
												  return(System.Document.cursorX());
												}
											this.targetY = function()
											  {
												  return(System.Document.cursorY());
												}
										break;
										
									  case 'number':
										  this.tX = argOb[3];
											this.tY = argOb[4];
										  this.targetX = function()
											  {
												  return(this.tX);
												}
											this.targetY = function()
											  {
												  return(this.tY);
												}
										break;
										
										default:
										break;
									}
							}
				    catch(e)
				      {
							  System.handleException(e,arguments);
					    }
          }
					
				this.main = function()
				  {
      	    this.elementStyle.left = this.currentX =
              Math.round(this.PX+=(this.ddx+=((this.targetX()-this.PX-this.ddx))*this.tension));
	          this.elementStyle.top = this.currentY = 
              Math.round(this.PY+=(this.ddy+=((this.targetY()-this.PY-this.ddy))*this.tension));

						return(this.condition());
					}		
			}
			
		this.moveTo = function()
		  {
			  this.moveTo = function(argOb)
				  {
					  try
						  {
					      this.elementRef = argOb[0];
						    this.elementStyle = argOb[0].style;
								this.condition = argOb[1] 
								|| function() 
								     { 
										   if(this.time>this.duration) { return false; }
											 return true;
										 }
										 
								this.time = 0;
								this.type = argOb[2];
								this.xStart = parseInt(this.elementStyle.left);
								this.yStart = parseInt(this.elementStyle.top);
								this.xFinish = argOb[3];
								this.yFinish = argOb[4];
								this.duration = argOb[5];
                this.xChange = this.xFinish - this.xStart;
								this.yChange = this.yFinish - this.yStart;

								this.currentX = 0;
								this.currentY = 0;
								
								this.setEasing(this.type);
							}
						catch(e)
						  {
							  System.handleException(e,arguments);
							} 
					}
					
        this.setEasing = function(ease)
				  {
					  this.type = ease;
					  switch(this.type.toLowerCase())
						  {
							  /* 
								 * Cubic easing
								 */
								
							  case "incubic":
								  this.step = function()
									  {
								      this.currentX = this.xChange*Math.pow(this.time/this.duration,3)+this.xStart;
									    this.currentY = this.yChange*Math.pow(this.time/this.duration,3)+this.yStart;
									  }
			            break;
									
							  case "outcubic":
								  this.step = function()
									  {
								      this.currentX = this.xChange*(Math.pow(this.time/this.duration-1,3)+1)+this.xStart;
									    this.currentY = this.yChange*(Math.pow(this.time/this.duration-1,3)+1)+this.yStart;
									  }
			            break;
									
							  case "inoutcubic":
								  this.step = function()
									  {
										  time = this.time;
								      this.currentX = ((time/=this.duration/2)<1)
											                ? this.xChange/2 * Math.pow(time,3) + this.xStart
																			: this.xChange/2 * (Math.pow(time-2,3)+2) + this.xStart;
											
											time = this.time;
								      this.currentY = ((time/=this.duration/2)<1)
											                ? this.yChange/2 * Math.pow(time,3) + this.yStart
																			: this.yChange/2 * (Math.pow(time-2,3)+2) + this.yStart;
									  }
			            break;
									
								/*
								 * Quadratic easing
								 */
								
							  case "inquadratic":
								  this.step = function()
									  {
										  time = this.time;
								      this.currentX = this.xChange*(time/=this.duration)*time + this.xStart;
										  time = this.time;
								      this.currentY = this.yChange*(time/=this.duration)*time + this.yStart;
									  }
			            break;
									
							  case "outquadratic":
								  this.step = function()
									  {
										  time = this.time;
								      this.currentX = -this.xChange*(time/=this.duration)*(time-2) + this.xStart;
											time = this.time;
								      this.currentY = -this.yChange*(time/=this.duration)*(time-2) + this.yStart;
									  }
			            break;
									
							  case "inoutquadratic":
								  this.step = function()
									  {
										  time = this.time;
								      this.currentX = ((time/=this.duration/2)<1)
											                ? this.xChange/2*time*time + this.xStart
																			: -this.xChange/2*((--time)*(time-2)-1) + this.xStart;
											
										  time = this.time;
								      this.currentY = ((time/=this.duration/2)<1)
											                ? this.yChange/2*time*time + this.yStart
																			: -this.yChange/2*((--time)*(time-2)-1) + this.yStart;
									  }
			            break;
									
								/*
								 * Circular easing
								 */
								
							  case "incircular":
								  this.step = function()
									  {
										  time = this.time;
								      this.currentX = this.xChange*(1-Math.sqrt(1-(time/=this.duration)*time)) + this.xStart;
										  time = this.time;
								      this.currentY = this.yChange*(1-Math.sqrt(1-(time/=this.duration)*time)) + this.yStart;
									  }
			            break;
									
							  case "outcircular":
								  this.step = function()
									  {
										  time = this.time;
								      this.currentX = this.xChange*Math.sqrt(1-(time=time/this.duration-1)*time) + this.xStart;
											time = this.time;
								      this.currentY = this.yChange*Math.sqrt(1-(time=time/this.duration-1)*time) + this.yStart;
									  }
			            break;
									
							  case "inoutcircular":
								  this.step = function()
									  {
										  time = this.time;
								      this.currentX = ((time/=this.duration/2)<1)
											                ? this.xChange/2*(1-Math.sqrt(1-time*time)) + this.xStart
																			: this.xChange/2*(Math.sqrt(1-(time-=2)*time)+1) + this.xStart;
											
										  time = this.time;
								      this.currentY = ((time/=this.duration/2)<1)
											                ? this.yChange/2*(1-Math.sqrt(1-time*time)) + this.yStart
																			: this.yChange/2*(Math.sqrt(1-(time-=2)*time)+1) + this.yStart;
									  }
			            break;
										
									default:
									break;
						   }					
					}
					
				this.main = function()
				  {
            this.step();
						this.elementStyle.left = Math.round(this.currentX);
						this.elementStyle.top = Math.round(this.currentY);
						++this.time;
						return(this.condition());
					}
			}
	}