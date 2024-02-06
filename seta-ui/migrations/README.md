In seta-ui container run the commands bellow for generating new migrations and apply script to database:

New migration:

```
flask --app app_ui/app db migrate -m "init"
```

Apply changes:

```
flask --app app_ui/app db upgrade
```

Downgrade:

```
flask --app app_ui/app db downgrade <revision>
```

Creates an an empty revision script:
```
flask --app app_ui/app db revision
```