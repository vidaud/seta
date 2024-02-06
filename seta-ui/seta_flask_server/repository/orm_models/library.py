from seta_flask_server.infrastructure.extensions import db


class LibraryItemOrm(db.Model):

    __tablename__ = "library"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(36), db.ForeignKey("users.user_id"), nullable=False)
    item_id = db.Column(db.String(36), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    parent_id = db.Column(db.String(36), nullable=True)
    item_type = db.Column(db.Integer, nullable=False)
    document_id = db.Column(db.String(36), nullable=True)
    link = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, nullable=True)
    modified_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self) -> str:
        return (
            f"<LibraryItemOrm {self.id} {self.user_id} {self.item_id} {self.title} "
            f"{self.parent_id} {self.item_type} "
        )
