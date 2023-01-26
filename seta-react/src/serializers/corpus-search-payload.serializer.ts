import { CorpusSearchPayload } from "../store/corpus-search-payload";
import { Serializer } from "./serializer.interface";

export class CorpusSearchPayloadSerializer implements Serializer {


  fromJson(json: any): CorpusSearchPayload {
    throw new Error("Method not implemented.");
  }
  toJson(resource: CorpusSearchPayload): string {
    let searchPayload = '{'
    if (resource.id) {
      searchPayload = searchPayload + `"id": ${resource.id},`
    }
    if (resource.term && resource.term.length > 0) {
      searchPayload = searchPayload + `\"term\": ${JSON.stringify(resource.getSelectedTerms(resource.term))},`
      // searchPayload = searchPayload + `\"term\": \"${encodeURIComponent(resource.getSelectedTerms(resource.term))}\",`
    }
    if (resource.n_docs) {
      searchPayload = searchPayload + `\"n_docs\": ${resource.n_docs},`
    }
    if (resource.from_doc) {
      searchPayload = searchPayload + `\"from_doc\": ${resource.from_doc},`
    }
    if (resource.search_type && resource.search_type !== '') {
      searchPayload = searchPayload + `\"search_type\": \"${resource.search_type}\",`
    }
    if (resource.source && resource.source.length > 0) {
      searchPayload = searchPayload + `\"source\": ${JSON.stringify(resource.source)},`
    }
    if (resource.reference && resource.reference.size > 0) {
      searchPayload = searchPayload + `\"reference\": ${JSON.stringify(resource.reference)},`
    }
    if (resource.collection && resource.collection.size > 0) {
      searchPayload = searchPayload + `\"collection\": ${JSON.stringify(resource.collection)},`
    }
    if (resource.eurovoc_dom && resource.eurovoc_dom.length > 0) {
      searchPayload = searchPayload + `\"eurovoc_dom\": ${JSON.stringify(resource.eurovoc_dom)},`
    }
    if (resource.eurovoc_mth && resource.eurovoc_mth.length > 0) {
      searchPayload = searchPayload + `\"eurovoc_mth\": ${JSON.stringify(resource.eurovoc_mth)},`
    }
    if (resource.eurovoc_tt && resource.eurovoc_tt.length > 0) {
      searchPayload = searchPayload + `\"eurovoc_tt\": ${JSON.stringify(resource.eurovoc_tt)},`
    }
    if (resource.eurovoc_concept && resource.eurovoc_concept.length > 0) {
      searchPayload = searchPayload + `\"eurovoc_concept\": ${JSON.stringify(resource.eurovoc_concept)},`
    }
    if (resource.ec_priority && resource.ec_priority.length > 0) {
      searchPayload = searchPayload + `\"ec_priority\": ${JSON.stringify(resource.ec_priority)},`
    }
    if (resource.sdg_domain && resource.sdg_domain.length > 0) {
      searchPayload = searchPayload + `\"sdg_domain\": ${JSON.stringify(resource.sdg_domain)},`
    }
    if (resource.sdg_subdomain && resource.sdg_subdomain.length > 0) {
      searchPayload = searchPayload + `\"sdg_subdomain\": ${JSON.stringify(resource.sdg_subdomain)},`
    }
    if (resource.euro_sci_voc && resource.euro_sci_voc.length > 0) {
      searchPayload = searchPayload + `\"euro_sci_voc\": ${JSON.stringify(resource.euro_sci_voc)},`
    }
    if (resource.in_force) {
      searchPayload = searchPayload + `\"in_force\": ${resource.in_force},`
    }
    if (resource.sort && resource.sort.length > 0) {
      searchPayload = searchPayload + `\"sort\": ${JSON.stringify(resource.sort)},`
    }
    if (resource.semantic_sort_id && resource.semantic_sort_id !== '') {
      searchPayload = searchPayload + `\"semantic_sort_id\": \"${resource.semantic_sort_id}\",`
    }
    if (resource.vector && resource.vector.length > 0) {
      searchPayload = searchPayload + `\"sbert_embedding\":  ${JSON.stringify(resource.vector)},`
    }
    if (resource.date_range && resource.date_range.length > 0) {
      searchPayload = searchPayload + `\"date_range\": ${JSON.stringify(resource.date_range)},`
    }
    if (resource.aggs && resource.aggs !== '') {
      searchPayload = searchPayload + `\"aggs\": \"${resource.aggs}\",`
    }
    searchPayload = searchPayload.replace(/.$/, "")

    return searchPayload + '}'
  }

}