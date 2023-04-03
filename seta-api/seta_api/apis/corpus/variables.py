from flask_restx import reqparse, fields

corpus_parser = reqparse.RequestParser()
corpus_parser.add_argument('term')
corpus_parser.add_argument('n_docs', type=int)
corpus_parser.add_argument('from_doc', type=int)
corpus_parser.add_argument('search_type')
corpus_parser.add_argument('source', action='split')
corpus_parser.add_argument('collection', action='split')
corpus_parser.add_argument('subject', action='split')
corpus_parser.add_argument('reference', action='split')
corpus_parser.add_argument('in_force')
corpus_parser.add_argument('sort', action='split')
corpus_parser.add_argument('semantic_sort_id')
corpus_parser.add_argument('semantic_sort_id_list', action='split')
corpus_parser.add_argument('author', action='split')
corpus_parser.add_argument('date_range', action='split')
corpus_parser.add_argument('aggs', action='split')
corpus_parser.add_argument('other', action='split')  

other = fields.Wildcard(fields.String())



metadata = {}
metadata["name"] = fields.String()
metadata["code"] = fields.String()
metadata["label"] = fields.String()
metadata["longLabel"] = fields.String()
metadata["validated"] = fields.String()
metadata["classifier"] = fields.String()
metadata["version"] = fields.String()
metadata["name_in_path"] = fields.String()


keywords = {}
keywords["keyword"] = fields.String()
keywords["score"] = fields.Float()
