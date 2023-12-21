import re
from itertools import groupby
from textacy import preprocessing


def clean(text):
    if not text:
        return ""
    if len(text) < 2:
        return ""
    r = re.compile(r"^\d*[.,]?\d*$")
    lam = lambda x: x if r.match(x) else x.replace('.', ' . ').replace(',', ' , ')
    my_string = text.replace(chr(0), '')
    my_string = my_string.replace('- \n ', '').replace('- \n', '').replace('-\n ', '').replace('-\n', '')
    my_string = my_string.replace(';', ' ; ')
    my_string = my_string.replace("'", " ")
    my_string = my_string.replace('%', ' %')
    my_string = my_string.replace('(', ' ( ')
    my_string = my_string.replace(')', ' ) ')
    my_string = my_string.replace('[', ' [ ')
    my_string = my_string.replace("]", " ] ")
    my_string = my_string.replace("|", " | ")
    my_string = my_string.replace('{', ' { ')
    my_string = my_string.replace('}', ' } ')
    my_string = my_string.replace('?', ' ? ')
    my_string = my_string.replace('//', '/').replace('//', '/')
    my_string = my_string.replace('e.g.', 'eg')
    my_string = my_string.replace('i.e.', 'ie')
    my_string = my_string.replace('e. g.', 'eg')
    my_string = my_string.replace('i. e.', 'ie')
    my_string = my_string.replace('.', ' . ').replace(':', ' : ').replace('"', ' " ')
    my_string = ''.join(''.join(s)[:3] for _, s in groupby(my_string))  # remove more than 3 repetitions
    my_string = ' ' + ' '.join([lam(w) for w in my_string.split()]) + ' '
    my_string = my_string.replace(' /', ' ').replace('/ ', ' ').replace(' -', ' ').replace('- ', ' ').replace('_ , _',
                                                                                                              '_,_')
    my_string = re.sub('\s+', ' ', my_string).strip()
    my_string = ''.join(c for c in my_string.lower() if c in "abcdefghijklmnopqrstuvwxyz0123456789/-_&@ \n")
    my_string = ' '.join([w for w in my_string.split(' ') if
                    w and not w.replace("/", "").replace("_", "").replace("-", "").replace("&", "").replace("@",
                                                                                                            "").isdigit()])
    return my_string


def sentenced(text):
    preproc = preprocessing.make_pipeline( preprocessing.normalize.unicode
                                         , preprocessing.normalize.whitespace
                                         , preprocessing.remove.accents
                                         , preprocessing.replace.urls
                                         , preprocessing.replace.emails
                                         , preprocessing.replace.phone_numbers )
#    return clean(preproc(text))
    return preproc(text)
