# autoform

[NB: this is in the process of being improved and will not remain the same for much longer]

a drop in vanilla JS lib to declaratively auto-ajaxify forms

### declarative
formalhaut is not intended to be a hefty framework that locks you into dependence on JavaScript, which users can switch off at will and is inconsistently implemented across devices.

the elegance of formalhaut is that it works by extracting your form's options from the `&lt;form&gt;` element's attributes, like `method=`, `action=`, `enctype=` or even `accept-charset=`.

that way, the form will still function in the traditional way, but if JavaScript is present, the form will automatically be handled asynchronously with AJAX.

this lib also tests for the new fetch API before using XMLHttpRequest for the sake of being future-proof, as well as opening up further potential for the lib with respect to resumable form submissions via serviceworker etc.
