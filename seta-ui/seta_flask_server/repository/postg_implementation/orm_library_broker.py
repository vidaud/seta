# pylint: disable=missing-function-docstring

from flask_sqlalchemy import SQLAlchemy
from interface import implements
from injector import inject

from seta_flask_server.repository.interfaces import IDbConfig, ILibraryBroker
from seta_flask_server.repository.models import LibraryItem, LibraryItemType

from seta_flask_server.repository.orm_models import LibraryItemOrm


class OrmLibraryBroker(implements(ILibraryBroker)):
    @inject
    def __init__(self, config: IDbConfig) -> None:
        self.config = config
        self.db: SQLAlchemy = config.get_db()

    def create(self, items: list[LibraryItem]):
        orm_items = [to_orm_model(item) for item in items]

        self.db.session.add_all(orm_items)
        self.db.session.commit()

    def get_all_by_parent(self, user_id: str, parent_id: str) -> list[LibraryItem]:
        items = (
            self.db.session.query(LibraryItemOrm)
            .filter_by(user_id=user_id, parent_id=parent_id)
            .order_by(LibraryItemOrm.item_type, LibraryItemOrm.title)
            .all()
        )

        if items:
            return [from_orm_model(item) for item in items]

        return []

    def get_by_id(self, user_id: str, item_id: str) -> LibraryItem:
        item = (
            self.db.session.query(LibraryItemOrm)
            .filter_by(user_id=user_id, item_id=item_id)
            .first()
        )

        if item is None:
            return None

        return from_orm_model(item)

    def update(self, item: LibraryItem):
        orm_item = (
            self.db.session.query(LibraryItemOrm)
            .filter_by(user_id=item.user_id, item_id=item.id)
            .first()
        )

        orm_item.title = item.title
        orm_item.parent_id = item.parent_id

        if item.type != LibraryItemType.Folder:
            orm_item.document_id = item.document_id
            orm_item.link = item.link

        orm_item.modified_at = item.modified_at

        self.db.session.commit()

    def delete(self, user_id: str, item_id: str):
        _ids = []

        self._construct_cascade_ids(user_id=user_id, parent_id=item_id, _ids=_ids)

        self.db.session.query(LibraryItemOrm).filter(
            LibraryItemOrm.user_id == user_id, LibraryItemOrm.item_id.in_(_ids)
        ).delete(synchronize_session=False)

        self.db.session.commit()

    def _construct_cascade_ids(self, user_id: str, parent_id: str, _ids: list[str]):
        children = (
            self.db.session.query(LibraryItemOrm.item_id)
            .filter_by(user_id=user_id, parent_id=parent_id)
            .all()
        )

        for item in children:
            self._construct_cascade_ids(
                user_id=user_id, parent_id=item.item_id, _ids=_ids
            )

        _ids.append(parent_id)


def from_orm_model(item: LibraryItemOrm) -> LibraryItem:
    return LibraryItem(
        user_id=item.user_id,
        id=item.item_id,
        title=item.title,
        parent_id=item.parent_id,
        type=item.item_type,
        document_id=item.document_id,
        link=item.link,
        created_at=item.created_at,
        modified_at=item.modified_at,
    )


def to_orm_model(item: LibraryItem) -> LibraryItemOrm:
    return LibraryItemOrm(
        user_id=item.user_id,
        item_id=item.id,
        title=item.title,
        parent_id=item.parent_id,
        item_type=item.type,
        document_id=item.document_id,
        link=item.link,
        created_at=item.created_at,
        modified_at=item.modified_at,
    )
