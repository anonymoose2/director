# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-03-10 04:32
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('vms', '0012_auto_20170821_1000'),
    ]

    operations = [
        migrations.AlterField(
            model_name='virtualmachine',
            name='host',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='vms.VirtualMachineHost'),
        ),
    ]
