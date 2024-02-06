from sqlalchemy.dialects.postgresql import ARRAY
from seta_flask_server.infrastructure.extensions import db


class CatalogueRoleOrm(db.Model):
    __tablename__ = "catalogue_roles"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    code = db.Column(db.String(255), unique=True)
    name = db.Column(db.String(255), unique=True)
    description = db.Column(db.String(5000), nullable=False)
    default_scopes = db.Column(ARRAY(db.String()), nullable=True)

    def __repr__(self) -> str:
        return f"<CatalogueRoleOrm {self.code} {self.name}>"
