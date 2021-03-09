# waterfall
瀑布流插件

```css

#waterfall {
  width: 100%;
  height: 600px;
  overflow: auto;
}

```

```html

<div id="waterfall"></div>

```

```javascript

var waterfall = new Waterfall({
    container: '#waterfall',
    clsName: 'waterfall-item',
    marginX: 20,
    marginY: 20,
    imgs: [{
        src: '1.jpg', 
        desc: '图片描述', 
        title: '图片alt'
    }]
});

```
