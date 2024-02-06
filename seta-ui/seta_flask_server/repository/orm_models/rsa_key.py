from seta_flask_server.infrastructure.extensions import db


class RsaKeyOrm(db.Model):
    __tablename__ = "rsa_key"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(36), db.ForeignKey("users.user_id"), nullable=False)
    rsa_value = db.Column(db.String(), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    modified_at = db.Column(db.DateTime, nullable=True)
