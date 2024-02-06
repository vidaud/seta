from seta_flask_server.infrastructure.extensions import db


class AnnotationOrm(db.Model):
    __tablename__ = "annotations"

    category = db.Column(db.String(100), primary_key=True)
    label = db.Column(db.String(200), primary_key=True)
    color = db.Column(db.String(7), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    modified_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self) -> str:
        return f"<AnnotationOrm {self.category} {self.label} {self.color}>"
