import json
import re

def build_search_query(search_term, sources, collection, reference, eurovoc_concept, eurovoc_dom, eurovoc_mth,
                       ec_priority, sdg_domain, sdg_subdomain, euro_sci_voc, in_force, author, date_range, search_type, other):
    query = build_search_query_json(search_term)

    metadata_param_blocks = build_metadata_param_blocks(collection, reference, eurovoc_concept, eurovoc_dom,
                                                        eurovoc_mth, ec_priority, sdg_domain, sdg_subdomain,
                                                        euro_sci_voc,
                                                        in_force, author, date_range, sources, search_type, other)

    if len(metadata_param_blocks) > 0:
        if not query:
            query = {"bool": {"must": []}}
        for block in metadata_param_blocks:
            query['bool']['must'].append(block)
    elif not query:
        query = {"match_all": {}}
    return query

def build_metadata_param_blocks(collection, reference, eurovoc_concept, eurovoc_dom, eurovoc_mth,
                                ec_priority, sdg_domain, sdg_subdomain, euro_sci_voc,
                                in_force, author, date_range, sources, search_type, other):
    full_block = []
    if sources:
        or_block = {"bool": {"should": []}}
        for param in sources:
            block = {"match": {"source.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if collection:
        or_block = {"bool": {"should": []}}
        for param in collection:
            block = {"match": {"collection.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if reference:
        for param in reference:
            block = {"match": {"reference.keyword": param}}
            full_block.append(block)
    if eurovoc_concept:
        or_block = {"bool": {"should": []}}
        for param in eurovoc_concept:
            block = {"match": {"eurovoc_concept.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if eurovoc_dom:
        or_block = {"bool": {"should": []}}
        for param in eurovoc_dom:
            block = {"match": {"eurovoc_domain.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if eurovoc_mth:
        or_block = {"bool": {"should": []}}
        for param in eurovoc_mth:
            block = {"match": {"eurovoc_mth.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if ec_priority:
        or_block = {"bool": {"should": []}}
        for param in ec_priority:
            block = {"match": {"ec_priority.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if sdg_domain:
        or_block = {"bool": {"should": []}}
        for param in sdg_domain:
            block = {"match": {"sdg_domain.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if sdg_subdomain:
        or_block = {"bool": {"should": []}}
        for param in sdg_subdomain:
            block = {"match": {"sdg_subdomain.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if euro_sci_voc:
        or_block = {"bool": {"should": []}}
        for param in euro_sci_voc:
            block = {"match": {"euro_sci_voc.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if in_force is not None:
        block = {"match": {"in_force": in_force}}
        full_block.append(block)
    if author:
        or_block = {"bool": {"should": []}}
        for param in author:
            block = {"match": {"author.keyword": param}}
            or_block['bool']['should'].append(block)
        full_block.append(or_block)
    if date_range:
        range_block = {"range": {"date": {}}}
        for param in date_range:
            var = param.split(':')
            range_block["range"]["date"][var[0]] = var[1]
        full_block.append(range_block)
    if search_type == "DOCUMENT_SEARCH":
        block = {"match": {"chunk_number": 1}}
        full_block.append(block)
    if other:
        for oth in other:
            block = {"match": oth}
            full_block.append(block)
    return full_block

def build_search_query_json(search_term):
    if search_term:
        search_term = search_term.replace('/', '\\\/')
        if 'AND' in search_term or 'OR' in search_term:
            search_term = search_term.replace('"', '\\"')
            query_string = '{"bool": {"must": [{"query_string": {"fields": ["title^10","abstract^3","chunk_text"],"query": "' \
                           + search_term + '","type": "phrase" }}]}}'
            
            query = json.loads(query_string)
        else:
            search_term_best, search_term_phrase = parse_search_term(search_term)
            query_string = '{"bool": {"must": [ {"multi_match": {"query": "' + search_term_best + \
                           '","type": "best_fields","fields": ["title^10", "abstract^3", "chunk_text"],' \
                           '"zero_terms_query": "all"}}]}}'
            query = json.loads(query_string)
            phrase_block = []
            if len(search_term_phrase) > 0:
                phrase_block = bluid_search_phrase_block(search_term_phrase)
            if len(phrase_block) > 0:
                for block in phrase_block:
                    query['bool']['must'].append(block)
        return query
    else:
        return None
    
def bluid_search_phrase_block(search_term_phrase):
    full_block = []
    for text in search_term_phrase:
        block = {"multi_match": {
            "query": text,
            "type": "phrase",
            "fields": ["title^10", "abstract^3", "sentences", "chunk_text"],
            "zero_terms_query": "all"
        }}
        full_block.append(block)
    return full_block 

def parse_search_term(search_term):
    phrase = []
    if '"' not in search_term:
        best = search_term
        return best, phrase
    if search_term.count('"') % 2 == 0:
        text = search_term
        search_results = re.finditer(r'\".*?\"', text)
        for item in search_results:
            text = text.replace(item.group(0), '')
            phrase.append(item.group(0).replace('"', ''))
        best = text
        return best, phrase
    else:
        best = search_term
        return best, phrase   
