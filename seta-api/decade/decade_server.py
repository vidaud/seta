import datetime

import yaml
from flask import Flask
from flask import jsonify
from flask_cors import CORS
from flask_restplus import Resource, Api, reqparse
from gensim.models import KeyedVectors
from werkzeug.middleware.proxy_fix import ProxyFix

config = yaml.load(open("../config.yaml"), Loader=yaml.FullLoader)


def now():
    return datetime.datetime.now()


def init():
    if config['env'] == 'dev':
        models_path = '../' + config['models-path-dev']
    else:
        models_path = config['models-path-production']

    decade_model = {}
    decades = [#('1950s-1980s', '1950s-1980s'),
               ('1990s', '1990-94'),
               ('1995', '1995-99'),
               ('2000', '2000-2004'),
               ('2005', '2005-2009'),
               ('2010', '2010-2014'),
               ('2015', '2015-2018')
               ]

    for s, g in [("0", "0"), ("1", "1")]:
        decade_model[s + g] = {}
        for dname, decade in decades:
            decade_model[s + g][decade] = KeyedVectors.load(
                models_path + "models-production/decades/wv-sg" + s + 'hs' + g + '-' + dname + ".bin", mmap="r")
        print(now(), 'finished loading decade models for s', s, 'g', g)
    return decade_model


decade_model = init()
app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
CORS(app)

app.config.SWAGGER_UI_DOC_EXPANSION = 'full'
ns = Api(app,
         version='beta',
         title='SeTA Decade API',
         description='SeTA - Semantic Text Analysis. \n'
                     'SeTa applies advanced text analysis techniques to large document collections, helping policy '
                     'analysts to understand the concepts expressed in thousands of documents and to see in a visual '
                     'manner the relationships between these concepts and their development over time.'
                     'A pilot version of this tool has been populated with hundreds of thousands of documents from '
                     'EUR-Lex, the EU Bookshop and other sources, and used at the JRC in a number of policy-related '
                     'use cases including impact assessment, the analysis of large data infrastructures, '
                     'agri-environment measures and natural disasters. The document collection which have been used, '
                     'the technical approach chosen and key use cases are described here: '
                     'https://ec.europa.eu/jrc/en/publication/semantic-text-analysis-tool-seta',
         doc='/decade/doc'
         )
ns = ns.namespace('decade', description='Seta Decade APIs include all the operations performed above decades models.'
                                         'Through decade models is possible to know and understand how context '
                                         'of a specific term developed over years. ')


api_root = '/api/v1'

parser = reqparse.RequestParser()
parser.add_argument('term', required=True)
parser.add_argument('sg', required=False)


@ns.route(api_root + "/ontology")
@ns.doc(description='Given a term, ',
        params={'term': 'Term from which build the ontology decade graph.',
                'sg': 'Allowed values are 1 (all terms), 0 (terms with high cardinality), default 1.'},
        responses={200: 'Success', 404: 'Not Found Error'})
class Clusters(Resource):
    @ns.expect(parser)
    def get(self):
        args = parser.parse_args()
        response = get_decades(args['term'], args['sg'])
        return response


def get_decades(term, sg):
    if sg is None:
        sg = '11'
    else:
        if sg == 1: sg = '11'
        if sg == 0: sg = '00'
        if sg != '11' and sg != '00': sg = '11'
    graph = {"nodes": [], "links": []}

    num_term = 4
    num_term2 = 2
    coef = .35

    graph["nodes"].append(node_to_json(term, '', 0, ''))

    for cc, decade in enumerate(decade_model[sg]):
        print(decade)
        if term not in decade_model[sg][decade].wv.vocab:
            continue
        graph["links"].append(link_to_json(decade, term, 1))
        print(decade, [w for w, x in decade_model[sg][decade].wv.most_similar(term, topn=num_term) if x > coef and w != term])
        graph["nodes"].append(node_to_json(term, decade, 1, ''))
        for related_term, weight in [(w, x) for w, x in
                                     decade_model[sg][decade].wv.most_similar(term, topn=num_term)
                                     if x > coef and w != term]:
            graph["nodes"].append(node_to_json(related_term, decade, 2, create_url(related_term, sg)))
            graph["links"].append(link_to_json(decade, related_term, int(10 * weight) * 10))

            for second_related, weight2 in [(w, x) for w, x in
                                            decade_model[sg][decade].wv.most_similar(related_term, topn=num_term2) if
                                x > coef and w != term]:
                graph["nodes"].append(node_to_json(second_related, decade, 3, create_url(second_related, sg)))
                graph["links"].append(link_to_json(related_term, second_related, int(10 * weight)))
    print(jsonify(graph))

    return jsonify(graph)


def create_url(term, sg):
    return api_root + "/decades/" + sg + '/' + term


def link_to_json(source, target, weight):
    link = {"target": target,
            "source": source,
            "weight": weight
            }
    return link


def node_to_json(term, decade, depth, url):
    node = {"term": term,
            "decade": decade,
            "depth": depth,
            "url": url
            }
    return node

if __name__ == '__main__':
    app.run(host='localhost')
