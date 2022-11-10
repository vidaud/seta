from flask_restx import reqparse, fields, inputs

corpus_parser = reqparse.RequestParser()
corpus_parser.add_argument('term')
corpus_parser.add_argument('n_docs', type=int)
corpus_parser.add_argument('from_doc', type=int)
corpus_parser.add_argument('search_type')
corpus_parser.add_argument('source', action='split')
corpus_parser.add_argument('collection', action='split')
corpus_parser.add_argument('subject', action='split')
corpus_parser.add_argument('reference', action='split')
corpus_parser.add_argument('eurovoc_concept', action='split')
corpus_parser.add_argument('eurovoc_domain', action='split')
corpus_parser.add_argument('eurovoc_mth', action='split')
corpus_parser.add_argument('ec_priority', action='split')
corpus_parser.add_argument('sdg_domain', action='split')
corpus_parser.add_argument('sdg_subdomain', action='split')
corpus_parser.add_argument('euro_sci_voc', action='split')
corpus_parser.add_argument('in_force', type=inputs.boolean)
corpus_parser.add_argument('sort', action='split')
corpus_parser.add_argument('semantic_sort_id')
corpus_parser.add_argument('author', action='split')
corpus_parser.add_argument('date_range', action='split')
corpus_parser.add_argument('aggs')  

metadata = {}
metadata["label"] = fields.String()
metadata["validated"] = fields.String()
metadata["classifier"] = fields.String()
metadata["version"] = fields.String()

keywords = {}
keywords["keyword"] = fields.String()
keywords["score"] = fields.Float()