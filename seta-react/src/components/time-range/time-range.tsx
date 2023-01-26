import { useState } from 'react';
import { Slider } from 'primereact/slider';
import { Checkbox } from 'primereact/checkbox';
import './style.css';
import AggregationsChart from '../aggregations-chart/aggregations-chart';

const TimeRange = ({onTimeRange}) => {
    const [range, setRange] = useState<any>([1958,2023]);
    const [checked, setChecked] = useState<boolean>(false);

    const onChangeTimeRange = (e) => {
        setRange(e.value);
        let time = 'gte:'+`${e.value[0]}`+',lte:'+`${e.value[1]}`;
        onTimeRange(time);
        console.log(range)
    }
    return (
        <div className="slider-demo">
            <h5>Time Range</h5>
            <div className="field-checkbox">
                <Checkbox inputId="include_zero" checked={checked} onChange={e => setChecked(e.checked)} />
                <label htmlFor="include_zero">Include 0</label>
            </div>
            <div>
                <AggregationsChart />
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