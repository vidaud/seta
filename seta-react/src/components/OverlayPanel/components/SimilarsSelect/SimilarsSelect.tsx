import { useEffect, useRef } from 'react'
import { SelectButton } from 'primereact/selectbutton'

import './style.css'
import { useSearchContext } from '../../../../context/search-context'
import { getSelectedTerms, isPhrase } from '../../../../pages/SearchPage/constants'
import { SimilarsService } from '../../../../services/corpus/similars.service'

export const SimilarsSelect = () => {
  const searchContext = useSearchContext()
  const prevTermRef = useRef()

  const similarService = new SimilarsService()

  useEffect(() => {
    similarService.retrieveSimilars(searchContext?.inputText).then(data => {
      if (data && data.length > 0) {
        const list: any = []

        data.forEach(element => {
          list.push(element.similar_word)
        })

        searchContext?.setSimilarTerms(list)
      }
    })

    toggleEnrichQuery(searchContext?.enrichButton)

    if (searchContext?.selectAll) {
      selectAllTerms(searchContext?.similarTerms)
    } else {
      selectAllTerms([])
    }
  }, [])

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

              searchContext?.setSimilarTerms(list)
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

      const splitedANDOperator = getSelectedTerms(searchContext?.listOFTerms).split(` AND `)
      const splitedOROperator: any = []

      splitedANDOperator.forEach(element => {
        const hasBrackets = regExp.test(element)

        if (hasBrackets) {
          const removedBrackets = element.slice(1, element.length - 1).split(' OR ')

          splitedOROperator.push(getSimilarsTerms(removedBrackets))
        } else {
          splitedOROperator.push(getSimilarsTerms(element.split(' OR ')))
        }

        searchContext?.setSimilarsList(splitedOROperator)
      })
    }
  }

  const selectAllTerms = selectedNodes => {
    const listOfTerms: any = []

    if (prevTermRef.current === null) {
      prevTermRef.current = searchContext?.term
    }

    if (selectedNodes.length > 0) {
      selectedNodes.forEach(item => {
        listOfTerms.push(item)
      })

      const uniqueTerms = listOfTerms.filter((subject, index) => {
        return listOfTerms.indexOf(subject) === index
      })

      searchContext?.setSimilarValues(uniqueTerms)
      transformPhrases(uniqueTerms)
    }

    if (selectedNodes.length === 0) {
      searchContext?.setSimilarValues(listOfTerms)
      searchContext?.setTerm(prevTermRef.current)
    }
  }

  const transformPhrases = terms => {
    const listOfValues: any = []
    let result = searchContext?.term

    terms.forEach(item => {
      isPhrase(item) ? listOfValues.push(`"${item}"`) : listOfValues.push(item)
    })

    if (!searchContext?.enrichButton) {
      const copyTerm = String(listOfValues).split(',').join(' OR ')

      searchContext?.setCopyQuery(copyTerm)
    } else if (searchContext?.enrichButton) {
      // updateEnrichedQuery(similarsList, ontologyListItems)
    }

    result = result + ' ' + listOfValues.join(' ')
    searchContext?.setTerm(result)
  }

  return (
    <SelectButton
      value={searchContext?.similarValues}
      className="suggestions-list"
      onChange={e => {
        selectAllTerms(e.value)
      }}
      options={searchContext?.similarTerms}
      multiple={true}
    />
  )
}

export default SimilarsSelect
