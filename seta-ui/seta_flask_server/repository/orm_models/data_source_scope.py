from seta_flask_server.infrastructure.extensions import db


class DataSourceScopeOrm(db.Model):

    __tablename__ = "data_source_scopes"

    __table_args__ = (
        db.UniqueConstraint(
            "user_id", "data_source_id", "scope", name="unique_user_data_source"
        ),
    )

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(36), db.ForeignKey("users.user_id"), nullable=False)
    data_source_id = db.Column(
        db.String(36), db.ForeignKey("data_sources.id"), nullable=False
    )
    scope = db.Column(db.String(255), nullable=False)

    def __repr__(self) -> str:
        return f"<DataSourceScopeOrm {self.user_id} {self.data_source_id} {self.scope}>"
