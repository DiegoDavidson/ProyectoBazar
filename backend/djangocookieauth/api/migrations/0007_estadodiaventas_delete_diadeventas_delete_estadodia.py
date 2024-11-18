# Generated by Django 5.1.2 on 2024-11-13 22:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_diadeventas_remove_estadodia_abierto_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='EstadoDiaVentas',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('abierto', models.BooleanField(default=True)),
                ('fecha', models.DateField(auto_now=True)),
            ],
        ),
        migrations.DeleteModel(
            name='DiaDeVentas',
        ),
        migrations.DeleteModel(
            name='EstadoDia',
        ),
    ]