# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2018-12-26 02:36
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vms', '0014_remove_virtualmachine_password'),
    ]

    operations = [
        migrations.AddField(
            model_name='virtualmachine',
            name='template',
            field=models.BooleanField(default=False),
        ),
    ]
