from flask_restx import abort


def resource_exists(res_id, current_app):
    query = {"bool": {"must": [{"match": {"source.keyword": res_id}}]}}
    try:
        resp = current_app.es.search(index=current_app.config["INDEX_PUBLIC"], query=query)
    except Exception as ex:
        message = str(ex)
        current_app.logger.exception(message)
        abort(401, message)

    if resp['hits']['total']['value'] == 0:
        return False
    else:
        return True
