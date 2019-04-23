hexo.extend.helper.register('url_for_lang', function(path, lang) {
  lang = lang == null ? this.page.lang : lang;

  if (lang) {
    path = lang + '/' + path;
  }

  return this.url_for(path);
});