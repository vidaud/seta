from seta_flask_server.infrastructure.extensions import db


class SetaUserOrm(db.Model):

    __tablename__ = "users"

    user_id = db.Column(db.String(36), primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    user_type = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    modified_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self) -> str:
        return f"<SetaUserOrm {self.user_id} {self.email} {self.user_type} {self.status} {self.created_at} {self.modified_at}>"
