import Img1 from '../images/img1.jpg';
import Img2 from '../images/img2.jpg';
import Img3 from '../images/img3.jpg';

export class CarouselService {
    getImagesData() {
        return [
            {
                description: ' The Problem',
                image: Img1
            },
            {
                description: 'The Challenge',
                image: Img2
            },
            {   description: 'The solution',
                image: Img3
            }
        ];
    }
    getImages() {
        return Promise.resolve(this.getImagesData());
    }
};
