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
    
    function linkAdjacentImages (image, i, imageList) {
        image[PREV_NODE] = imageList[i - 1] || imageList[imageList.length - 1];
        image[NEXT_NODE] = imageList[i + 1] || imageList[0];
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
    
    function flipHandler(e) {
        
        if (this === prevBtn) {
            cloneImg(img[PREV_NODE]);
        }

        if (this === nextBtn) {
            cloneImg(img[NEXT_NODE]);
        }
    }

    function addHandler(element, type, handler) {
        element.addEventListener(type, handler);
    }

    function cloneImg(imgElement) {
        // cloneElement(element) : clonedElement
        let clonedImg = imgElement.cloneNode();
        clonedImg[PREV_NODE] = imgElement[PREV_NODE];
        clonedImg[NEXT_NODE] = imgElement[NEXT_NODE];
       
        // clearClassList(element)
        let classList = clonedImg.classList.values();
        for (className of classList) {
            clonedImg.classList.remove(className);
        }

        // copyClassList(srcElement, destElement)
        clonedImg.classList.add(...img.classList.values());


        // replaceElement(containder, elToDelete, elToPut)
        container.removeChild(img);
        container.appendChild(clonedImg); 
        img = clonedImg;
    }

    function addZoomLabel(image) {
        let div = d.createElement('div');
        let text = d.createTextNode('Увеличить 🔎');
        div.classList.add('isc-image-zoom-label');

        addHandler(div, 'click', openHandler.bind(image));
       
        div.appendChild(text);
        image.parentNode.appendChild(div);
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
    Array.prototype.forEach.call(images, linkAdjacentImages);
    Array.prototype.forEach.call(images, addOpenHandler);
    Array.prototype.forEach.call(images, addZoomLabel);

})(window, document, '[rel="js-portfolio-img');