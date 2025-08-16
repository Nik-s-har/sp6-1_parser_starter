// @todo: напишите здесь код парсера

function parsePage() {
    const lang = document.querySelector('html').getAttribute("lang");
    const title = document.querySelector('title').textContent.split('—')[0].trim();
    const keywords = () => {
        const keywordArr = document.querySelector('[name="keywords"]').content.split(',');
        for (let i=0; i<keywordArr.length; i++) {
        keywordArr[i] = keywordArr[i].trim();
        }
        return keywordArr;
    }
    const description = document.querySelector('[name="description"]').content;
    const opengraph = () => {
        const ogArr = document.querySelectorAll('[property]');
        const ogObj = {};
        for (const item of ogArr) {
            const name = item.getAttribute('property').split(':')[1];
            if (name == "title") {
                ogObj[name] = item.content.split('—')[0].trim();
            } else ogObj[name] = item.content;
        }
        return ogObj;
    }
    const dataId = document.querySelector(".product").getAttribute('data-id');
    const productTitle = document.querySelector("h1").textContent;
    const isLiked = () => {
        const buttonLikeClassList = Array.from(document.querySelector('.like').classList);
        return buttonLikeClassList.includes("active");
    }
    const tags = () => {
        const elementTags = document.querySelector('.tags').children;
        const tagsObj = {"category": [], "discount": [], "label": []};
        for (const tag of elementTags) {
            const tagClass = Array.from(tag.classList)[0];
            switch (tagClass) {
                case "green":
                    tagsObj.category.push(tag.textContent);
                    break;
                case "blue":
                    tagsObj.label.push(tag.textContent);
                    break;
                case "red":
                    tagsObj.discount.push(tag.textContent);
                    break; 
            }
        }
        return tagsObj;
    }
    function priceExtract(strPrice) {
        const strPriceArr = Array.from(strPrice);
        const priceObj = { "currency": "", "digPrice": ""};
        let currencyMarker = false;
        for (const symbol of strPriceArr) {
            if (currencyMarker) {
                if ('0123456789.'.includes(symbol)) {
                    priceObj.digPrice += symbol;
                } else break;
            } else {
                switch (symbol) {
                    case "$":
                        priceObj.currency = "USD";
                        currencyMarker = true;
                        break;
                    case "€":
                        priceObj.currency = "EUR";
                        currencyMarker = true;
                        break;
                    case "₽":
                        priceObj.currency = "RUB";
                        currencyMarker = true;
                        break;
                    default:
                        break;
                }
            }
        }
        return priceObj;
    }
    const price = () => {
        const priceStr = document.querySelector('.price').textContent;
        return Number(priceExtract(priceStr).digPrice);
    }
    const oldPrice = () => {
        const oldPriceStr = document.querySelector('.price').firstElementChild.textContent;
        return Number(priceExtract(oldPriceStr).digPrice);
    }
    const currency = () => {
        const oldPriceStr = document.querySelector('.price').firstElementChild.textContent;
        return priceExtract(oldPriceStr).currency;
    }
    const discount = () => {
        const firstPrice = oldPrice();
        const discountprice = price();
        return (firstPrice - discountprice);
    }
    const discountPercent = () => {
        const firstPrice = oldPrice();
        return (discount()/firstPrice*100).toFixed(2) + "%";
    }
    const properties = () => {
        const propertiesObj = {};
        const propertiesList = document.querySelector('.properties').children;
        for (const li of propertiesList) {
            const key = li.firstElementChild.textContent;
            const value = li.lastElementChild.textContent;
            propertiesObj[key] = value;
        }
        return propertiesObj;
    }
    const productDescription = () => {
        const desc = document.querySelector('.description').innerHTML;
        
    }
    const images = () => {
        const imageArr = [];
        const buttonList = document.querySelector('.preview nav').children;
        for (const button of buttonList) {
            const imageObj = {"preview": "", "full": "", "alt": ""};
            imageObj.preview = button.firstElementChild.getAttribute("src");
            imageObj.full = button.firstElementChild.getAttribute("data-src");
            imageObj.alt = button.firstElementChild.getAttribute("alt");
            imageArr.push(imageObj);
        }
        return imageArr;
    }
    const suggested = () => {
        const suggestedArr = [];
        const suggestedList = document.querySelector('.suggested .items').children;
        for (const item of suggestedList) {
            const suggestedObj = {"name": "", "description": "", "image": "", "price": "", "currency": ""}
            suggestedObj.name = item.querySelector('h3').textContent;
            suggestedObj.description = item.querySelector('p').textContent;
            suggestedObj.image = item.querySelector('img').src;
            suggestedObj.price = priceExtract(item.querySelector('b').textContent).digPrice;
            suggestedObj.currency = priceExtract(item.querySelector('b').textContent).currency;
            suggestedArr.push(suggestedObj);
        }
        return suggestedArr;
    }
    function getRating(ratingTag) {
        let rating = 0;
        for (const item of ratingTag) {
            const classArr = Array.from(item.classList);
            if (classArr.includes("filled")) rating ++;
        }
        return rating;
    }
    function getAuthor(authorTag) {
        const authorObj = {"avatar": "", "name": ""}
        authorObj.avatar = authorTag.querySelector('img').src;
        authorObj.name = authorTag.querySelector('span').textContent;
        return authorObj;
    }
    function getDate(dateStr) {
        const formattedDate = dateStr.replace(/\//g, ".");
        return formattedDate;
    }
    const reviews = () => {
        const reviewsArr = [];
        const reviewsList = document.querySelector('.reviews .items').children;
        for (const item of reviewsList) {
            const reviewsObj = {
                "rating": 0,
                "author": {},
                "title": "",
                "description": "",
                "date": ""
            }
            reviewsObj.rating = getRating(item.querySelector('.rating').children);
            reviewsObj.author = getAuthor(item.querySelector('.author'));
            reviewsObj.title = item.querySelector('h3').textContent;
            reviewsObj.description = item.querySelector('p').textContent;
            reviewsObj.date = getDate(item.querySelector('.author i').textContent);
            reviewsArr.push(reviewsObj);
        }
        return reviewsArr;
    }
    return {
        meta: {
            "language": lang,
            "title": title,
            "keywords": keywords(),
            "description": description,
            "opengraph": opengraph()
        },
        product: {
            "id": dataId,
            "name": productTitle,
            "isLiked": isLiked(),
            "tags": tags(),
            "price": price(),
            "oldPrice": oldPrice(),
            "currency": currency(),
            "discount": discount(),
            "discountPercent": discountPercent(),
            "properties": properties(),
            "description": productDescription,
            "images": images()
        },
        suggested: suggested(),
        reviews: reviews()
    };
}

window.parsePage = parsePage;