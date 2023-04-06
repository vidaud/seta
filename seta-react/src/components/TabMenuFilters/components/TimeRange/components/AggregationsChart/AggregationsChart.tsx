import { useEffect, useState, useContext } from 'react'
import { Chart } from 'primereact/chart'

import { SearchContext } from '../../../../../../context/search-context'
import type Search from '../../../../../../types/search'

interface Model {
  labels: string[]
  datasets: {
    label: string
    backgroundColor: string
    data: string[]
  }[]
}

const AggregationsChart = () => {
  const [basicData, setBasicData] = useState<Model>()
  const { aggregations } = useContext(SearchContext) as Search

  useEffect(() => {
    if (aggregations) {
      if (aggregations.years.length > 0 || aggregations.years) {
        const details = {
          labels: Object.keys(aggregations.years),
          datasets: [
            {
              label: 'Documents / Year',
              backgroundColor: '#42A5F5',
              data: Object.values(aggregations.years)
            }
          ]
        }

        setBasicData(details)
      }
    }
  }, [aggregations])

  const getLightTheme = () => {
    const basicOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    }

    const horizontalOptions = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    }

    const stackedOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltips: {
          mode: 'index',
          intersect: false
        },
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    }

    const multiAxisOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        },
        tooltips: {
          mode: 'index',
          intersect: true
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            min: 0,
            max: 10,
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
            color: '#ebedef'
          },
          ticks: {
            min: 0,
            max: 10,
            color: '#495057'
          }
        }
      }
    }

    return {
      basicOptions,
      horizontalOptions,
      stackedOptions,
      multiAxisOptions
    }
  }

  const { basicOptions } = getLightTheme()

  return (
    <div>
      <div className="card">
        <Chart type="bar" data={basicData} options={basicOptions} />
      </div>
    </div>
  )
}

export default AggregationsChart
