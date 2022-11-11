import pandas as pd
from sklearn.cluster import DBSCAN

from infrastructure.helpers import sanitize_input, word_exists
from infrastructure.ApiLogicError import ApiLogicError

def get_clusters(terms_model, term, n_terms):        
    if n_terms is None or n_terms > 30:
        n_terms = 30
        
    term = sanitize_input(term)
    if not word_exists(terms_model, term):
        raise ApiLogicError("Term out of vocabulary.")
    
    words = [w for w, x in terms_model.wv.most_similar_cosmul(term, topn=n_terms)]
    df = pd.DataFrame(terms_model.wv[words], index=words)
    db = DBSCAN(eps=0.3, min_samples=2, metric='cosine', metric_params=None, algorithm='brute', p=None,
                n_jobs=1).fit(df)
    
    cl = {n: [] for n in db.labels_}
    for n, k in enumerate(db.labels_): cl[k].append(words[n])
    
    clusters = {'n_terms': n_terms, 'clusters': []}
    for k in sorted(cl):
        cluster = str(k) if k > -1 else 'Unclustered'
        clusters['clusters'].append({'cluster': cluster, 'words': cl[k]})
        
    return clusters