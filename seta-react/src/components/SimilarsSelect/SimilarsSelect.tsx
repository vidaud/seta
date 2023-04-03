import { useEffect, useState, useRef } from 'react'
import { SelectButton } from 'primereact/selectbutton'

import './style.css'
import { getSelectedTerms, isPhrase } from '../../pages/SearchPage/constants'
import { SimilarsService } from '../../services/corpus/similars.service'

export const SimilarsSelect = ({
  current_search,
  text_focused,
  onChangeTerm,
  onChangeSelectAll,
  enrichQueryButton,
  onChangeQuery,
  listofTerms
}) => {
  const [similarValues, setSimilarValues] = useState(null)
  const [similarTerms, setSimilarTerms] = useState<any>(null)
  const [similarsList, setSimilarsList] = useState([])
  const prevTermRef = useRef()

  const similarService = new SimilarsService()

  useEffect(() => {
    similarService.retrieveSimilars(text_focused).then(data => {
      if (data && data.length > 0) {
        const list: any = []

        data.forEach(element => {
          list.push(element.similar_word)
        })

        setSimilarTerms(list)
      }
    })

    toggleEnrichQuery(enrichQueryButton)

    if (onChangeSelectAll) {
      selectAllTerms(similarTerms)
    } else {
      selectAllTerms([])
    }
  }, [similarValues])

  const getSimilarsTerms = lastKeywords => {
    const similarsTermsList: any = []

    lastKeywords.forEach(lastKeyword => {
      similarService.retrieveSimilars(lastKeyword).then(data => {
        if (data) {
          if (data.length > 0) {
            const list: any = []

            if (data && data.length > 0) {
              data.forEach(element => {
                isPhrase(element.similar_word)
                  ? list.push(`"${element.similar_word}"`)
                  : list.push(element.similar_word)
              })

              setSimilarTerms(list)
              similarsTermsList.push(...[list])
            }
          }
        }
      })
    })

    return similarsTermsList
  }

  const toggleEnrichQuery = value => {
    // ex: "(bin) AND (regulation OR guideline) AND (standard)"
    //send request to ontologyList for each keyword
    //send request to corpus with the ontology list of all keywords

    if (value) {
      const regExp = /\(|\)|\[|\]/g

      const splitedANDOperator = getSelectedTerms(listofTerms).split(` AND `)
      const splitedOROperator: any = []

      splitedANDOperator.forEach(element => {
        const hasBrackets = regExp.test(element)

        if (hasBrackets) {
          const removedBrackets = element.slice(1, element.length - 1).split(' OR ')

          splitedOROperator.push(getSimilarsTerms(removedBrackets))
        } else {
          splitedOROperator.push(getSimilarsTerms(element.split(' OR ')))
        }

        setSimilarsList(splitedOROperator)
      })
    }
  }

  const selectAllTerms = selectedNodes => {
    const listOfTerms: any = []

    if (prevTermRef.current === null) {
      prevTermRef.current = current_search
    }

    if (selectedNodes.length > 0) {
      selectedNodes.forEach(item => {
        listOfTerms.push(item)
      })

      const uniqueTerms = listOfTerms.filter((subject, index) => {
        return listOfTerms.indexOf(subject) === index
      })

      setSimilarValues(uniqueTerms)
      transformPhrases(uniqueTerms)
    }

    if (selectedNodes.length === 0) {
      setSimilarValues(listOfTerms)
      onChangeTerm(prevTermRef.current)
    }
  }

  const transformPhrases = terms => {
    const listOfValues: any = []
    let result = current_search

    terms.forEach(item => {
      isPhrase(item) ? listOfValues.push(`"${item}"`) : listOfValues.push(item)
    })

    if (!enrichQueryButton) {
      const copyTerm = String(listOfValues).split(',').join(' OR ')

      onChangeQuery(copyTerm)
    } else if (enrichQueryButton) {
      // updateEnrichedQuery(similarsList, ontologyListItems)
    }

    result = result + ' ' + listOfValues.join(' ')
    onChangeTerm(result)
  }

  return (
    <SelectButton
      value={similarValues}
      className="suggestions-list"
      onChange={e => {
        selectAllTerms(e.value)
      }}
      options={similarTerms}
      multiple={true}
    />
  )
}

export default SimilarsSelect
