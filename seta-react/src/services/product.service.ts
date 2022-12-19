export class ProductService {

    getProductsSmall() {
        return fetch('/corpus').then(res => res.json()).then(d => d.data);
    }

    getProducts() {
        return fetch('/corpus').then(res => res.json()).then(d => d.data);
    }

    getProductsWithOrdersSmall() {
        return fetch('/corpus').then(res => res.json()).then(d => d.data);
    }
}