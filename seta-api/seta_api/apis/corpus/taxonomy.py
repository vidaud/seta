from seta_api.infrastructure.ApiLogicError import ApiLogicError


def get_parent_index(parent, tax_name):
    return [p["name_in_path"] for p in parent].index(tax_name)


def fill_taxonomy_fields(name_in_path, es, index, taxonomy):
    query = {"nested": {"path": "taxonomy",
                        "inner_hits": {
                            "_source": [
                                "taxonomy.classifier",
                                "taxonomy.code",
                                "taxonomy.label",
                                "taxonomy.longLabel",
                                "taxonomy.name_in_path",
                                "taxonomy.name"
                            ]},
                        "query": {"bool": {"must": [{"match": {"taxonomy.name": taxonomy}},
                                                    {"match": {"taxonomy.name_in_path": name_in_path}}]}}
                        }
             }
    try:
        response = es.search(index=index, query=query, _source=["document_id"], size=1)
    except:
        raise ApiLogicError('Taxonomy not found.')
    if response["hits"]["total"]["value"] == 0:
        raise ApiLogicError('Taxonomy not found.')
    fields = {}
    for res in response["hits"]["hits"]:
        for h in res["inner_hits"]["taxonomy"]["hits"]["hits"]:
            fields["code"] = h["_source"]["code"]
            fields["classifier"] = h["_source"]["classifier"]
            fields["label"] = h["_source"]["label"]
            fields["longLabel"] = h["_source"]["longLabel"]
    return fields


class Taxonomy:

    def __init__(self, es, index, taxonomy):
        self.tree = []
        self.es = es
        self.index = index
        self.taxonomy = taxonomy

    def add_single_category(self, parent, tax, doc_count):
        if tax not in [p["name_in_path"] for p in parent]:
            if tax == self.taxonomy:
                parent.append({"name": tax, "name_in_path": tax, "doc_count": doc_count, "subcategories": []})
            else:
                t = fill_taxonomy_fields(tax, self.es, self.index, self.taxonomy)
                parent.append({"name_in_path": tax, "doc_count": doc_count, "code": t["code"], "classifier": t["classifier"],
                               "label": t["label"], "longLabel": t["longLabel"], "subcategories": []})

    def add_tree(self, parent, tax_path, key="key", separator=":"):
        split_tree = tax_path[key].split(separator)
        while len(split_tree) > 1:
            self.add_single_category(parent, split_tree[0], None)
            parent = parent[get_parent_index(parent, split_tree[0])]["subcategories"]
            split_tree = split_tree[1:]

        self.add_single_category(parent, split_tree[0], tax_path["doc_count"])
