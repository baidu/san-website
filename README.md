San Website
------------

### prepare

```
$ npm i
```

### preview

```
# npm start
hexo s
```


### deploy

```
# npm run deploy
$ hexo deploy
```





给 San 文档做贡献
------------


### San 是一个传统的 MVVM 组件框架，官网地址 https://baidu.github.io/san/

如果你在使用 San 过程中遇到任何问题，请通过 github: https://github.com/baidu/san 给我们提 issue；
如果你在看 San 文档的过程中发现任何问题，可以通过文档 github: https://github.com/baidu/san-website 给我们提 issue，或者在相应位置修改后发起 PR；
当然我们非常欢迎您在实践 San 框架过程中，有任何实践经验或总结文档，可以通过 PR 的方式提交到文档 github: https://github.com/baidu/san-website， 经过我们 review 后的文档会合入 San 的官方文档中。


### San 文档 PR 规范

1. **提交前的 fork 同步更新操作**：每次 PR 前请进行 fork 同步更新操作，避免产生冲突。

2. **文档内容**： 必须包含对实践问题的原理分析总结，包含实际的 demo，demo 的编写请使用 codepen，最后将其嵌入到文档中，具体详情及嵌入方式请见例子：
      https://baidu.github.io/san/practice/traverse-object/.
3. **实践类文档项目路径**：

    - [ ] 添加文档可以往这里发 PR

             https://github.com/baidu/san-website/tree/master/source/_posts/practice

    - [ ] 链接是手工加

            https://github.com/baidu/san-website/blob/master/themes/san/layout/practice.ejs

4.  ** PR 标题与内容**：PR 标题和内容，请对文档进行详细说明，并提供文档的最终截图。 

有任何文档问题可以给我们提 issue