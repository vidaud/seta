from sqlalchemy.dialects.postgresql import ARRAY
from seta_flask_server.infrastructure.extensions import db


class DataSourceOrm(db.Model):

    __tablename__ = "data_sources"

    id = db.Column(db.String(36), primary_key=True)
    title = db.Column(db.String(200), nullable=False, unique=True)
    description = db.Column(db.String(5000), nullable=False)
    index_name = db.Column(db.String(200), nullable=False)
    organisation = db.Column(db.String(255), nullable=False)
    themes = db.Column(ARRAY(db.String(255)), nullable=False)
    status = db.Column(db.String(255), nullable=False)
    contact_person = db.Column(db.String(255), nullable=True)
    contact_email = db.Column(db.String(255), nullable=True)
    contact_website = db.Column(db.String(255), nullable=True)
    creator_id = db.Column(db.String(36), db.ForeignKey("users.user_id"), nullable=True)
    created_at = db.Column(db.DateTime, nullable=True)
    modified_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self) -> str:
        return f"<DataSourceOrm {self.data_source_id} {self.title} "
