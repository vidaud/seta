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
                                "taxonomy.validated",
                                "taxonomy.name_in_path",
                                "taxonomy.version",
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
            fields["name_in_path"] = h["_source"]["name_in_path"]
            fields["validated"] = h["_source"]["validated"]
            fields["version"] = h["_source"]["version"]
    return fields


def get_field_from_tax(taxonomy, field):
    if field in taxonomy:
        return taxonomy[field]
    else:
        return None
    pass


def read_tree(tree, taxonomies, tax_paths, tax_tree_string, taxonomy_name):
    if "name_in_path" in tree:
        taxonomies.append({
            "code": tree.get("code", None),
            "label": tree.get("label", None),
            "longLabel": tree.get("longLabel", None),
            "validated": tree.get("validated", None),
            "classifier": tree.get("classifier", None),
            "version": tree.get("version", None),
            "name": taxonomy_name,
            "name_in_path": tree["name_in_path"]
        })
        if len(tax_tree_string) > 0:
            tax_tree_string += F":{tree['name_in_path']}"
        else:
            tax_tree_string += tree['name_in_path']

        if "subcategories" in tree:
            # If the list is empty it is a last child
            if len(tree["subcategories"]) == 0:
                # then append finally the complete path to the list
                tax_paths.append(tax_tree_string)
            else:
                # else go to recursion
                for t in tree["subcategories"]:
                    taxonomies, tax_paths = read_tree(t, taxonomies, tax_paths, tax_tree_string, taxonomy_name)
    return taxonomies, tax_paths


def find_and_create_taxonomy(taxonomy_name, tax_to_be_found, taxonomies):
    for t in taxonomies:
        if t["name"] == taxonomy_name and t["name_in_path"] == tax_to_be_found:
            tax_found = {"classifier": t["classifier"], "code": t["code"], "label": t["label"],
                         "longLabel": t["longLabel"], "validated": t["validated"], "version": t["version"],
                         "name_in_path": t["name_in_path"], "subcategories": []}
            return tax_found
    return None

class Taxonomy:

    def __init__(self):
        self.tree = []
        self.aggregation_response_field = "key"
        self.separator = ":"

    def __add_single_category_es(self, parent, tax, taxonomy, taxonomies):
        if tax not in [p["name_in_path"] for p in parent]:
            t = find_and_create_taxonomy(taxonomy, tax, taxonomies)
            parent.append(t)

    def __add_single_category(self, parent, tax, doc_count, es, index, taxonomy):
        if tax not in [p["name_in_path"] for p in parent]:
            t = fill_taxonomy_fields(tax, es, index, taxonomy)
            parent.append({"doc_count": doc_count, "code": t["code"], "classifier": t["classifier"],
                           "label": t["label"], "longLabel": t["longLabel"], "validated": t["validated"],
                           "version": t["version"], "name_in_path": t["name_in_path"], "subcategories": []})

    def __add_tree_from_aggregation_response(self, parent, tax_path, es, index, search_type):
        split_tree = tax_path[self.aggregation_response_field].split(self.separator)
        taxonomy = split_tree[0]
        while len(split_tree) > 1:
            self.__add_single_category(parent, split_tree[0], None, es, index, taxonomy)
            parent = parent[get_parent_index(parent, split_tree[0])]["subcategories"]
            split_tree = split_tree[1:]

        if search_type == "CHUNK_SEARCH":
            count = tax_path["unique_values"]["value"]
        else:
            count = tax_path["doc_count"]
        self.__add_single_category(parent, split_tree[0], count, es, index, taxonomy)

    def __add_tree_from_es_format(self, parent, path, taxonomies):
        split_path = path.split(self.separator)
        taxonomy_name = split_path[0]
        while len(split_path) > 1:
            self.__add_single_category_es(parent, split_path[0], taxonomy_name, taxonomies)
            parent = parent[get_parent_index(parent, split_path[0])]["subcategories"]
            split_path = split_path[1:]
        self.__add_single_category_es(parent, split_path[0], taxonomy_name, taxonomies)

    def create_tree_from_aggregation_given_a_taxonomy(self, es, index, response, taxonomy, search_type):
        for item in response:
            split = item[self.aggregation_response_field].split(self.separator)
            if split[0] == taxonomy:
                self.__add_tree_from_aggregation_response(self.tree, item, es=es, index=index, search_type=search_type)

    def create_tree_from_aggregation(self, es, index, response, search_type):
        for item in response:
            self.__add_tree_from_aggregation_response(self.tree, item, es=es, index=index, search_type=search_type)

    def create_tree_from_elasticsearch_format(self, taxonomies, taxonomy_paths):
        if taxonomies is None or taxonomy_paths is None:
            return []
        try:
            for path in taxonomy_paths:
                self.__add_tree_from_es_format(self.tree, path, taxonomies)
        except:
            self.tree = []

    @staticmethod
    def from_tree_to_elasticsearch_format(json_tree):
        if json_tree is None:
            return [], []
        taxonomies = []
        tax_paths = []
        tax_tree_string = ""
        for tree in json_tree:
            taxonomies, tax_paths = read_tree(tree, taxonomies, tax_paths, tax_tree_string, tree["name_in_path"])
        return taxonomies, tax_paths



