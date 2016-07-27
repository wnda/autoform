;(function()
{
  if( 'querySelectorAll' in this.document )
  {
    var settings;
    
    window.formalhaut = 
    {
      prepForm : function(e)
      {
        e.preventDefault();
        var form   = ( e.target || this ), // get the form from the submit event
            query  = 
              (function()
              { // wrap the query string in a closure
                var inputs = form.querySelectorAll( ( settings.selectors ) ), // get the selectors from the init object
                    i      = inputs.length,
                    j      = 0,
                    str    = []; // initialise query string
                    
                for( ; i > j; j++ )
                {
                  var q = ( // need the name attributes and entered values
                            !!inputs[j].getAttribute( 'name' ) && !!inputs[j].value ? 
                              inputs[j].getAttribute( 'name' ) + '=' + inputs[j].value : 
                                !1
                          );
                  !!q && str.push( q ); // only push query string parts if they exist
                }
                
                if( !str.length ) // if empty array, stop here
                {
                  console.error( 'Error in constructing query: no named input' );
                  return false;
                }
                else
                {
                  return str.join( '&' ); // join name-input pairs with ampersand to form-urlencoded parameters 
                }
              }());
              
        !!query && formalhaut.sendForm( query, form ); // pass the query and origin form to send function
      },
      
      sendForm : function(query, form)
      {
        if( !query || !query.length || !form ) // don't do anything if we don't have the data we need
        {
          console.warn( 'No query/form/action' );
          return false;
        }
        
        var mthd = form.method.toUpperCase()        || 'GET', // default to GET
            actn = ( !!query ? ( mthd === 'POST'    ?  form.action : encodeURI( form.action + '?' + query ) ) : !1 ) || !1,
            rqbd = ( mthd === 'POST' && !!query     ?  query : null ), // GET requests cannot have a body
            rqmd = form.getAttribute( 'data-cors' ) || 'cors', 
            enct = form.enctype                     || form.getAttribute( 'enctype' )        || !1, // try multiple means to get data
            chst = form.acceptCharset               || form.getAttribute( 'accept-charset' ) || !1, // try multiple means to get data
            ct   = (
                    !!enct && !!chst ?
                      enct + '; charset=' + chst :
                      (
                      !!enct ? 
                        enct + '; charset=utf-8' : // default to enforcing utf-8
                          'application/x-www-form-urlencoded; charset=utf-8'
                      )
                    );
                    
        if( !!window.fetch ) // fetch barely supported yet
        {
          fetch(actn,
          {
            method  : mthd, // GET   || POST
            body    : rqbd, // query || null
            mode    : rqmd, // cors  || no-cors
            headers : 
            {
              'Content-Type'   : ct
            }
          })
          .then(function(resp)
          {
            resp.status >= 200 && resp.status < 300 ? // consider revising to resp.ok
              // do something or execute configurable function to be specified in init() object
              console.info( resp.status ) :
                console.error( 'Error: ' + (resp.message || 'No data available' ) );
          })
          .catch(function(resp)
          {
            console.error( 'Error: ' + ( resp.message || 'No data available' ) );
          });
        }
        else
        {
          var xhr = new XMLHttpRequest();
          xhr.open( mthd, actn, true );
          xhr.setRequestHeader( 'Content-type', ct );
          // consider setting credentials header based on data-with-credentials attribute
          xhr.onreadystatechange = function()
          {
            this.readyState === 4 ? 
              (
                ( this.status >= 200 && this.status < 300 ) ? // don't revise to onload, for the sake of backwards compatibility
                  // do something or execute configurable function to be specified in init() object
                  console.info( xhr.responseText ) :
                    console.error( 'Error: ' + ( xhr.status || 'No data available' ) )
              ) : 
                  console.error( 'Error: ' + ( xhr.status || 'No data available' ) );
          };
          xhr.send( rqbd ); // no body for GET requests, as the query is added to the URL as a query string behind '?'
        }
      },
      
      init : function(config)
      {
        settings = {
          selectors : config && config.selectors ? config.selectors : 'input,textarea' // consider filtering out input[type=submit]
        };
        
        var forms = document.forms || document.getElementsByTagName('form'),
            len   = forms.length,
            z     = 0;
            
        for( ; len > z; z++ )
        {
          var eListener = // use ternaries as more concise if-elseif-else hell
                          ( 'addEventListener' in this ) ?
                            'addEventListener' :
                              ( 
                                ( 'attachEvent' in this ) ? 
                                  'attachEvent' :
                                    null 
                              ),
              ev        = ( 'addEventListener' in this ) ?
                              'submit' :
                                'onsubmit';
                                
          if( !!eListener )
          { // thing[thing] corresponds to thing.thing
            forms[z][eListener]( ev, formalhaut.prepForm );
          }
          else
          {
            forms[z][ev] = formalhaut.prepForm;
          }
        }
      }
    };
  }
  else
  { // querySelectorAll (IE8) enjoys less browser support than XMLHttpRequest (IE7), so it's a logical means to condition support of this lib
    console.warn( 'Your browser does not seem to support formalhaut.js' );
  }
})();
// call init() to apply to all forms
// formalhaut.init();
