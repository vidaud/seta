import { useContext, useState } from 'react'
import { Checkbox } from 'primereact/checkbox'
import { Slider } from 'primereact/slider'
import { Tooltip } from 'primereact/tooltip'

import './style.css'

import AggregationsChart from './components/AggregationsChart'

import { SearchContext } from '../../../../context/search-context'
import type Search from '../../../../types/search'

const TimeRange = () => {
  const { setTimeRangeValue } = useContext(SearchContext) as Search
  const [range, setRange] = useState<any>([1958, 2023])
  const [includeZero, setIncludeZero] = useState<boolean>(false)

  const onChangeTimeRange = e => {
    setRange(e.value)
    const time = 'gte:' + `${e.value[0]}` + ',lte:' + `${e.value[1]}`

    setTimeRangeValue(time)
  }

  return (
    <div className="slider">
      <h5>Time Range</h5>
      <div className="field-checkbox">
        <Checkbox
          inputId="include_zero"
          checked={includeZero}
          onChange={e => setIncludeZero(e.checked)}
        />
        <label htmlFor="include_zero">Include 0</label>
      </div>
      <Tooltip
        target=".slider>.p-slider-handle"
        content={`[${range[0]}-${range[1]}]`}
        position="top"
        event="focus"
        className="hoverClass"
      />
      <Slider
        className="slider"
        value={range}
        min={1958}
        max={2023}
        onChange={onChangeTimeRange}
        range
      />
      <div className="p-slider-horizontal">
        <div className="left-range">{range[0]}</div>
        <div className="right-range">{range[1]}</div>
      </div>
      <div>
        <AggregationsChart />
      </div>
    </div>
  )
}

export default TimeRange
