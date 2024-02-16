from seta_flask_server.infrastructure.extensions import db


class SystemScopeOrm(db.Model):

    __tablename__ = "system_scopes"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(36), db.ForeignKey("users.user_id"), nullable=False)
    area = db.Column(db.String(255), nullable=False)
    scope = db.Column(db.String(255), nullable=False)

    def __repr__(self) -> str:
        return f"<SystemScopeOrm {self.id} {self.user_id} {self.area} {self.scope}>"
