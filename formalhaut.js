;(function(){
  if('querySelectorAll' in this.document)
  {
    window.formalhaut = {
      prepForm : function(e){
        e.preventDefault();
        var form   = (e.target || this),
            query  = 
              (function() {
                var inputs = form.querySelectorAll('input,textarea'),
                    i      = inputs.length,
                    j      = 0,
                    str    = [];
                for(;i>j;j++)
                {
                  var q = ( 
                          !!inputs[j].getAttribute('name') && !!inputs[j].value ? 
                            inputs[j].getAttribute('name') + '=' + inputs[j].value : 
                              null 
                          );
                  !!q && str.push(q);
                }
                if(!str.length)
                {
                  console.error('Error in constructing query: no named input');
                  return false;
                }
                else
                {
                  return str.join('&');
                }
              }());
        !!query && formalhaut.sendForm(query,form);
      },
      sendForm : function(query,form){
        if(!query || !query.length || !form || !form.action)
        {
          console.warn('No query/form/action');
          return false;
        }
        var mthd = form.method.toUpperCase()      || 'GET',
            actn = form.action                    || null,
            enct = form.enctype                   || form.getAttribute("enctype"),
            chst = form.acceptCharset             || form.getAttribute("accept-charset"),
            rqbd = (mthd === 'POST' && !!query    ?  query : null),
            rqmd = form.getAttribute('data-cors') || 'cors',
            ct   = (
                    !!enct && !!chst ?
                      enct + '; charset=' + chst :
                      (
                      !!enct ? 
                        enct + '; charset=utf-8' :
                          'application/x-www-form-urlencoded; charset=utf-8'
                      )
                    );
        if(!!window.fetch)
        {
          fetch(actn,
            {
              method  : mthd,
              body    : rqbd,
              mode    : rqmd,
              headers : {
                'Content-Type'   : ct
              }
            })
          .then(function(resp){
            resp.status >= 200 && resp.status < 300 ?
              console.info(resp.status) :
                console.error('Error: ' + (resp.message || 'No data available') );
          })
          .catch(function(resp){
            console.error('Error: ' + (resp.message || 'No data available') );
          });
        }
        else
        {
          var xhr = new XMLHttpRequest();
          xhr.open(mthd, actn, true);
          xhr.setRequestHeader('Content-type', ct);
          xhr.onreadystatechange = function(){
            this.readyState === 4 ? 
              (
                (this.status >= 200 && this.status < 300) ?
                  console.info(xhr.responseText) :
                    console.error('Error: ' + (xhr.status || 'No data available') )
              ) : 
                  console.error('Error: ' + (xhr.status || 'No data available') );
          };
          xhr.send(query);
        }
      },
      init : function(){
        var forms = document.forms || document.getElementsByTagName('form'),
            len   = forms.length;
            
        while(len--)
        {
          var eListener = (
                            (!!'addEventListener' in this) ?
                              'addEventListener' :
                                (!!'attachEvent' in this) ? 
                                  'attachEvent' :
                                    null
                          ),
              ev        = (!!'addEventListener' in this) ?
                              'submit' :
                                'onsubmit';
          if(!!eListener)
          {
            forms[len][eListener](ev, formalhaut.prepForm, false);
          }
          else
          {
            forms[len][ev] = formalhaut.prepForm;
          }
        }
      }
    };
    formalhaut.init();
  }
  else
  {
    console.warn("Your browser does not seem to support formalhaut.js");
  }
})();
