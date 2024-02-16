from seta_flask_server.infrastructure.extensions import db


class UserClaimOrm(db.Model):

    __tablename__ = "claims"

    __table_args__ = (
        db.UniqueConstraint("user_id", "claim_type", name="uq_user_id_claim_type"),
    )

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(36), db.ForeignKey("users.user_id"), nullable=False)
    claim_type = db.Column(db.String(255), nullable=False)
    claim_value = db.Column(db.String(255), nullable=False)

    def __repr__(self) -> str:
        return f"<UserClaimOrm {self.id} {self.user_id} {self.claim_type} {self.claim_value}>"
