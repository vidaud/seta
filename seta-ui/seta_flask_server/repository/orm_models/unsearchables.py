from seta_flask_server.infrastructure.extensions import db


class UnsearchablesOrm(db.Model):
    __tablename__ = "profile_unsearchables"

    user_id = db.Column(db.String(36), db.ForeignKey("users.user_id"), primary_key=True)
    data_sources = db.Column(db.ARRAY(db.String()), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

    def __repr__(self) -> str:
        return f"<UnsearchablesOrm {self.user_id} {self.data_sources}>"
