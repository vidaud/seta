from seta_flask_server.infrastructure.extensions import db


class ApplicationOrm(db.Model):

    __tablename__ = "applications"

    name = db.Column(db.String(255), nullable=False, primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey("users.user_id"), unique=True)
    description = db.Column(db.String(255), nullable=False)
    parent_user_id = db.Column(
        db.String(36), db.ForeignKey("users.user_id"), nullable=False
    )

    def __repr__(self) -> str:
        return f"<ApplicationOrm {self.name}>"
