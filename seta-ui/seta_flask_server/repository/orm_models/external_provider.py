from seta_flask_server.infrastructure.extensions import db


class ExternalProviderOrm(db.Model):

    __tablename__ = "providers"

    __table_args__ = (
        db.UniqueConstraint(
            "provider", "provider_uid", name="uq_provider_provider_uid"
        ),
    )

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(36), db.ForeignKey("users.user_id"), nullable=False)
    provider_uid = db.Column(db.String(255), nullable=False)
    provider = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(255), nullable=True)
    last_name = db.Column(db.String(255), nullable=True)
    domain = db.Column(db.String(255), nullable=True)

    def __repr__(self) -> str:
        return f"<ExternalProviderOrm {self.provider} {self.provider_uid}>"
