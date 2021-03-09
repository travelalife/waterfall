(function (){
    let _defaultOpts = {
        width: 240,
        marginX: 20,
        marginY: 20
    }

    let utils = {
        extend: function (target) {
            for (let i = 1, len = arguments.length; i < len; i++) {
                for (let prop in arguments[i]) {
                    if (arguments[i].hasOwnProperty(prop)) {
                        target[prop] = arguments[i][prop]
                    }
                }
            }

            return target
        },
    }

    function Waterfall(opts) {
        init(opts);
    }

    function init(s) {
        const imgs = s.imgs || [];

        let opts = utils.extend({}, _defaultOpts, s);
        let $main = document.querySelector(opts.container);  // 外层容器
        let width = parseFloat(getComputedStyle($main, null).width.replace("px", ""));  // 外层容器宽度

        const colWidth = opts.width + opts.marginX;
        const colLength = Math.floor((width - opts.marginX) / (opts.width + opts.marginX));  // 总列数

        let containerWidth = colLength * opts.width + (colLength - 1) * opts.marginX;  // 容器宽度
        $main.innerHTML = '<div class="waterfall-container" style="width: ' + containerWidth + 'px;position: relative;min-height: 1px;margin: 0 auto;"></div>';
        let $container = $main.childNodes[0]; // 瀑布流存放容器

        let colHeightArr = []; // 每列的高度
        for (let i = 0; i < colLength; i++) {
            colHeightArr.push(0);
        }

        // 计算并记录所有图片的高度
        let imgArr = [];
        let promiseArr = [];
        for (let i = 0; i < imgs.length; i++) {
            const imgEle = imgs[i];
            const url = imgEle.src;
            let img = new Image();
            img.src = url;
            imgArr.push({
                ins: img,
                src: url,
                title: imgEle.title,
                desc: imgEle.desc
            });
            const p = img.decode().then(() => {

            }).catch(() => {

            })
            promiseArr.push(p);
        }

        Promise.all(promiseArr).then(() => {
            let imgHtml = '';
            for (let i = 0; i < imgArr.length; i++) {
                const imgObj = imgArr[i];
                const imgIns = imgObj.ins;
                const height = opts.width / imgIns.width * imgIns.height;
                const minCol = Math.min(...colHeightArr); // 最小高度
                const minColIndex = colHeightArr.indexOf(minCol); // 最小高度的index
                // 设置left和top值
                imgObj.top = minCol + opts.marginY;
                imgObj.left = minColIndex * colWidth;

                colHeightArr[minColIndex] += height + opts.marginY;

                imgHtml += '<div class="waterfall-item" style="width: ' + opts.width + 'px;left: ' + imgObj.left + 'px;top: ' + imgObj.top + 'px;position: absolute;box-shadow: 0 0 4px #CCC;">' +
                    '<img src="' + imgObj.src + '" class="waterfall-img" style="display: block;width: 100%;" alt="' + imgObj.title + '">' +
                    '<div class="waterfall-desc" style="position: absolute;left: 0;bottom: 0;">' + imgObj.desc + '</div></div>';
            }

            let fragment = document.createDocumentFragment();
            let div = document.createElement('div');
            div.innerHTML = imgHtml;
            let children = div.querySelectorAll('.waterfall-item');
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                fragment.appendChild(child);
            }
            $container.appendChild(fragment);
        })
    }

    this.Waterfall = Waterfall;
}());
