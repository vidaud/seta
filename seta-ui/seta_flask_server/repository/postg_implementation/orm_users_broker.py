# pylint: disable=missing-function-docstring

from datetime import datetime
import pytz

from flask_sqlalchemy import SQLAlchemy
from interface import implements
from injector import inject

from seta_flask_server.repository.models import (
    SetaUser,
    SetaUserExt,
    ExternalProvider,
    UserClaim,
)
from seta_flask_server.infrastructure.constants import (
    ClaimTypeConstants,
    UserStatusConstants,
)

from seta_flask_server.repository.orm_models import (
    SetaUserOrm,
    UserClaimOrm,
)

from seta_flask_server.repository.interfaces import IDbConfig, IUsersBroker
from seta_flask_server.repository.postg_implementation import (
    orm_external_provider_broker as oepb,
    orm_user_permissions as oup,
    orm_data_source_scopes_broker as odssb,
)


class OrmUsersBroker(implements(IUsersBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db: SQLAlchemy = config.get_db()

        self.provider_broker = oepb.OrmExternalProviderBroker(config)

    # ---------------- Public methods ----------------#

    def authenticate_user(self, auth_user: SetaUser) -> SetaUser:
        seta_user = self.get_user_by_email(auth_user.email)

        if seta_user is None:
            return self._create_new_user(auth_user)

        if seta_user.status != UserStatusConstants.Active:
            return None

        provider_uid = auth_user.authenticated_provider.provider_uid
        provider_name = auth_user.authenticated_provider.provider

        seta_user.authenticated_provider = next(
            filter(
                lambda p: p.provider_uid == provider_uid
                and p.provider == provider_name,
                seta_user.external_providers,
            ),
            None,
        )

        if seta_user.authenticated_provider is None:
            # create new external provider
            auth_provider = ExternalProvider(
                user_id=seta_user.user_id,
                provider_uid=auth_user.authenticated_provider.provider_uid,
                provider=auth_user.authenticated_provider.provider,
                first_name=auth_user.authenticated_provider.first_name,
                last_name=auth_user.authenticated_provider.last_name,
                domain=auth_user.authenticated_provider.domain,
            )

            seta_user.authenticated_provider = auth_provider

            self.provider_broker.create(auth_provider)

        return seta_user

    def get_user_by_provider(
        self, provider_uid: str, provider: str, load_scopes: bool = False
    ) -> SetaUser:
        external_provider = self.provider_broker.get_by_uid(provider_uid, provider)

        if external_provider is None:
            return None

        seta_user = self.get_user_by_id(external_provider.user_id, load_scopes)

        if seta_user is not None:
            seta_user.authenticated_provider = external_provider

        return seta_user

    def get_user_by_id(self, user_id: str, load_scopes: bool = True) -> SetaUser:
        user = self.db.session.query(SetaUserOrm).filter_by(user_id=user_id).first()

        if user is None:
            return None

        seta_user = from_orm_model(user)
        seta_user.external_providers = self.provider_broker.get_by_user(
            seta_user.user_id
        )
        seta_user.claims = self._get_user_claims_from_db(seta_user.user_id)

        if load_scopes:
            perm_broker = oup.OrmUserPermissionsBroker(self.config)
            ds_scopes_broker = odssb.OrmDataSourceScopesBroker(self.config)

            seta_user.system_scopes = perm_broker.get_all_user_system_scopes(
                seta_user.user_id
            )
            seta_user.data_source_scopes = ds_scopes_broker.get_by_user_id(
                seta_user.user_id
            )

        return seta_user

    def get_user_by_email(self, email: str) -> SetaUser:
        if not email:
            return None

        user = self.db.session.query(SetaUserOrm).filter_by(email=email).first()

        if user is None:
            return None

        seta_user = from_orm_model(user)
        seta_user.external_providers = self.provider_broker.get_by_user(
            seta_user.user_id
        )
        seta_user.claims = self._get_user_claims_from_db(seta_user.user_id)

        return seta_user

    def user_uid_exists(self, user_id: str) -> bool:
        return (
            self.db.session.query(SetaUserOrm).filter_by(user_id=user_id).first()
            is not None
        )

    def update_status(self, user_id: str, status: str):
        user = self.db.session.query(SetaUserOrm).filter_by(user_id=user_id).first()
        user.status = status
        user.modified_at = datetime.now(tz=pytz.utc)
        self.db.session.commit()

    def update_role(self, user_id: str, role: str):

        claim = (
            self.db.session.query(UserClaimOrm)
            .filter_by(user_id=user_id, claim_type=ClaimTypeConstants.RoleClaimType)
            .first()
        )

        if claim is None:
            claim = UserClaimOrm(
                user_id=user_id,
                claim_type=ClaimTypeConstants.RoleClaimType,
                claim_value=role,
            )
            self.db.session.add(claim)
        else:
            claim.claim_value = role

        self.db.session.commit()

    def delete(self, user_id: str):
        pass

    # ---------------- Private methods ----------------#
    def _get_user_claims_from_db(self, user_id: str) -> list[UserClaim]:
        claims = self.db.session.query(UserClaimOrm).filter_by(user_id=user_id).all()

        if claims:
            return [_from_orm_model_claim(claim) for claim in claims]

        return []

    def _create_new_user(self, user: SetaUser) -> SetaUser:
        uid_exists = self.user_uid_exists(user.user_id)
        # check if the generated id for this new user already exists in the db
        while uid_exists:
            user.user_id = SetaUserExt.generate_uuid()
            uid_exists = self.user_uid_exists(user.user_id)

        # insert user record
        user_orm = _to_orm_model(user)
        self.db.session.add(user_orm)

        self.db.session.flush()

        # insert provider record
        user.authenticated_provider.user_id = user.user_id
        self.db.session.add(oepb.to_orm_model(user.authenticated_provider))

        # insert claims
        if user.claims:
            for claim in user.claims:
                claim.user_id = user.user_id
                self.db.session.add(_to_orm_model_claim(claim))

        # insert default system scopes
        if user.system_scopes:

            for scope in user.system_scopes:
                scope.user_id = user.user_id
                self.db.session.add(oup.to_orm_model(scope))

        self.db.session.commit()
        return user


def _to_orm_model_claim(claim: UserClaim) -> UserClaimOrm:
    return UserClaimOrm(
        user_id=claim.user_id,
        claim_type=claim.claim_type,
        claim_value=claim.claim_value,
    )


def _from_orm_model_claim(claim: UserClaimOrm) -> UserClaim:
    return UserClaim(
        user_id=claim.user_id,
        claim_type=claim.claim_type,
        claim_value=claim.claim_value,
    )


def _to_orm_model(user: SetaUser) -> SetaUserOrm:
    return SetaUserOrm(
        user_id=user.user_id,
        email=user.email,
        user_type=user.user_type,
        status=user.status,
        created_at=user.created_at,
        modified_at=user.modified_at,
    )


def from_orm_model(user: SetaUserOrm) -> SetaUser:
    return SetaUser(
        user_id=user.user_id,
        email=user.email,
        status=user.status,
        user_type=user.user_type,
        created_at=user.created_at,
        modified_at=user.modified_at,
    )
