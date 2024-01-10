from search.infrastructure.helpers import is_field_in_doc
from search.infrastructure.ApiLogicError import ApiLogicError

from search.apis.corpus import taxonomy
import math
import requests


def normalize_es_score(score, semantic_sort_id_list, emb_vector_list):
    if semantic_sort_id_list or emb_vector_list:
        return score
    normalized_score = sigmoid(score)
    return normalized_score


def sigmoid(x):
    return 1 / (1 + math.exp(-x))


def handle_corpus_response(aggs, res, search_type, term, current_app, semantic_sort_id_list, emb_vector_list):
    documents = {"total_docs": None, "documents": []}
    tax = taxonomy.Taxonomy()
    for response in res["responses"]:
        if "error" in response:
            raise ApiLogicError('Malformed query.')
        documents["total_docs"] = retrieve_total_number(response, search_type)
        documents = handle_aggs_response(aggs, response, documents, current_app, search_type)
        for document in response["hits"]["hits"]:
            abstract = document['_source']['abstract'] if isinstance(document['_source']['abstract'], str) else ""
            text = is_field_in_doc(document['_source'], "chunk_text")
            concordance_field = compute_concordance(abstract, term, text, current_app)
            tax.create_tree_from_elasticsearch_format(is_field_in_doc(document['_source'], "taxonomy"),
                                                      is_field_in_doc(document['_source'], "taxonomy_path"))
            documents["documents"].append({"_id": document['_id'],
                                           "id": is_field_in_doc(document['_source'], "id"),
                                           "id_alias": is_field_in_doc(document['_source'], "id_alias"),
                                           "document_id": is_field_in_doc(document['_source'], "document_id"),
                                           "title": is_field_in_doc(document['_source'], "title"),
                                           "abstract": is_field_in_doc(document['_source'], "abstract"),
                                           "chunk_text": text,
                                           "chunk_number": document['_source']["chunk_number"],
                                           "link_origin": document['_source']["link_origin"],
                                           "date": is_field_in_doc(document['_source'], "date"),
                                           "source": document['_source']['source'],
                                           "score": normalize_es_score(document['_score'], semantic_sort_id_list, emb_vector_list),
                                           "language": is_field_in_doc(document['_source'], "language"),
                                           "in_force": is_field_in_doc(document['_source'], "in_force"),
                                           "collection": is_field_in_doc(document['_source'], "collection"),
                                           "reference": is_field_in_doc(document['_source'], "reference"),
                                           "author": is_field_in_doc(document['_source'], "author"),
                                           "taxonomy": tax.tree,
                                           "keywords": is_field_in_doc(document['_source'], "keywords"),
                                           "other": is_field_in_doc(document['_source'], "other"),
                                           "annotation": is_field_in_doc(document['_source'], "annotation"),
                                           "concordance": concordance_field})
    return documents


def retrieve_total_number(response, search_type):
    if search_type == "DOCUMENT_SEARCH" or search_type == "ALL_CHUNKS_SEARCH":
        return response['hits']['total']['value']
    elif search_type == "CHUNK_SEARCH":
        return response['aggregations']['total']['value']


def compose_source_collection_reference_response_tree(response_buckets, current_app, search_type):
    aggregation = {}
    for item in response_buckets:
        s = item["key"][0]
        c = item["key"][1]
        r = item["key"][2]
        if s not in aggregation:
            if search_type == "CHUNK_SEARCH":
                count = item["unique_values"]["value"]
            else:
                count = item["doc_count"]
            aggregation[s] = {"doc_count": count, "collections": {}}
            aggregation[s]["collections"][c] = {"doc_count": count, "references": {}}
            aggregation[s]["collections"][c]["references"][r] = {"doc_count": count}
        else:
            if search_type == "CHUNK_SEARCH":
                count = item["unique_values"]["value"]
            else:
                count = item["doc_count"]
            aggregation[s]["doc_count"] += count
            if c not in aggregation[s]["collections"]:
                aggregation[s]["collections"][c] = {"doc_count": count, "references": {}}
                aggregation[s]["collections"][c]["references"][r] = {"doc_count": count}
            else:
                if search_type == "CHUNK_SEARCH":
                    count = item["unique_values"]["value"]
                else:
                    count = item["doc_count"]
                aggregation[s]["collections"][c]["doc_count"] += count
                if r not in aggregation[s]["collections"][c]["references"]:
                    aggregation[s]["collections"][c]["references"][r] = {"doc_count": count}
                else:
                    aggregation[s]["collections"][c]["references"][r]["doc_count"] += count

    tree = {"sources": []}
    for s in aggregation:
        source = {"key": s, "doc_count": aggregation[s]["doc_count"], "collections": []}
        for c in aggregation[s]["collections"]:
            if c == current_app.config["AGG_MISSING_NAME"]:
                continue
            collection = {"key": c, "doc_count": aggregation[s]["collections"][c]["doc_count"], "references": []}
            for r in aggregation[s]["collections"][c]["references"]:
                if r == current_app.config["AGG_MISSING_NAME"]:
                    continue
                reference = {"key": r, "doc_count": aggregation[s]["collections"][c]["references"][r]["doc_count"]}
                collection["references"].append(reference)
            source["collections"].append(collection)
        tree["sources"].append(source)
    return tree


def compose_response_tree_given_a_taxonomy(response_buckets, aggs, current_app, search_type):
    taxonomy_arg = aggs.split(":")[1]
    tax = taxonomy.Taxonomy()
    tax.create_tree_from_aggregation_given_a_taxonomy(es=current_app.es, index=current_app.config["INDEX"],
                                                      response=response_buckets, taxonomy=taxonomy_arg,
                                                      search_type=search_type)
    return tax.tree


def compose_taxonomies_response_tree(response_buckets, current_app, search_type):
    tax = taxonomy.Taxonomy()
    tax.create_tree_from_aggregation(es=current_app.es, index=current_app.config["INDEX"], response=response_buckets,
                                     search_type=search_type)
    return tax.tree


def handle_aggs_response(aggs, response, documents, current_app, search_type):
    if not aggs:
        return documents
    documents["aggregations"] = {}
    for agg in aggs:
        match agg:
            case "date_year":
                years = response["aggregations"]["years"]["buckets"]
                documents["aggregations"][agg] = []
                for year in years:
                    if search_type == "CHUNK_SEARCH":
                        count = year["unique_values"]["value"]
                    else:
                        count = year["doc_count"]
                    y = {"year": year["key_as_string"], "doc_count": count}
                    documents["aggregations"][agg].append(y)
            case "source_collection_reference":
                documents["aggregations"][agg] = compose_source_collection_reference_response_tree(response["aggregations"][agg]["buckets"], current_app, search_type)
            case agg if agg.startswith("taxonomy:"):
                documents["aggregations"]["taxonomy"] = compose_response_tree_given_a_taxonomy(response["aggregations"]["taxonomy"]["buckets"], agg, current_app, search_type)
            case "taxonomies":
                documents["aggregations"][agg] = compose_taxonomies_response_tree(response["aggregations"]["taxonomies"]["buckets"], current_app, search_type)
            case "source":
                sources = response["aggregations"]["source"]["buckets"]
                documents["aggregations"][agg] = []
                for source in sources:
                    if search_type == "CHUNK_SEARCH":
                        count = source["unique_values"]["value"]
                    else:
                        count = source["doc_count"]
                    y = {"key": source["key"], "doc_count": count}
                    documents["aggregations"][agg].append(y)
            case agg if agg.startswith("taxonomy_path_years-"):
                taxonomy_path = agg.split("-")[1]
                documents["aggregations"]["taxonomy_path_years"] = []
                for path in response["aggregations"]["taxonomy_path_years"]["buckets"]:
                    if path["key"] == taxonomy_path:
                        for year in path["years"]["buckets"]:
                            if search_type == "CHUNK_SEARCH":
                                count = year["unique_values"]["value"]
                            else:
                                count = year["doc_count"]
                            y = {"key": year["key_as_string"], "doc_count": count}
                            documents["aggregations"]["taxonomy_path_years"].append(y)
    return documents


def compute_concordance(abstract, term, text, current_app):
    url = current_app.config.get("NLP_API_ROOT_URL") + "internal/compute_concordance"
    data = {"term": term, "abstract": abstract, "text": text}
    try:
        result = requests.post(url=url, json=data)
    except:
        raise ApiLogicError("nlp compute_concordance api error")
    return result.json()

