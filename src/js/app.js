import * as helperFunctions from "./modules/functions.js";

helperFunctions.isWebp();

const menuToggleCondition = (e) => {
    return e.target.closest(".header__burger");
}
const menuToggleAction = (header) => {
    document.body.classList.toggle("_locked");
    header.classList.toggle("_active");
}
const menuAppear = (header) => {
    document.body.classList.add("_locked");
    header.classList.add("_active");
}
const menuDisappear = (header) => {
    document.body.classList.remove("_locked");
    header.classList.remove("_active");
}

const spoilersToggleCondition = (e) => {
    return e.target.closest(".spoiler__opener") || e.target.closest(".select__opener");
}
const spoilersToggleAction = (e) => {
    let neededElement;
    let neededOpener;
    if(e.target.closest(".spoiler")){
        neededElement = e.target.closest(".spoiler");
        neededOpener = e.target.closest(".spoiler__opener");
    } else {
        neededElement = e.target.closest(".select");
        neededOpener = e.target.closest(".select__opener");
    }

    neededElement.classList.toggle("_active");
    const spoilerHidden = neededOpener.nextElementSibling;
    if(neededElement.classList.contains("_active")){
        spoilerHidden.style.height = spoilerHidden.childNodes[1].offsetHeight + "px";
    } else{
        spoilerHidden.style.height = "";
    }
}

const priceItemCondition = (e) => {
    return e.target.closest(".item-price__button");
}
const priceItemAction = (e, titles, values, totalPrice, spoilerChoosed, spoilerChoosedInfo, spoilerChoosedList) => {
    let price = 0;
    let service = "";
    let auto = "";
    for(const value of values){
        if(e.target.closest(".item-price__button").contains(value)){
            price = parseInt(value.innerText);
            break;
        }
    }
    for(const title of titles){
        if(e.target.closest(".item-price").contains(title)){
            service = title.innerText;
            break;
        }
    }
    const typeAutos = [
        {checked: "minivan", visible: "Мікроавтобус"}, 
        {checked: "jeep", visible: "Джип"}, 
        {checked: "crossover", visible: "Кросовер"},
        {checked: "passenger", visible: "Легковий"}
    ];
    if(e.target.closest(".item-price__button").classList.contains("item_common-price__button")){
        auto = "Будь-який";
    } else {
        outerLoop: for(const typeAuto of typeAutos){
            for(const classPart of e.target.closest(".item-price__link").className.split(" ")){
                if(classPart === typeAuto.checked){
                    auto = typeAuto.visible;
                    break outerLoop;
                }
            }
        }
    }
    totalPrice.innerText = parseInt(totalPrice.innerText) + price;
    spoilerChoosedList.insertAdjacentHTML("beforeend",
        `<li class="spoiler-price__link spoiler_choosed-price__link spoiler__link">
            <span>${auto} ${service} ${price}грн.</span>
            <button></button>
        </li>`
    );

    if(spoilerChoosed.classList.contains("_active")){
        spoilerChoosedInfo.style.height = spoilerChoosedList.offsetHeight + "px";
    } else if(spoilerChoosed.classList.contains("_disabled")){
        spoilerChoosed.classList.remove("_disabled");
    }
}

const deleteChoosedServiceCondition = (e) => {
    return e.target.closest(".spoiler_choosed-price__link");
}
const deleteChoosedServiceAction = (e, totalPrice, spoilerChoosed, spoilerChoosedInfo, spoilerChoosedList) => {
    if(document.querySelectorAll(".spoiler_choosed-price__link").length === 1){
        spoilerChoosedInfo.style.height = "0px";
        totalPrice.innerText = parseInt(totalPrice.innerText) - e.target.closest(".spoiler_choosed-price__link").innerText.match(/\d+/)[0];
        setTimeout(() => {
            spoilerChoosedList.removeChild(e.target.closest(".spoiler_choosed-price__link"));
            spoilerChoosed.classList.add("_disabled");
            spoilerChoosed.classList.remove("_active");
        }, 300);
    } else {
        spoilerChoosedInfo.style.height = spoilerChoosedList.offsetHeight - e.target.closest(".spoiler_choosed-price__link").offsetHeight + "px";
        totalPrice.innerText = parseInt(totalPrice.innerText) - e.target.closest(".spoiler_choosed-price__link").innerText.match(/\d+/)[0];
        setTimeout(() => {
            spoilerChoosedList.removeChild(e.target.closest(".spoiler_choosed-price__link"));
        }, 300);
    }
}

const modalOpenerCondition = (e) => {
    return e.target.closest(".opener_auto");
}
const modalOpenerAction = (modal, modalCloser, modalTextarea, modalSend, focusableElements) => {
    document.body.classList.add("_locked");
    document.body.classList.add("_appear-modal");
    modalEnable(modal, modalCloser, modalTextarea, modalSend, focusableElements);
}

const modalCloserCondition = (e) => {
    return e.target.closest(".order__close");
}
const modalCloserAction = (modalCloser, modalTextarea, modalSend, focusableElements, header) => {
    if(!header.classList.contains("_active")){
        document.body.classList.remove("_locked");
    }
    document.body.classList.remove("_appear-modal");
    modalDisable(modalCloser, modalTextarea, modalSend, focusableElements);
}

const modalDisable = (modal, modalCloser, modalTextarea, modalSend, focusableElements) => {
    modalCloser.tabIndex = -1;
    modalTextarea.tabIndex = -1;
    modalSend.tabIndex = -1;
    
    focusableElements.forEach(el => {
        if(!modal.contains(el)){
            el.tabIndex = 0;
        }
    });
}
const modalEnable = (modal, modalCloser, modalTextarea, modalSend, focusableElements) => {
    modalCloser.tabIndex = 0;
    modalTextarea.tabIndex = 0;
    modalSend.tabIndex = 0;

    focusableElements.forEach(el => {
        if(!modal.contains(el)){
            el.tabIndex = -1;
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    const priceContainer = document.querySelector(".price__spoilers");
    const priceSelects = document.querySelectorAll(".price__spoiler_explanation");
    if(priceContainer && priceSelects.length === 2){
        priceContainer.classList.add("_two-child");
    }

    const header = document.querySelector(".header");

    const focusableElements = document.querySelectorAll("a, input, button, textarea");
    const modal = document.querySelector(".order");
    const modalCloser = document.querySelector(".order__close");
    const modalTextarea = document.querySelector(".order__textarea");
    const modalSend = document.querySelector(".order__send");

    const priceItemsTitles = document.querySelectorAll(".item-price__title");
    const priceItemsValues = document.querySelectorAll(".item-price__button span");
    const totalPrice = document.querySelector(".price__calculator output");
    const priceSpoilerChoosed = document.querySelector(".spoiler_choosed-price");
    const priceSpoilerChoosedInfo = document.querySelector(".spoiler_choosed-price__info");
    const priceSpoilerChoosedList = document.querySelector(".spoiler_choosed-price__list");

    if(header){
        document.querySelectorAll(".menu__link a").forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const elementToscroll = document.querySelector(e.currentTarget.getAttribute('href'));
                const targetPosition = elementToscroll.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                });
            });
        });    

        if(screen.width <= 768){
            const menuLinks = document.querySelectorAll(".menu__link a");
            if(menuLinks){
                menuLinks[0].addEventListener("focus", () => {
                    menuAppear(header);
                });
                menuLinks[menuLinks.length - 1].addEventListener("blur", () => {
                    menuDisappear(header);
                });
            }    
        }

        window.addEventListener("scroll", () => {
            if(!document.body.classList.contains("_locked")){
                if(window.scrollY){
                    header.classList.add("_scroll");
                }else{
                    header.classList.remove("_scroll");
                }
            }
        });

        if(modal && modalCloser && modalTextarea && modalSend){
            if(priceItemsTitles && priceItemsValues && totalPrice && priceSpoilerChoosed && priceSpoilerChoosedInfo && priceSpoilerChoosedList){
                modalDisable(modal, modalCloser, modalTextarea, modalSend, focusableElements);
                document.body.addEventListener("click", (e) => {
                    if(modalOpenerCondition(e)){
                        modalOpenerAction(modal, modalCloser, modalTextarea, modalSend, focusableElements);
                    } else if(modalCloserCondition(e)){
                        modalCloserAction(modalCloser, modalTextarea, modalSend, focusableElements, header);
                    } else if(menuToggleCondition(e)) {
                        menuToggleAction(header);
                    } else if(spoilersToggleCondition(e)) {
                        spoilersToggleAction(e);
                    } else if(priceItemCondition(e)){
                        priceItemAction(e, priceItemsTitles, priceItemsValues, totalPrice, priceSpoilerChoosed, priceSpoilerChoosedInfo, priceSpoilerChoosedList);
                    } else if(deleteChoosedServiceCondition(e)){
                        deleteChoosedServiceAction(e, totalPrice, priceSpoilerChoosed, priceSpoilerChoosedInfo, priceSpoilerChoosedList);
                    }
                });
            } else {
                modalDisable(modal, modalCloser, modalTextarea, modalSend, focusableElements);
                document.body.addEventListener("click", (e) => {
                    if(modalOpenerCondition(e)){
                        modalOpenerAction(modal, modalCloser, modalTextarea, modalSend, focusableElements);
                    } else if(modalCloserCondition(e)){
                        modalCloserAction(modalCloser, modalTextarea, modalSend, focusableElements, header);
                    } else if(menuToggleCondition(e)) {
                        menuToggleAction(header);
                    } else if(spoilersToggleCondition(e)) {
                        spoilersToggleAction(e);
                    }
                });
            }
        } else {
            if(priceItemsTitles && priceItemsValues && totalPrice && priceSpoilerChoosed && priceSpoilerChoosedInfo && priceSpoilerChoosedList){
                document.body.addEventListener("click", (e) => {
                    if(menuToggleCondition(e)) {
                        menuToggleAction(header);
                    } else if(spoilersToggleCondition(e)) {
                        spoilersToggleAction(e);
                    } else if(priceItemCondition(e)){
                        priceItemAction(e, priceItemsTitles, priceItemsValues, totalPrice, priceSpoilerChoosed, priceSpoilerChoosedInfo, priceSpoilerChoosedList);
                    } else if(deleteChoosedServiceCondition(e)){
                        deleteChoosedServiceAction(e, totalPrice, priceSpoilerChoosed, priceSpoilerChoosedInfo, priceSpoilerChoosedList);
                    }
                });
            } else {
                document.body.addEventListener("click", (e) => {
                    if(menuToggleCondition(e)) {
                        menuToggleAction(header);
                    } else if(spoilersToggleCondition(e)) {
                        spoilersToggleAction(e);
                    }
                });
            }
        }
    }else{
        if(modal && modalCloser && modalTextarea && modalSend){
            if(priceItemsTitles && priceItemsValues && totalPrice && priceSpoilerChoosed && priceSpoilerChoosedInfo && priceSpoilerChoosedList){
                modalDisable(modal, modalCloser, modalTextarea, modalSend, focusableElements);
                document.body.addEventListener("click", (e) => {
                    if(spoilersToggleCondition(e)) {
                        spoilersToggleAction(e);
                    } else if(modalOpenerCondition(e)){
                        modalOpenerAction(modal, modalCloser, modalTextarea, modalSend, focusableElements);
                    } else if(modalCloserCondition(e)){
                        modalCloserAction(modalCloser, modalTextarea, modalSend, focusableElements, header);
                    } else if(priceItemCondition(e)){
                        priceItemAction(e, priceItemsTitles, priceItemsValues, totalPrice, priceSpoilerChoosed, priceSpoilerChoosedInfo, priceSpoilerChoosedList);
                    } else if(deleteChoosedServiceCondition(e)){
                        deleteChoosedServiceAction(e, totalPrice, priceSpoilerChoosed, priceSpoilerChoosedInfo, priceSpoilerChoosedList);
                    }
                });
            } else {
                modalDisable(modal, modalCloser, modalTextarea, modalSend, focusableElements);
                document.body.addEventListener("click", (e) => {
                    if(spoilersToggleCondition(e)) {
                        spoilersToggleAction(e);
                    } else if(modalOpenerCondition(e)){
                        modalOpenerAction(modal, modalCloser, modalTextarea, modalSend, focusableElements);
                    } else if(modalCloserCondition(e)){
                        modalCloserAction(modalCloser, modalTextarea, modalSend, focusableElements, header);
                    }
                });
            }
        } else {
            if(priceItemsTitles && priceItemsValues && totalPrice && priceSpoilerChoosed && priceSpoilerChoosedInfo && priceSpoilerChoosedList){
                document.body.addEventListener("click", (e) => {
                    if(spoilersToggleCondition(e)) {
                        spoilersToggleAction(e);
                    } else if(priceItemCondition(e)){
                        priceItemAction(e, priceItemsTitles, priceItemsValues, totalPrice, priceSpoilerChoosed, priceSpoilerChoosedInfo, priceSpoilerChoosedList);
                    } else if(deleteChoosedServiceCondition(e)){
                        deleteChoosedServiceAction(e, totalPrice, priceSpoilerChoosed, priceSpoilerChoosedInfo, priceSpoilerChoosedList);
                    }
                });
            } else {
                document.body.addEventListener("click", (e) => {
                    if(spoilersToggleCondition(e)) {
                        spoilersToggleAction(e);
                    }
                });
            }
        }
    }

    const priceSpoilers = document.querySelectorAll(".spoiler_explanation-price");
    const priceSpoilersOpeners = document.querySelectorAll(".spoiler_explanation-price__opener");
    if(priceSpoilers && priceSpoilersOpeners){
        priceSpoilersOpeners.forEach((spoilerOpener, i) => {
            spoilerOpener.addEventListener("focus", () => {
                priceSpoilers[i].classList.add("_focus");
            });
            spoilerOpener.addEventListener("blur", () => {
                priceSpoilers[i].classList.remove("_focus");
            });
        });
    }

    const partComparasion = document.querySelector(".part_after-item-comparasion img");
    const comparasionItemLines = document.querySelectorAll(".part-item-comparasion__line");
    const comparasionItems = document.querySelectorAll(".comparasion__item");
    if(comparasionItemLines.length !== 0 && comparasionItemLines.length === comparasionItems.length && partComparasion){
        const matrix = getComputedStyle(comparasionItemLines[0]).transform.match(/matrix\((.*)\)/)[1].split(', ').map(parseFloat);
        const angle = Math.atan2(matrix[1], matrix[0]) * (180 / Math.PI);
        
        const startComparasionPartWidth = parseFloat(getComputedStyle(partComparasion).width);
        comparasionItemLines.forEach(comparasionItemLine => {
            comparasionItemLine.style.transform = 
                `rotate(${startComparasionPartWidth / partComparasion.offsetWidth * angle}deg) translateX(-100%)`;
        })
    }
});