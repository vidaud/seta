from seta_flask_server.infrastructure.extensions import db


class CatalogueScopeOrm(db.Model):
    __tablename__ = "catalogue_scopes"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    area = db.Column(db.String(255), nullable=False)
    code = db.Column(db.String(), unique=True)
    name = db.Column(db.String(255), unique=True)
    description = db.Column(db.String(5000), nullable=False)
    elevated = db.Column(db.Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<CatalogueScopeOrm {self.code} {self.name}>"
