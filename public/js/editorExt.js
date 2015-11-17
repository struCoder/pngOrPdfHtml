(function(Simditor, SEINS) {
  var toolbar = SEINS.toolbar;
  var exportTpl = '<li><a href="javascript:;" class="toolbar-item toolbar-item-export"><span>导出</span></a></li>';
  var toolbarUl = toolbar.wrapper.find('ul');
  $(toolbar._tpl.separator).appendTo(toolbarUl);
  $(exportTpl).appendTo(toolbarUl);
  toolbarUl.find('li .toolbar-item-export').click(function() {
    console.log('...')
  })
})(window.Simditor, window.SEINS)
