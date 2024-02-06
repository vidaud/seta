from seta_flask_server.infrastructure.extensions import db


class CatalogueFieldOrm(db.Model):
    __tablename__ = "catalogue_fields"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), unique=True)
    description = db.Column(db.String(5000), nullable=False)

    def __repr__(self) -> str:
        return f"<CatalogueFieldOrm {self.name}>"
