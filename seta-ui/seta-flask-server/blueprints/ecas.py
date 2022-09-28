import os
import time
from contextlib import nullcontext
from datetime import datetime
from functools import wraps

import jwt
import requests
from cas import CASClient
from flask import Blueprint, Flask, Response
from flask import current_app as app
from flask import (json, redirect, request, send_from_directory, session,
                   url_for)
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                decode_token, get_jti, get_jwt,
                                get_jwt_identity, jwt_required)

import config
from infrastructure.auth import authenticateJwt
from infrastructure.decorators import pop_session

from db.db_revoked_tokens_broker import (addRevokedToken, deleteRevokedTokens,
                                      getAllUserRevokedTokensDb,
                                      isTokenRevoked)
from db.db_users_broker import addDbUser, getDbUser


ecas = Blueprint("ecas", __name__)


@ecas.route("/seta")
def seta(method=["GET"]):
    if app.config['FLASK_ENV'] == "serve":
        root = app.config['ANGULAR_PATH'] + "/"
    else:
        root = app.config['FLASK_PATH'] + "/"

    jawt = nullcontext

    if "username" in session:
        """ iat = time.time()
        additional_claims = {
            "user": session["user_attributes"],
            "iat": iat,
            "iss": "SETA Flask server",
            "sub": session["username"],
        } """
        jawt = create_access_token(
            identity=session["username"])
        refresh_token = create_refresh_token(
            identity=session["username"])
        # jawt = jwt.encode(additional_claims, app.config['JWT_SECRET_KEY'], algorithm="HS256")

        # return json.jsonify(access_token=jawt)
        """ redir = redirect(root + "seta-ui/#/home")
        redir.headers = {'Authorization': 'Bearer ' + jawt}
        return redir """

        # return redirect(root + "seta-ui/#/home?accessToken=" + jawt)

    return redirect(root + "seta-ui/#/home" + "?accessToken=" + jawt + '&' + 'refreshToken=' + refresh_token)


@ecas.route("/login")
def login():
    if "username" in session:
        # Already logged in

        attributes = session["user_attributes"]
        if not getDbUser(attributes["uid"]):
            addDbUser(attributes)

        return redirect(url_for("ecas.seta"))

    # next = request.args.get("next")
    ticket = request.args.get("ticket")
    if not ticket:
        # No ticket, the request come from end user, send to CAS login
        cas_login_url = app.cas_client.get_login_url()
        app.logger.debug("CAS login URL: %s", cas_login_url)
        return redirect(cas_login_url)

    # There is a ticket, the request come from CAS as callback.
    # need call `verify_ticket()` to validate ticket and get user profile.
    app.logger.debug("ticket from CAS is: %s", ticket)
    # app.logger.debug("next is: %s", next)

    user, attributes, pgtiou = app.cas_client.verify_ticket(ticket)

    app.logger.debug(
        "CAS verify ticket response: user: %s, attributes: %s, pgtiou: %s",
        user,
        attributes,
        pgtiou,
    )

    if not user:
        return 'Failed to verify ticket. <a href="/login">Login</a>'
    else:  # Login successful, redirect according to `next` query parameter.

        if not getDbUser(attributes["uid"]):
            addDbUser(attributes)
        session["username"] = user
        session["user_attributes"] = attributes
        r5 = redirect(url_for("ecas.seta"))
        return r5


@ecas.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    jawt = create_access_token(
        identity=current_user)
    return {'jawt': jawt}


@ecas.route("/logout-ecas")
@jwt_required()
def logoutEcas():
    redirect_url = url_for("ecas.logoutCallback", _external=True)
    cas_logout_url = app.cas_client.get_logout_url(redirect_url)
    app.logger.debug("CAS logout URL: %s", cas_logout_url)

    return redirect(cas_logout_url)


@ecas.route("/logout", methods=["POST"])
@jwt_required(refresh=True)
@pop_session()
def logout():

    req = json.loads(request.data.decode("UTF-8"))

    # If request is valid and authorized, also revoke the token for future access, before its
    # normal expiry moment. Revoke by adding it to the MongoDB collection of revoked tokens:
    # if authenticateJwt(req["username"]):
    #     addRevokedToken(req["username"], req["jwt"], str(datetime.now()))
    jti_refresh = get_jwt()["jti"]
    try:
        jti_access = get_jti(req['accessToken'])
        if jti_access is not None:
            addRevokedToken(req["username"], jti_access, str(datetime.now()))
    except jwt.ExpiredSignatureError as e:
        app.logger.debug("Token is expired : %s", e)
    except Exception as e:
        app.logger.debug(e)

    addRevokedToken(req["username"], jti_refresh, str(datetime.now()))
    # session.pop("username", None)
    # session.pop("user_attributes", None)

    response = json.jsonify({"status": "ok"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


""" @ecas.route("/logout", methods=["POST"])
@jwt_required(refresh=True)
def post(self):
    jti_access = get_raw_jwt()['jti']
    data = logout_parser.parse_args()
     jti_refresh = get_jti(data['refresh_token'])
      current_user = get_jwt_identity()

       try:
            [RevokedTokenModel(jti=jti, msisdn=current_user).add()
             for jti in [jti_access, jti_refresh]]
            return {'message': 'Access and refresh tokens have been revoked'}, 200
        except:
            return {'message': 'Internal error'}, 500 """


@ecas.route("/logoutCallback")
def logoutCallback():
    session.pop("username", None)
    return redirect(url_for("ecas.seta"))


@ecas.route("/revoked-tokens/all")
def getAllRevokedTokens():

    tokens = getAllUserRevokedTokensDb()

    response = json.jsonify({"tokens": tokens, "status": "ok"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
