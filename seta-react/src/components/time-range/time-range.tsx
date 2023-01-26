import { useState } from 'react';
import { Slider } from 'primereact/slider';
import { Checkbox } from 'primereact/checkbox';
import './style.css';
import { CorpusSearchPayload } from '../../store/corpus-search-payload';
import { CorpusService } from '../../services/corpus/corpus.service';
import { Observable } from 'rxjs';

const TimeRange = () => {
    const [range, setRange] = useState<any>([1958,2023]);
    const [checked, setChecked] = useState<boolean>(false);
    const [items, setItems] = useState<any>([]);
    const corpusService = new CorpusService();
    let corpusParameters$: Observable<CorpusSearchPayload>;
    let cp: CorpusSearchPayload;

    const onChangeTimeRange = (e) => {
        setRange(e.value);
        const lastPayload = new CorpusSearchPayload({ ...cp, date_range: e.value, aggs: 'date_year', n_docs: 100 });
        corpusService.getDocuments(lastPayload).then(data => setItems(data));
    }
    return (
        <div className="slider-demo">
            <h5>Time Range</h5>
            <div className="field-checkbox">
                <Checkbox inputId="include_zero" checked={checked} onChange={e => setChecked(e.checked)} />
                <label htmlFor="include_zero">Include 0</label>
            </div>
            <div className="p-slider-horizontal">
                <div className="left-range">{range[0]}</div>  
                <div className="right-range">{range[1]}</div>
            </div>
            <Slider value={range} min={1958} max={2023} onChange={onChangeTimeRange} range />
        </div>
    );
}

export default TimeRange;