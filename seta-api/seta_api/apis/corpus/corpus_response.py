from seta_api.infrastructure.helpers import is_field_in_doc
from seta_api.infrastructure.ApiLogicError import ApiLogicError

from nltk.tokenize import word_tokenize
from nltk.text import ConcordanceIndex
import re
from seta_api.apis.corpus import taxonomy


def handle_corpus_response(aggs, res, search_type, semantic_sort_id, term, current_app):
    documents = {"total_docs": None, "documents": []}
    for response in res["responses"]:
        if "error" in response:
            raise ApiLogicError('Malformed query.')
        documents["total_docs"] = retrieve_total_number(response, search_type)
        documents = handle_aggs_response(aggs, response, documents, current_app)
        for document in response["hits"]["hits"]:
            abstract = document['_source']['abstract'] if isinstance(document['_source']['abstract'], str) else ""
            text = is_field_in_doc(document['_source'], "chunk_text")
            concordance_field = compute_concordance(abstract, term, text)
            if document['_id'] == semantic_sort_id:
                # for semantic sort the semantic_sort_id document is shown on top page and must be removed from the list
                continue
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
                                           "score": document['_score'],
                                           "language": is_field_in_doc(document['_source'], "language"),
                                           "in_force": is_field_in_doc(document['_source'], "in_force"),
                                           "collection": is_field_in_doc(document['_source'], "collection"),
                                           "reference": is_field_in_doc(document['_source'], "reference"),
                                           "author": is_field_in_doc(document['_source'], "author"),
                                           "taxonomy": is_field_in_doc(document['_source'], "taxonomy"),
                                           "keywords": is_field_in_doc(document['_source'], "keywords"),
                                           "other": is_field_in_doc(document['_source'], "other"),
                                           "concordance": concordance_field})
    return documents


def retrieve_total_number(response, search_type):
    if search_type == "DOCUMENT_SEARCH" or search_type == "ALL_CHUNKS_SEARCH":
        return response['hits']['total']['value']
    elif search_type == "CHUNK_SEARCH":
        return response['aggregations']['total']['value']


def compose_source_collection_reference_response_tree(response_buckets):
    aggregation = {}
    for item in response_buckets:
        s = item["key"][0]
        c = item["key"][1]
        r = item["key"][2]
        if s not in aggregation:
            aggregation[s] = {"doc_count": item["doc_count"], "collections": {}}
            aggregation[s]["collections"][c] = {"doc_count": item["doc_count"], "references": {}}
            aggregation[s]["collections"][c]["references"][r] = {"doc_count": item["doc_count"]}
        else:
            aggregation[s]["doc_count"] += item["doc_count"]
            if c not in aggregation[s]["collections"]:
                aggregation[s]["collections"][c] = {"doc_count": item["doc_count"], "references": {}}
                aggregation[s]["collections"][c]["references"][r] = {"doc_count": item["doc_count"]}
            else:
                aggregation[s]["collections"][c]["doc_count"] += item["doc_count"]
                if r not in aggregation[s]["collections"][c]["references"]:
                    aggregation[s]["collections"][c]["references"][r] = {"doc_count": item["doc_count"]}
                else:
                    aggregation[s]["collections"][c]["references"][r]["doc_count"] += item["doc_count"]

    tree = {"sources": []}
    for s in aggregation:
        source = {"key": s, "doc_count": aggregation[s]["doc_count"], "collections": []}
        for c in aggregation[s]["collections"]:
            collection = {"key": c, "doc_count": aggregation[s]["collections"][c]["doc_count"], "references": []}
            for r in aggregation[s]["collections"][c]["references"]:
                reference = {"key": r, "doc_count": aggregation[s]["collections"][c]["references"][r]["doc_count"]}
                collection["references"].append(reference)
            source["collections"].append(collection)
        tree["sources"].append(source)
    return tree


def compose_taxonomy_response_tree(response_buckets, aggs, current_app):
    taxonomy_arg = aggs.split(":")[1]
    tax = taxonomy.Taxonomy(es=current_app.es, index=current_app.config["INDEX"], taxonomy=taxonomy_arg)
    for item in response_buckets:
        if item["key"].startswith(taxonomy_arg):
            tax.add_tree(tax.tree, item, key="key", separator=":")
    return tax.tree


def handle_aggs_response(aggs, response, documents, current_app):
    if not aggs:
        return documents
    documents["aggregations"] = {}
    for agg in aggs:
        if agg == "date_year":
            years = response["aggregations"]["years"]["buckets"]
            documents["aggregations"][agg] = []
            for year in years:
                y = {"year": year["key_as_string"], "doc_count": year["doc_count"]}
                documents["aggregations"][agg].append(y)
        elif agg == "source_collection_reference":
            documents["aggregations"][agg] = compose_source_collection_reference_response_tree(response["aggregations"][agg]["buckets"])
        elif agg.startswith("taxonomy:"):
            documents["aggregations"]["taxonomy"] = compose_taxonomy_response_tree(response["aggregations"]["taxonomy"]["buckets"], agg, current_app)
        else:
            documents["aggregations"][agg] = response["aggregations"][agg]["buckets"]
    return documents


def compute_concordance(abstract, term, text):
    concor = []
    terms = []
    if term:
        terms = toTermList(term)
    if abstract and term:
        concor = getConcordance(abstract, terms, 100, 100)
    if text and term:
        concor = concor + getConcordance(text, terms, 100, 100)
    return concor


def toTermList(term):
    ts = term.replace('(', '').replace(')', '').replace(' ', '_').replace('_AND_', ' ').replace('_OR_', ' ').split(' ')
    return [t.replace('_', ' ').strip("\"") for t in ts]


def getConcordance(text="", phrases=[], width=150, lines=25):  # lines=0 is unlimited number of concordance lines
    mlen = 0
    for p in phrases:
        if mlen < len(p):
            mlen = len(p)
    tokens = word_tokenize(text)
    concInd = ConcordanceIndex(tokens, (lambda s: s.lower()))
    concs = []
    for phrase in phrases:
        conc = concordance(concInd, phrase, width, lines, mlen)
        for i in conc:
            concs.append(i)
    return concs


def concordance(ci, phrase, width=150, lines=25, width_add=10):
    """
    Rewrite of nltk.text.ConcordanceIndex.print_concordance that returns results
    instead of printing them. And accepts phrases.

    See:
    http://www.nltk.org/api/nltk.html#nltk.text.ConcordanceIndex.print_concordance
    """
    ptokens = word_tokenize(phrase.lower())
    context = width // 4  # approx number of words of context

    results = []
    plen = len(ptokens)
    tlen = len(ci._tokens)
    offsets = ci.offsets(ptokens[0])

    if offsets:
        phrase = []
        if lines != 0:
            lines = min(lines, len(offsets))
        else:
            lines = len(offsets)
        for i in offsets:
            if lines <= 0:
                break
            ii = 0
            for y in range(plen):
                # TODO: review logic
                if (tlen <= i + y) or (plen <= y):
                    print(f"concordance for y in range(plen) break on tlen:{tlen}, plen:{plen}, y:{y}, i:{i}")
                    break

                if ci._tokens[i + y].lower() == ptokens[y]:
                    if y + 1 == plen:
                        if i - context < 0:
                            left = (' ' * width +
                                    detokenize(ci._tokens[0:i]))
                        else:
                            left = (' ' * width +
                                    detokenize(ci._tokens[i - context:i]))
                        if i + y + context > tlen:
                            right = detokenize(ci._tokens[i + 1 + y:tlen])
                        else:
                            right = detokenize(ci._tokens[i + 1 + y:i + y + context])
                        left = left[-width:]
                        right = right[:width + +width_add]
                        ph = detokenize(ci._tokens[i:i + y + 1])
                        line = (left, ph, right)
                        #                        line = '%s <em>%s</em> %s' % (left, ph, right)
                        #                        line = line[:((2*width)+width_add)]
                        results.append(line)
                        lines -= 1
                else:
                    break
    return results


def detokenize(words):
    """
    Untokenizing a text undoes the tokenizing operation, restoring
    punctuation and spaces to the places that people expect them to be.
    Ideally, `untokenize(tokenize(text))` should be identical to `text`,
    except for line breaks.
    """
    text = ' '.join(words)
    step1 = text.replace("`` ", '"').replace(" ''", '"').replace('. . .', '...')
    step2 = step1.replace(" ( ", " (").replace(" ) ", ") ")
    step3 = re.sub(r' ([.,:;?!%]+)([ \'"`])', r"\1\2", step2)
    step4 = re.sub(r' ([.,:;?!%]+)$', r"\1", step3)
    step5 = step4.replace(" '", "'").replace(" n't", "n't").replace(
        "can not", "cannot")
    step6 = step5.replace(" ` ", " '")
    return step6.strip()
