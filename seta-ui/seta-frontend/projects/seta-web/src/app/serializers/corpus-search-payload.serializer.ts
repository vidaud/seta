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
    if (resource.termCorpus && resource.termCorpus.length > 0) {
      searchPayload = searchPayload + `\"term\": ${JSON.stringify(resource.getSelectedTerms(resource.termCorpus))},`
      // searchPayload = searchPayload + `\"term\": \"${encodeURIComponent(resource.getSelectedTerms(resource.termCorpus))}\",`
    }
    if (resource.source && resource.source.length > 0) {
      searchPayload = searchPayload + `\"source\": ${JSON.stringify(resource.source)},`
    }
    if (resource.ndocs) {
      searchPayload = searchPayload + `\"n_docs\": ${resource.ndocs},`
    }
    if (resource.from_doc) {
      searchPayload = searchPayload + `\"from_doc\": ${resource.from_doc},`
    }
    if (resource.sector && resource.sector.size > 0) {
      searchPayload = searchPayload + `\"sector\": ${JSON.stringify(Array.from(resource.sector))},`
    }
    if (resource.subject && resource.subject.length > 0) {
      searchPayload = searchPayload + `\"subject\": ${JSON.stringify(resource.subject)},`
    }
    if (resource.res_type && resource.res_type.size > 0) {
      searchPayload = searchPayload + `\"res_type\": ${JSON.stringify(Array.from(resource.res_type))},`
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
    if (resource.conc_dir_1 && resource.conc_dir_1.length > 0) {
      searchPayload = searchPayload + `\"conc_dir_1\": ${JSON.stringify(resource.conc_dir_1)},`
    }
    if (resource.conc_dir_2 && resource.conc_dir_2.length > 0) {
      searchPayload = searchPayload + `\"conc_dir_2\": ${JSON.stringify(resource.conc_dir_2)},`
    }
    if (resource.conc_dir_3 && resource.conc_dir_3.length > 0) {
      searchPayload = searchPayload + `\"conc_dir_3\": ${JSON.stringify(resource.conc_dir_3)},`
    }
    if (resource.info_force) {
      searchPayload = searchPayload + `\"info_force\": ${resource.info_force},`
    }
    if (resource.sort && resource.sort.length > 0) {
      searchPayload = searchPayload + `\"sort\": ${JSON.stringify(resource.sort)},`
    }
    if (resource.semantic_sort_id && resource.semantic_sort_id !== '') {
      searchPayload = searchPayload + `\"semantic_sort_id\": \"${resource.semantic_sort_id}\",`
    }
    if (resource.vector && resource.vector.length > 0) {
      searchPayload = searchPayload + `\"emb_vector\":  ${JSON.stringify(resource.vector)},`
    }
    if (resource.date_range && resource.date_range.length > 0) {
      searchPayload = searchPayload + `\"date_range\": ${JSON.stringify(resource.date_range)},`
    }

    searchPayload = searchPayload.replace(/.$/, "")

    return searchPayload + '}'
  }

}