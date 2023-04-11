import { useRef, useContext } from 'react'
import { SelectButton } from 'primereact/selectbutton'

import './style.css'
import { SearchContext, useSearchContext } from '../../../../context/search-context'
import type { Term } from '../../../../models/term.model'
import { getListOfTerms, getSelectedTerms, isPhrase } from '../../../../pages/SearchPage/constants'
import { SimilarsService } from '../../../../services/corpus/similars.service'
import type Search from '../../../../types/search'

export const SimilarsSelect = () => {
  const searchContext = useSearchContext()
  const {
    setSimilarTerms,
    term,
    setTerm,
    selectAllTerms,
    callService,
    setCopyQuery,
    enrichQuery,
    listOFTerms,
    setListOFTerms,
    selectedTypeSearch,
    setSimilarsList,
    setSelectAll,
    similarTerms,
    similarsList,
    similarValues,
    setSimilarValues
  } = useContext(SearchContext) as Search
  const prevTermRef = useRef<Term[] | string | undefined>()

  const similarService = new SimilarsService()

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

  searchContext.toggleEnrichQuery = value => {
    // ex: "(bin) AND (regulation OR guideline) AND (standard)"
    //send request to ontologyList for each keyword
    //send request to corpus with the ontology list of all keywords

    if (value) {
      if (!enrichQuery) {
        setListOFTerms(getListOfTerms(String(term)))
        setCopyQuery(getSelectedTerms(listOFTerms))
      }

      const regExp = /\(|\)|\[|\]/g

      const splitedANDOperator = getSelectedTerms(listOFTerms).split(` AND `)
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
    } else {
      callService(selectedTypeSearch.code)
    }
  }

  searchContext.selectAllTerms = selectedNodes => {
    const listOfTerms: any = []

    if (prevTermRef.current === undefined) {
      prevTermRef.current = term
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
      setTerm(prevTermRef.current)
    }

    toggleSelectAll(selectedNodes, similarTerms)
  }

  const toggleSelectAll = (items, allList) => {
    if (items.length === allList.length) {
      setSelectAll(true)
    } else {
      setSelectAll(false)
    }
  }

  const transformPhrases = terms => {
    const listOfValues: any = []
    let result = term

    terms.forEach(item => {
      isPhrase(item) ? listOfValues.push(`"${item}"`) : listOfValues.push(item)
    })

    if (!enrichQuery) {
      const copyTerm = String(listOfValues).split(',').join(' OR ')

      setCopyQuery(copyTerm)
    } else if (enrichQuery) {
      updateEnrichedQuery(similarsList)
    }

    if (prevTermRef.current) {
      result = prevTermRef.current + ' ' + listOfValues.join(' ')
    } else {
      result = listOfValues.join(' ')
    }

    setTerm(result)
  }

  const updateEnrichedQuery = similars => {
    if (selectedTypeSearch.code === 'RT') {
      if (similars.length > 1) {
        const result = similars.join(' AND ').split(',').join(' ')

        setCopyQuery(getSelectedTerms(getListOfTerms(result)))

        return getSelectedTerms(getListOfTerms(result))
      } else if (similars.length === 1 && similars[0].length > 0) {
        const result = similars[0].join(' OR ').split(',').join(' OR ')

        setCopyQuery(result)

        return result
      }
    }
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
