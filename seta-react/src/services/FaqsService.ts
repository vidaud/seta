import jsonFaqs from '../pages/faqs/faqs.json'

export class FaqsService {
    getTreeNodes() {
        let test = jsonFaqs.root
        return test;
    }
        
};
