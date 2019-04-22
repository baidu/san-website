hexo.extend.helper.register('url_for_lang', function(path) {
  var lang = this.page.lang;

  if (lang) {
    path = lang + '/' + path;
  }

  return this.url_for(path);
});