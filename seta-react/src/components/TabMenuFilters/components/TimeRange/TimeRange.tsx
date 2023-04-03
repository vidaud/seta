import { Checkbox } from 'primereact/checkbox'
import { Slider } from 'primereact/slider'
import { Tooltip } from 'primereact/tooltip'

import './style.css'

import AggregationsChart from './components/AggregationsChart'

import { useSearchContext } from '../../../../context/search-context'

const TimeRange = () => {
  const searchContext = useSearchContext()

  const onChangeTimeRange = e => {
    searchContext?.setRange(e.value)
    const time = 'gte:' + `${e.value[0]}` + ',lte:' + `${e.value[1]}`

    searchContext?.setTimeRangeValue(time)
  }

  return (
    <div className="slider">
      <h5>Time Range</h5>
      <div className="field-checkbox">
        <Checkbox
          inputId="include_zero"
          checked={searchContext?.includeZero}
          onChange={e => searchContext?.setIncludeZero(e.checked)}
        />
        <label htmlFor="include_zero">Include 0</label>
      </div>
      <Tooltip
        target=".slider>.p-slider-handle"
        content={`[${searchContext?.range[0]}-${searchContext?.range[1]}]`}
        position="top"
        event="focus"
        className="hoverClass"
      />
      <Slider
        className="slider"
        value={searchContext?.range}
        min={1958}
        max={2023}
        onChange={onChangeTimeRange}
        range
      />
      <div className="p-slider-horizontal">
        <div className="left-range">{searchContext?.range[0]}</div>
        <div className="right-range">{searchContext?.range[1]}</div>
      </div>
      <div>
        <AggregationsChart />
      </div>
    </div>
  )
}

export default TimeRange
