(function ImgShowerComponent(global, d, imagesSelector) {
    let images = d.querySelectorAll(imagesSelector);
    let container = d.querySelector('[rel="js-img-shower-component"]');
    let closeBtn = container.querySelector('[rel="js-isc-close-btn"]');
    let prevBtn = container.querySelector('[rel="js-isc-prev-btn"]');
    let nextBtn = container.querySelector('[rel="js-isc-next-btn"]');
    let img = container.querySelector('[rel="js-isc-image"]');
    //let imageHeader = container.querySelector('[rel="js-isc-image-header"]');
    let addCloseHandler = curry(3, addHandler)(closeHandler)('click');
    let addOpenHandler = curry(3, addHandler)(openHandler)('click');
    let addFlipHandler = curry(3, addHandler)(flipHandler)('click');

    const PREV_NODE = 'ISC_prevNode';
    const NEXT_NODE = 'ISC_nextNode';
    
    function nodeListToDoublyLinkedList (nodeList) {
        for (let i = 0; i < nodeList.length; i++) {
            nodeList[i][PREV_NODE] = nodeList[i - 1] || nodeList[nodeList.length - 1];
            nodeList[i][NEXT_NODE] = nodeList[i + 1] || nodeList[0];
        }
    }

    function closeHandler(e) {
        container.classList.remove('visible');
        d.body.style.overflow = 'auto';
    }

    function openHandler(e) {
        container.classList.add('visible');
        d.body.style.overflow = 'hidden';

        cloneImg(this);
    }

    function addHandler(element, type, handler) {
        element.addEventListener(type, handler);
    }

    function flipHandler(e) {
        
        if (this === prevBtn) {
            cloneImg(img[PREV_NODE]);
        }

        if (this === nextBtn) {
            cloneImg(img[NEXT_NODE]);
        }
    }

    function cloneImg(imgElement) {
        let clonedImg = imgElement.cloneNode();
        let classList = clonedImg.classList.values();

        for (className of classList) {
            clonedImg.classList.remove(className);
        }

        clonedImg.classList.add(...img.classList.values());

        clonedImg[PREV_NODE] = imgElement[PREV_NODE];
        clonedImg[NEXT_NODE] = imgElement[NEXT_NODE];

        container.removeChild(img);
        container.appendChild(clonedImg); 
        img = clonedImg;
    }

    function addZoomLabel(image) {
        let div = d.createElement('div');
        let text = d.createTextNode('Увеличить 🔎');
        div.classList.add('isc-image-zoom-label');
       
        div.appendChild(text);
        image.parentNode.appendChild(div);
    }

    function curry(arity, fn) {
        return function(arg1) {
            return function(arg2) {
                return function(arg3) {
                    return fn(arg3, arg2, arg1);
                };
            };
        };
    } 

    function curry(arity, fn) {
        return function curried(arg) {
                if (arity == 1) {
                    return fn(arg);
                }
                else {
                    return curry(--arity, function wrapper(...args) {
                        return fn(...args.concat(arg))
                    });
                }
        };
    }

    addFlipHandler(prevBtn);
    addFlipHandler(nextBtn);
    addCloseHandler(closeBtn);
    nodeListToDoublyLinkedList(images);
    Array.prototype.forEach.call(images, addOpenHandler);
    Array.prototype.forEach.call(images, addZoomLabel);

})(window, document, '[rel="js-portfolio-img');