from seta_flask_server.infrastructure.extensions import db


class UserSessionOrm(db.Model):

    __tablename__ = "sessions"

    session_id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey("users.user_id"), nullable=False)
    provider = db.Column(db.String(255), nullable=True)
    provider_uid = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, nullable=True)
    end_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self) -> str:
        return (
            f"<UserSessionOrm {self.session_id} {self.user_id} {self.provider} "
            f"{self.provider_uid} {self.created_at} {self.end_at}>"
        )


class UserSessionTokenOrm(db.Model):

    __tablename__ = "session_tokens"

    session_id = db.Column(
        db.String(36), db.ForeignKey("sessions.session_id"), primary_key=True
    )
    token_jti = db.Column(db.String(36), primary_key=True)

    token_type = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=True)
    expires_at = db.Column(db.DateTime, nullable=True)
    is_blocked = db.Column(db.Boolean, nullable=False, default=False)
    blocked_at = db.Column(db.DateTime, nullable=True)

    refreshed_access_token = db.Column(db.String(), nullable=True)
    refreshed_refresh_token = db.Column(db.String(), nullable=True)

    def __repr__(self) -> str:
        return (
            f"<UserSessionTokenOrm {self.token_jti} {self.session_id} {self.token_type} "
            f"{self.created_at} {self.expires_at} {self.is_blocked} {self.blocked_at}>"
        )
