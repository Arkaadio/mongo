const https = require('https');

const getUrlContent = () => {
    const options = {
        host: 'www.monogo.pl',
        path: '/competition/input.txt',
    }
    const request = https.request(options, function (res) {
        let data = '';
        res.on('data', function (chunk) {
                data += chunk;
        });
        res.on('end', function () {
            handleJson(JSON.parse(data));
        });
    });
    request.on('error', function (e) {
        console.log(e.message);
    });
    request.end();
}

const groupProducts = (json) => {
    const array = json.products.map(pr => {
        return {
            id: pr.id,
            price: pr.price,
            color: json.colors.find(item => Number(item.id) === pr.id).value,
            size: json.sizes.find(item => Number(item.id) === pr.id).value
        }
    });
    return array;
}

const filterProducts = (groupedProducts, filters) => {
    return groupedProducts.filter(pr => filters.sizes.indexOf(pr.size) > -1 && filters.colors.indexOf(pr.color) > -1 && pr.price > 200);
}

const sumCharArr = (arr) => {
    const newArr = [];
    for (let i = 0; i < arr.length; i+=2) {
        newArr.push(Number(arr[i])+Number(arr[i+1]));
    }
    return newArr;
}

const handleJson = (json) => {
    const groupedProducts = groupProducts(json);
    const filteredProducts = filterProducts(groupedProducts, json.selectedFilters);
    const priceMax = Math.max.apply(Math, filteredProducts.map(function(pr) { return pr.price; }));
    const priceMin = Math.min.apply(Math, filteredProducts.map(function(pr) { return pr.price; }));
    const multiplyPrice = Math.round(priceMax*priceMin);
    const charArr = [...String(multiplyPrice)]
    const sumedArr = sumCharArr(charArr);
    const officeIndex = sumedArr.findIndex(item => item === 14);
    const companyLength = 'Monogo'.length;

    const result = officeIndex * multiplyPrice * companyLength;

    console.log('Wynik: ', result);
}

getUrlContent();
