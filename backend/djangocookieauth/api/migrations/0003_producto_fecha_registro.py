# Generated by Django 5.1.2 on 2024-11-12 19:38

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_producto_categoria_delete_venta'),
    ]

    operations = [
        migrations.AddField(
            model_name='producto',
            name='fecha_registro',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
