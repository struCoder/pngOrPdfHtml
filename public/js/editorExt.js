(function(Simditor, SEINS) {
  var $exportBox = $('.export-box');
  var $cover = $('.cover');
  var $close = $exportBox.find('.header .close');
  var toolbar = SEINS.toolbar;
  var exportTpl = '<li><a href="javascript:;" class="toolbar-item toolbar-item-export"><span>导出</span></a></li>';
  var toolbarUl = toolbar.wrapper.find('ul');
  var $pngBtn = $exportBox.find('.body .left');
  var $pdfBtn = $exportBox.find('.body .right');
  var $waitingBox = $('.waiting-box');

  function simulate(element, eventName) {
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers) {
      if (eventMatchers[name].test(eventName)) {
        eventType = name;
        break;
      }
    }

    if (!eventType)
      throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent) {
      oEvent = document.createEvent(eventType);
      if (eventType == 'HTMLEvents') {
        oEvent.initEvent(eventName, options.bubbles, options.cancelable);
      } else {
        oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
          options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
          options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
      }
      element.dispatchEvent(oEvent);
    } else {
      options.clientX = options.pointerX;
      options.clientY = options.pointerY;
      var evt = document.createEventObject();
      oEvent = extend(evt, options);
      element.fireEvent('on' + eventName, oEvent);
    }
    return element;
  }

  function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  }

  var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
  }
  var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
  }
  $(toolbar._tpl.separator).appendTo(toolbarUl);
  $(exportTpl).appendTo(toolbarUl);
  toolbarUl.find('li .toolbar-item-export').click(function() {
    $cover.addClass('show');
    $exportBox.addClass('show');
  });

  $close.click(function() {
    $exportBox.removeClass('show');
    $cover.removeClass('show');
  });

  function download(filename, type) {
    var downloadUrl = '/download?filename=' + filename + '&type=' + type;
    var aEl = document.createElement('a');
    aEl.href = downloadUrl;
    simulate(aEl, 'click');
    $waitingBox.removeClass('show');
    $cover.removeClass('show');
  }
  $pngBtn.click(function() {
    $exportBox.removeClass('show');
    $waitingBox.addClass('show');

    var postData = {
      data: SEINS.getValue(),
      type: 'png'
    }

    $.post('/gen', postData, function(res) {
      download(res.filename, res.type);
    });
  });

  $pdfBtn.click(function() {
    $exportBox.removeClass('show');
    $waitingBox.addClass('show');
    var postData = {
      data: SEINS.getValue(),
      type: 'pdf'
    }
    $.post('/gen', postData, function(res) {
      download(res.filename, res.type);
    });
  });

})(window.Simditor, window.SEINS)
