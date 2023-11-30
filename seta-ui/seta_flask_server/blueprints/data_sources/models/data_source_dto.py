from flask_restx import Model, fields

contact_model = Model(
    "DataSourceContact",
    {
        "email": fields.String(description="Email address of the organisation."),
        "person": fields.String(description="Person name within the organisation."),
        "website": fields.String(description="Website address of the data source."),
    },
)

data_source_model = Model(
    "DataSource",
    {
        "id": fields.String(description="Identifier.", attribute="data_source_id"),
        "title": fields.String(description="Short title"),
        "description": fields.String(description="Long text description"),
        "organisation": fields.String(description="Organisation owner"),
        "theme": fields.String(description="Domain of application"),
        "contact": fields.Nested(
            model=contact_model, description="Contact channels", skip_none=True
        ),
    },
)

ns_models = {
    contact_model.name: contact_model,
    data_source_model.name: data_source_model,
}
