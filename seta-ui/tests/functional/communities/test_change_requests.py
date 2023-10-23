import pytest
from flask.testing import FlaskClient
from http import HTTPStatus
from flask import json

from tests.infrastructure.helpers.authentication import login_user
from tests.infrastructure.helpers.community import create_community, get_community
from tests.infrastructure.helpers.resource import create_resource, get_resource
from tests.infrastructure.helpers.community_change_request import (
    create_community_change_request,
)
from tests.infrastructure.helpers.resource_change_request import (
    create_resource_change_request,
)
from tests.infrastructure.helpers.admin_change_requests import (
    get_community_pending_change_requests,
    update_community_change_request,
    get_resource_pending_change_requests,
    update_resource_change_request,
)

from seta_flask_server.repository.models import ResourceLimitsModel
from seta_flask_server.infrastructure.constants import (
    RequestStatusConstants,
    ResourceRequestFieldConstants,
    CommunityMembershipConstants,
    CommunityRequestFieldConstants,
)


"""==================== Community ======================================="""


@pytest.mark.parametrize("user_id", ["seta_community_manager"])
def test_create_community(client: FlaskClient, authentication_url: str, user_id: str):
    """
    Scenario: 'user2' registers new data community

    Given: 'user2' is authenticated users in SeTA
    When: 'user2' is registering new data community with ID 'blue'
    Then: new data community 'blue' registration is confirmed
    """

    response = login_user(auth_url=authentication_url, user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    response = create_community(
        client=client,
        access_token=access_token,
        community_id="blue",
        title="Blue Community",
        description="Blue Community for test",
    )
    assert response.status_code == HTTPStatus.CREATED


@pytest.mark.parametrize(
    "user_id, community_id, expected",
    [
        ("seta_community_manager", "blue", HTTPStatus.CREATED),
        ("seta_community_manager", "blue", HTTPStatus.CONFLICT),
        ("seta_admin", "blue", HTTPStatus.FORBIDDEN),
    ],
)
def test_create_community_change_request(
    client: FlaskClient,
    authentication_url: str,
    user_id: str,
    community_id: str,
    expected: int,
):
    """
    Scenario: 'user2' is changing membership to 'opened' for 'blue' community

    Given: 'user2' is authenticated users in SeTA
         AND data community 'blue' is registered
         AND 'user2' is the manager of data community 'blue'
    When: 'user2' is requesting the membership to 'opened' for 'blue' community
    Then: new change request is confirmed
    """

    response = login_user(auth_url=authentication_url, user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    response = create_community_change_request(
        client=client,
        access_token=access_token,
        community_id=community_id,
        field_name=CommunityRequestFieldConstants.Membership,
        new_value=CommunityMembershipConstants.Opened,
        old_value=CommunityMembershipConstants.Closed,
    )
    assert response.status_code == expected


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_community_approve_change_request(
    client: FlaskClient, authentication_url: str, user_id: str
):
    """
    'user1' approves the pending change request
    """

    response = login_user(auth_url=authentication_url, user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    response = get_community_pending_change_requests(
        client=client, access_token=access_token
    )
    assert response.status_code == HTTPStatus.OK
    assert response.json

    # update first response
    cr = response.json[0]
    assert "community_id" in cr
    assert "request_id" in cr

    response = update_community_change_request(
        client=client,
        access_token=access_token,
        community_id=cr["community_id"],
        request_id=cr["request_id"],
        status=RequestStatusConstants.Approved,
    )
    assert response.status_code == HTTPStatus.OK

    response = get_community(
        client=client, access_token=access_token, community_id=cr["community_id"]
    )
    assert response.status_code == HTTPStatus.OK
    assert CommunityRequestFieldConstants.Membership in response.json
    assert (
        response.json[CommunityRequestFieldConstants.Membership]
        == CommunityMembershipConstants.Opened
    )


"""==========================================================="""

"""==================== Resource ======================================="""


@pytest.mark.parametrize("user_id, community_id", [("seta_community_manager", "blue")])
def test_create_resource(
    client: FlaskClient, authentication_url: str, user_id: str, community_id: str
):
    """
    Scenario: 'user2' is registering new data source 'ocean' in data community 'blue'

    Given: 'user2' is authenticated users in SeTA
         AND data community 'blue' is registered
         AND 'user2' is the owner of data community 'blue'
    When: 'user2' is registering new data source  'ocean' in data community 'blue'
    Then: new data source 'ocean' in data community 'blue' registration is confirmed
    """

    response = login_user(auth_url=authentication_url, user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    response = create_resource(
        client=client,
        access_token=access_token,
        community_id=community_id,
        resource_id="ocean",
        title="Ocean",
        abstract="Ocean resource for test",
    )
    assert response.status_code == HTTPStatus.CREATED


@pytest.mark.parametrize(
    "user_id, resource_id, expected",
    [
        ("seta_community_manager", "ocean", HTTPStatus.CREATED),
        ("seta_community_manager", "ocean", HTTPStatus.CONFLICT),
        ("seta_admin", "ocean", HTTPStatus.FORBIDDEN),
    ],
)
def test_create_resource_change_request(
    client: FlaskClient,
    authentication_url: str,
    user_id: str,
    resource_id: str,
    expected: int,
):
    """
    Scenario: 'user2' requests changes for 'ocean' resource

    Given: 'user2' is authenticated users in SeTA
         AND data resource 'ocean' is registered
         AND 'user2' is the manager of data resouce 'ocean'
    When: 'user2' is requesting changes for 'ocean' resource
    Then: new change request is confirmed
    """

    response = login_user(auth_url=authentication_url, user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    limits = ResourceLimitsModel()
    old_limits = json.dumps(limits.to_json())

    limits.file_size_mb += 10
    new_limits = json.dumps(limits.to_json())

    response = create_resource_change_request(
        client=client,
        access_token=access_token,
        resource_id=resource_id,
        field_name=ResourceRequestFieldConstants.Limits,
        new_value=new_limits,
        old_value=old_limits,
    )
    assert response.status_code == expected


@pytest.mark.parametrize("user_id", [("seta_admin")])
def test_resource_update_change_requests(
    client: FlaskClient, authentication_url: str, user_id: str
):
    """
    'user1' rejects 'limits' pending change requests
    """

    response = login_user(auth_url=authentication_url, user_id=user_id)
    assert response.status_code == HTTPStatus.OK
    response_json = response.json()
    assert "access_token" in response_json
    access_token = response_json["access_token"]

    response = get_resource_pending_change_requests(
        client=client, access_token=access_token
    )
    assert response.status_code == HTTPStatus.OK
    assert response.json

    cr_limits = next(
        filter(
            lambda r: r["field_name"] == ResourceRequestFieldConstants.Limits,
            response.json,
        ),
        None,
    )
    assert cr_limits is not None

    response = update_resource_change_request(
        client=client,
        access_token=access_token,
        resource_id=cr_limits["resource_id"],
        request_id=cr_limits["request_id"],
        status=RequestStatusConstants.Approved,
    )
    assert response.status_code == HTTPStatus.OK

    response = get_resource(
        client=client, access_token=access_token, resource_id=cr_limits["resource_id"]
    )
    assert response.status_code == HTTPStatus.OK

    new_limits = json.loads(cr_limits["new_value"])
    assert (
        response.json[ResourceRequestFieldConstants.Limits]["file_size_mb"]
        == new_limits["file_size_mb"]
    )


"""==========================================================="""
