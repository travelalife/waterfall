(function (){
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
        this.init(opts);
    }

    Waterfall._defaultOpts = {
        width: 240,
        marginX: 20,
        marginY: 20
    }

    let proto = Waterfall.prototype;

    let loading = false;

    proto.init = function (s) {
        this.opts = utils.extend({}, this.constructor._defaultOpts, s);
        this.wrapper = document.querySelector(this.opts.container);  // 外层容器
        let width = parseFloat(getComputedStyle(this.wrapper, null).width.replace("px", ""));  // 外层容器宽度

        this.colWidth = this.opts.width + this.opts.marginX;
        this.colLength = Math.floor((width - this.opts.marginX) / (this.opts.width + this.opts.marginX));  // 总列数

        this.containerWidth = this.colLength * this.opts.width + (this.colLength - 1) * this.opts.marginX;  // 容器宽度
        this.wrapper.innerHTML = '<div class="waterfall-container" style="width: ' + this.containerWidth + 'px;position: relative;min-height: 1px;margin: 0 auto;"></div>';
        this._container = this.wrapper.childNodes[0]; // 瀑布流存放容器

        this.colHeightArr = []; // 每列的高度
        for (let i = 0; i < this.colLength; i++) {
            this.colHeightArr.push(0);
        }

        this.loadMore(this.opts.imgs);

        const self = this;
        this.wrapper.addEventListener('scroll', function (e) {
            const max = Math.max.apply(null, self.colHeightArr);
            if (this.scrollTop + this.offsetHeight >= max - 10) {
                if (loading) {
                    return false;
                }
                loading = true;
                self.loadMore(getData());
            }
        })
    }

    proto.loadMore = function (imgs) {
        // 计算并记录所有图片的高度
        let imgArr = [];
        let promiseArr = [];
        for (let i = 0; i < imgs.length; i++) {
            const imgEle = imgs[i];
            const url = imgEle.src;
            let img = new Image();
            img.src = url;
            imgArr.push(utils.extend({}, {
                ins: img,
                src: url,
                title: imgEle.title,
                desc: imgEle.desc
            }));
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
                const height = this.opts.width / imgIns.width * imgIns.height;
                const minCol = Math.min(...this.colHeightArr); // 最小高度
                const minColIndex = this.colHeightArr.indexOf(minCol); // 最小高度的index
                // 设置left和top值
                imgObj.top = minCol + this.opts.marginY;
                imgObj.left = minColIndex * this.colWidth;

                this.colHeightArr[minColIndex] += height + this.opts.marginY;

                imgHtml += '<div class="waterfall-item" style="width: ' + this.opts.width + 'px;left: ' + imgObj.left + 'px;top: ' + imgObj.top + 'px;position: absolute;box-shadow: 0 0 4px #CCC;">' +
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
            this._container.appendChild(fragment);
        }).finally(() => {
            loading = false;
        })
    }

    this.Waterfall = Waterfall;
}());
