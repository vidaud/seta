def read_tree(tree, taxonomies, long_code, long_label, taxonomy_name):
    if "data" in tree:
        if len(long_code) > 0:
            long_code += F":{tree['data']}"
        else:
            long_code += tree['data']
        if len(long_label) > 0:
            long_label += F":{tree['label']}"
        else:
            long_label += tree['label']

        taxonomies.append({
            "code": tree.get("data", None),
            "long_code": long_code,
            "label": tree.get("label", None),
            "long_label": long_label,
            "type": tree.get("type", None),
            "taxonomy_name": taxonomy_name
        })

        if "children" in tree:
            # If the list is empty it is a last child
            if len(tree["children"]) == 0:
                pass
            else:
                # else go to recursion
                for t in tree["children"]:
                    taxonomies = read_tree(t, taxonomies, long_code, long_label, taxonomy_name)
    return taxonomies


def convert_tree_to_json(node):
    if "children" not in node:
        return {"code": node["code"],
                "long_code": node["long_code"],
                "label": node["label"],
                "long_label": node["long_label"],
                "type": node["type"],
                "taxonomy_name": node["taxonomy_name"],
                "doc_num": node["doc_num"]
                }
    else:
        children_json = [convert_tree_to_json(child) for child in node["children"]]
        return {"code": node["code"],
                "long_code": node["long_code"],
                "label": node["label"],
                "long_label": node["long_label"],
                "type": node["type"],
                "taxonomy_name": node["taxonomy_name"],
                "doc_num": node["doc_num"], "children": children_json}


class Taxonomy:

    def __init__(self, index, es):
        self.root = None
        self.aggregation_response_field = "key"
        self.separator = ":"
        self.index = index
        self.es = es

    def __add_path_to_tree(self, t_obj, count):
        node = self.root
        if "long_code" in t_obj:
            parts = t_obj["long_code"].split(":")
            for part in parts:
                found_child = None
                for child in node["children"]:
                    if child["code"] == part:
                        found_child = child
                        break
                if found_child is None:
                    new_child = {"code": part,
                                 "long_code": t_obj["long_code"],
                                 "label": t_obj["label"],
                                 "long_label": t_obj["long_label"],
                                 "type": t_obj["type"],
                                 "taxonomy_name": t_obj["taxonomy_name"],
                                 "doc_num": count,
                                 "children": []}
                    node["children"].append(new_child)
                    node = new_child
                else:
                    found_child["doc_num"] += count
                    node = found_child

    def create_tree_from_aggregation(self, agg_response, search_type):
        for item in agg_response:
            t = item["key"].split(":")
            t_obj = self.__get_taxonomy(t[0], t[1])
            self.root = {"code": None,
                         "long_code": None,
                         "label": None,
                         "long_label": None,
                         "type": None,
                         "taxonomy_name": t[0],
                         "doc_num": None,
                         "children": []}
            if search_type == "CHUNK_SEARCH":
                count = item["unique_values"]["value"]
            else:
                count = item["doc_count"]
            self.__add_path_to_tree(t_obj, count)

    def from_eurovoc_tree_to_index_format(self, json_tree):
        taxonomy_name = list(json_tree.keys())[0]
        taxonomies = []
        long_code = ""
        long_label = ""
        for tree in json_tree[taxonomy_name]["data"]:
            taxonomies = read_tree(tree, taxonomies, long_code, long_label, taxonomy_name)
        for taxonomy in taxonomies:
            self.__insert_taxonomy(taxonomy)

    def enrich(self, taxonomies):
        enriched_taxonomies = []
        for tax in taxonomies:
            taxonomy = tax.split(":")
            enriched_taxonomy = self.__get_taxonomy(taxonomy[0], taxonomy[1])
            enriched_taxonomies.append(enriched_taxonomy)
        return enriched_taxonomies

    def __insert_taxonomy(self, taxonomy):
        self.es.index(index=self.index, body=taxonomy)

    def __get_taxonomy(self, taxonomy_name, code):
        body = {"query": {"bool": {"must": [{"match": {"taxonomy_name": taxonomy_name}},
                                            {"match": {"code": code}}]}}}
        result = self.es.search(index=self.index, body=body)
        if result["hits"]["total"]["value"] > 0:
            taxonomy = result["hits"]["hits"][0]["_source"]
        else:
            taxonomy = {"code": code,
                        "taxonomy_name": taxonomy_name}
        return taxonomy

    def tree_to_json(self):
        if self.root is None:
            return {}
        return convert_tree_to_json(self.root)
