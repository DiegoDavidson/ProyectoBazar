# Generated by Django 5.1.2 on 2024-11-14 23:13

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_estadodiaventas_delete_diadeventas_delete_estadodia'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Venta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total', models.DecimalField(decimal_places=2, max_digits=10)),
                ('tipo_documento', models.CharField(choices=[('Boleta', 'Boleta'), ('Factura', 'Factura')], max_length=10)),
                ('fecha_venta', models.DateTimeField(auto_now_add=True)),
                ('vendedor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
