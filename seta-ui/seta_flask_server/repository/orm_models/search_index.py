from seta_flask_server.infrastructure.extensions import db


class SearchIndexOrm(db.Model):
    __tablename__ = "search_indexes"

    index_name = db.Column(db.String(200), primary_key=True)
    default = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, nullable=False)

    def __repr__(self) -> str:
        return f"<SearchIndexOrm {self.index_name}>"
