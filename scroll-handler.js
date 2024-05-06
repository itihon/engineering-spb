const debounce = (fn = Function.prototype, delay = 0) => {
    let timeout;

    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(fn, delay, ...args);
    };
};

const menuItems = [...document.querySelectorAll('.nc-menu-item')]
                    .reduce(
                        (items, item) => items.set(item.hash.slice(1), item), 
                        new Map()
                    );

const pageSet = new Set(document.querySelectorAll('.pc-page'));

const markActiveMenuItem = () => {
    const { width, height } = window.visualViewport;
    const elements = document.elementsFromPoint(width / 2, height / 2);

    elements.some(el => {
        if (pageSet.has(el)) {
            const classList  = menuItems.get(el.id).classList;

            if (!classList.contains('hover')) {
                menuItems.forEach(item => item.classList.remove('hover'));
                classList.add('hover');
            }
        }
    });
};

addEventListener('load', markActiveMenuItem);
addEventListener('scroll', debounce(markActiveMenuItem, 50));
