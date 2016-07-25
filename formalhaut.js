function prepForm(e){
    e.preventDefault();
    var form = document.getElementById(e.target.id),
        f    = 
        (function() {
          var inputs = form.querySelectorAll('input,textarea'),
              i      = inputs.length,
              j      = 0,
              str    = [];
          for(;i>j;j++)
          {
            var q = ( 
                    !!inputs[j].getAttribute("name") && !!inputs[j].value ? 
                      inputs[j].getAttribute("name") + "=" + inputs[j].value : 
                        null 
                    );
            !!q && str.push(q);
          }
          if(!str.length)
          {
            return false;
          }
          else
          {
            return str.join("&");
          }
        }());
    !!f && submitForm(f,form);
  }

  function submitForm(f,form){
    if(!f || !f.length || !form)
    {
      return;
    }
    var ct = (
              !!form.enctype && !!form.acceptCharset ?
                form.enctype + '; charset=' + form.acceptCharset :
                (
                !!form.enctype ? 
                  form.enctype + '; charset=utf-8' :
                    'application/x-www-form-urlencoded; charset=utf-8'
                )
              );
    if(!!window.fetch)
    {
      fetch(form.action,
        {
          method  : form.method.toUpperCase(),
          body    : f,
          headers : {
            "Content-Type"   : ct,
            "Content-Length" : f.length.toString()
          }
        })
      .then(function(resp){
        resp.status >= 200 && resp.status < 300 ?
          console.info(resp.status) :
            console.error("Error: " + resp.message || "No data available");
      })
      .catch(function(resp){
        console.log("Error: " + resp.message || "No data available");
      });
    }
    else
    {
      var xhr = new XMLHttpRequest();
      xhr.open(form.method.toUpperCase(),form.action,true);
      xhr.setRequestHeader('Content-type', ct);
      xhr.setRequestHeader('Content-Length', f.length.toString());
      xhr.onreadystatechange = function(){
        this.readyState === 4 ? 
          (
            (this.status >= 200 && this.status < 300) ?
              console.info(xhr.responseText) :
                console.error(xhr.status+"Error")
          ) : 
              console.error(xhr.status+"Error");
      };
      xhr.send(f);
    }
  }

  var forms = document.forms || document.getElementsByTagName("form"),
      len   = forms.length;
  while(len--)
  {
    var eListener = (
                        ('addEventListener' in this) ?
                          'addEventListener' :
                            ('attachEvent' in this) ? 
                              'attachEvent' :
                                null
                      );
    if(!!eListener)
    {
      forms[len][eListener]("submit",prepForm,false);
    }
    else
    {
      forms[len].onsubmit = prepForm;
    }
  }
