from seta_api.infrastructure.utils.embeddings import Embeddings
from seta_api.infrastructure.helpers import is_field_in_doc
from seta_api.infrastructure.ApiLogicError import ApiLogicError

from nltk.tokenize import word_tokenize
from nltk.text import ConcordanceIndex
import re

from .corpus_build import build_corpus_request

def docbyid(doc_id, current_app):
    try:
        q = current_app.es.get(index=current_app.config['INDEX_PUBLIC'], id=doc_id)
        doc = q['_source']
        return doc
    except:
        raise ApiLogicError('ID not found.')
    
def delete_doc(id, current_app):
    try:
        current_app.es.delete(index=current_app.config['INDEX_PUBLIC'], id=id)
    except:
        raise ApiLogicError("id not found")

def insert_doc(args, current_app):
    new_doc = {}
    new_doc["id"] = is_field_in_doc(args, "id")
    new_doc["id_alias"] = is_field_in_doc(args, "id_alias")
    new_doc["source"] = is_field_in_doc(args, "source")
    new_doc["title"] = is_field_in_doc(args, "title")
    new_doc["abstract"] = is_field_in_doc(args, "abstract")
    new_doc["collection"] = is_field_in_doc(args, "collection")
    new_doc["reference"] = is_field_in_doc(args, "reference")
    new_doc["author"] = is_field_in_doc(args, "author")
    new_doc["date"] = is_field_in_doc(args, "date")
    new_doc["link_origin"] = is_field_in_doc(args, "link_origin")
    new_doc["link_alias"] = is_field_in_doc(args, "link_alias")
    new_doc["link_related"] = is_field_in_doc(args, "link_related")
    new_doc["link_reference"] = is_field_in_doc(args, "link_reference")
    new_doc["mime_type"] = is_field_in_doc(args, "mime_type")
    new_doc["in_force"] = is_field_in_doc(args, "in_force")
    new_doc["language"] = is_field_in_doc(args, "language")
    new_doc["eurovoc_concept"] = is_field_in_doc(args, "eurovoc_concept")
    new_doc["eurovoc_domain"] = is_field_in_doc(args, "eurovoc_domain")
    new_doc["eurovoc_mth"] = is_field_in_doc(args, "eurovoc_mth")
    new_doc["ec_priority"] = is_field_in_doc(args, "ec_priority")
    new_doc["sdg_domain"] = is_field_in_doc(args, "sdg_domain")
    new_doc["sdg_subdomain"] = is_field_in_doc(args, "sdg_subdomain")
    new_doc["euro_sci_voc"] = is_field_in_doc(args, "euro_sci_voc")
    new_doc["other"] = is_field_in_doc(args, "other")
    new_doc["keywords"] = is_field_in_doc(args, "keywords")

    index = current_app.config["INDEX_PUBLIC"]
    res = current_app.es.index(index=index, document=new_doc)
    doc_id = res["_id"]
    embs = Embeddings.embeddings_from_doc_fields(args["title"], args["abstract"], args["text"])
    first = True
    for emb in embs:
        if first:
            update_fields = {"chunk_text": emb["text"], "document_id": doc_id, "chunk_number": emb["chunk"],
                             "sbert_embedding": emb["vector"]}
            current_app.es.update(index=index, id=doc_id, doc=update_fields)
            first = False
        else:
            new_doc["chunk_text"] = emb["text"]
            new_doc["document_id"] = doc_id
            new_doc["chunk_number"] = emb["chunk"]
            new_doc["sbert_embedding"] = emb["vector"]
            current_app.es.index(index=index, document=new_doc)

    return doc_id


def corpus(term, n_docs, from_doc, sources, collection, reference, eurovoc_concept, eurovoc_dom, eurovoc_mth,
           ec_priority, sdg_domain, sdg_subdomain, euro_sci_voc, in_force, sort, semantic_sort_id, emb_vector,
           semantic_sort_id_list, emb_vector_list, author, date_range, aggs, search_type, other, current_app):
    
    if search_type is None or search_type not in current_app.config["SEARCH_TYPES"]:
        search_type = "CHUNK_SEARCH"
        
    documents = {"total_docs": None, "documents": []}
    list_of_aggs_fields = ["source", "eurovoc_concept","date_year"]
    
    if aggs and (aggs not in list_of_aggs_fields):
        raise ApiLogicError('Malformed query. Wrong aggs parameter')

    body = build_corpus_request(term, n_docs, from_doc, sources, collection, reference, eurovoc_concept, eurovoc_dom,
                                eurovoc_mth, ec_priority, sdg_domain, sdg_subdomain, euro_sci_voc, in_force, sort,
                                semantic_sort_id, emb_vector, semantic_sort_id_list, emb_vector_list, author,
                                date_range, aggs, search_type, other, current_app)
    current_app.logger.debug(str(body))
    res = current_app.es.msearch(searches=body)
    for k in res["responses"]:
        if "error" in k:
            raise ApiLogicError('Malformed query.')
        if search_type == "DOCUMENT_SEARCH" or search_type == "ALL_CHUNKS_SEARCH":
            documents["total_docs"] = k['hits']['total']['value']
        elif search_type == "CHUNK_SEARCH":
            documents["total_docs"] = k['aggregations']['total']['value']
        if aggs:
            if aggs =="date_year":
               if not ("aggregations" in documents):
                 documents["aggregations"] = {}
               ks = k["aggregations"]["years"]["buckets"]
               documents["aggregations"]["years"] = {}
               for kt in ks:
                 documents["aggregations"]["years"][kt["key_as_string"]] = kt["doc_count"]
            else:
               documents["aggregations"] = k["aggregations"][aggs]["buckets"]
        for document in k["hits"]["hits"]:
            abstract = document['_source']['abstract'] if isinstance(document['_source']['abstract'], str) else ""
            text = is_field_in_doc(document['_source'], "chunk_text")
            concordance = []
            terms = []
            if term:
                terms = toTermList(term)
            if abstract and term:
                concordance = getConcordance(abstract, terms, 100, 100)
            if text and term:
                concordance = concordance + getConcordance(text, terms, 100, 100)
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
                                           "eurovoc_concept": is_field_in_doc(document['_source'], "eurovoc_concept"),
                                           #"eurovoc_dom": is_field_in_doc(document['_source'], "eurovoc_domain"),
                                           #"eurovoc_mth": is_field_in_doc(document['_source'], "eurovoc_mth"),
                                           "ec_priority": is_field_in_doc(document['_source'], "ec_priority"),
                                           "sdg_domain": is_field_in_doc(document['_source'], "sdg_domain"),
                                           "sdg_subdomain": is_field_in_doc(document['_source'], "sdg_subdomain"),
                                           "euro_sci_voc": is_field_in_doc(document['_source'], "euro_sci_voc"),
                                           "keywords": is_field_in_doc(document['_source'], "keywords"),
                                           "other": is_field_in_doc(document['_source'], "other"),
                                           "concordance": concordance})
    return documents

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
                #TODO: review logic
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

def toTermList(term):
    ts = term.replace('(', '').replace(')', '').replace(' ', '_').replace('_AND_', ' ').replace('_OR_', ' ').split(' ')
    return [t.replace('_', ' ').strip("\"") for t in ts]
