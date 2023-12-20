from flask_restx import abort


def resource_exists(res_id, current_app):
    query = {"query": {"bool": {"must": [{"match": {"source.keyword": res_id}}]}}}
    try:
        resp = current_app.es.search(
            index=current_app.config["INDEX_PUBLIC"], body=query
        )
    except Exception as ex:
        message = str(ex)
        current_app.logger.exception(message)
        abort(401, message)

    if resp["hits"]["total"]["value"] == 0:
        return False
    else:
        return True


def get_all_resource(current_app):
    res_list = []
    aggs = {"aggs": {"resources": {"terms": {"field": "source.keyword"}}}}
    try:
        resp = current_app.es.search(
            index=current_app.config["INDEX_PUBLIC"], body=aggs, size=0
        )
        if "aggregations" in resp:
            for agg in resp["aggregations"]["resources"]["buckets"]:
                res_list.append(agg["key"])
    except Exception as ex:
        message = str(ex)
        current_app.logger.exception(message)
        abort(401, message)
    return res_list
