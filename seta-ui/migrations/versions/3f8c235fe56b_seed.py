# pylint:disable-all

"""empty message

Revision ID: 3f8c235fe56b
Revises: 2dc1b7ffb96d
Create Date: 2024-02-12 12:31:40.107335

"""
from alembic import op
import sqlalchemy as sa

from migrations.catalogues import fields, roles, scopes


# revision identifiers, used by Alembic.
revision = "3f8c235fe56b"
down_revision = "2dc1b7ffb96d"
branch_labels = None
depends_on = None


def upgrade():
    """Populate catalogues collection with scopes and roles"""

    op.bulk_insert(
        sa.Table(
            "catalogue_scopes",
            sa.MetaData(),
            autoload_with=op.get_bind(),
        ),
        scopes.catalogue_scopes,
    )

    op.bulk_insert(
        sa.Table("catalogue_roles", sa.MetaData(), autoload_with=op.get_bind()),
        roles.catalogue_roles,
    )

    op.bulk_insert(
        sa.Table(
            "catalogue_fields",
            sa.MetaData(),
            autoload_with=op.get_bind(),
        ),
        fields.catalogue_fields,
    )


def downgrade():
    """Delete all data from catalogues"""

    op.execute("DELETE FROM catalogue_scopes")

    op.execute("DELETE FROM catalogue_roles")

    op.execute("DELETE FROM catalogue_fields")
