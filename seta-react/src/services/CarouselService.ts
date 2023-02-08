import Img1 from '../images/img1.jpg';
import Img2 from '../images/img2.jpg';
import Img3 from '../images/img3.jpg';

export class CarouselService {
    getImagesData() {
        return [
            {
                name: 'The Problem',
                description:'Much of the world\'s data is textual – in large document archives, in scientific papers, in scattered websites, in social media. The information contained in text is invaluable and yet hard to access.',
                image: Img1
            },
            {
                name: 'The Challenge',
                description:'The mission of the JRC is to provide scientific support to policy development, through original and applied research and knowledge management. The challenges of accessing information "trapped in text" are very relevant to this mission of the JRC, as timely, relevant information is needed at all stages of the policy development process.',
                image: Img2
            },
            {   name: 'The solution: SeTA',
                description:'To help overcome these challenges, the JRC has produced a new tool, SeTA – Semantic Text Analyser – which applies advanced text analysis techniques to large document collections, helping policy analysts to understand the concepts expressed in thousands of documents and to see in a visual manner the relationships between these concepts and their development over time.',
                image: Img3
            }
        ];
    }
    getImages() {
        return Promise.resolve(this.getImagesData());
    }
};
