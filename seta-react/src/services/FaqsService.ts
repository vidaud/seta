import Img1 from '../images/img1.jpg';
import Img2 from '../images/img2.jpg';
import Img3 from '../images/img3.jpg';
import login from '../../images/login.jpg'
import cols from '../../images/columns_choice.jpg'
import profile from '../../images/profile.jpg'
import score from '../../images/score.jpg'
import upload_scr from '../../images/upload_screen.jpg'
import upload from '../../images/upload.jpg'
import year from '../../images/year.jpg'
import concepts from '../../images/concepts.jpg'
import docMap from '../../images/doc_map.jpg'
import results from '../../images/results.jpg'
import searchBox from '../../images/search_box.jpg'
import searchMenu from '../../images/search_menu.jpg'
import refineSearch from '../../images/refine_search.jpg'
import postSearch from '../../images/post_search.jpg'
import profSettings from '../../images/profile_settings.jpg'
import refineSearchFilters from '../../images/refineSearchFilters.jpg'
import jsonFaqs from '../pages/faqs/faqs.json'

export class FaqsService {
    getFaqsData() {
        return jsonFaqs;
    }
};
