from django import forms
from django.core.validators import EmailValidator

from .models import User, Group

from ...utils.tjldap import get_uid

class UserForm(forms.ModelForm):
    username = forms.CharField(max_length=32,
                           widget=forms.TextInput(attrs={"class": "form-control"}))
    email = forms.CharField(max_length=100,
                            widget=forms.TextInput(attrs={"class": "form-control"}),
                            validators=[EmailValidator])
    is_superuser = forms.BooleanField(required=False, label="Superuser Account")

    def __init__(self, *args, **kwargs):
        super(UserForm, self).__init__(*args, **kwargs)
        instance = getattr(self, "instance", None)
        if instance and instance.pk:
            self.fields["username"].disabled = True

    def clean_username(self):
        data = self.cleaned_data["username"].strip()

        try:
            uid = get_uid(data)
        except IndexError:
            raise forms.ValidationError("Username is not a valid TJ username!")

        return data

    def save(self, commit=True):
        instance = forms.ModelForm.save(self, commit=False)

        instance.id = get_uid(instance.username)

        instance.service = False
        instance.is_active = True

        instance.is_staff = instance.is_superuser
        instance.is_admin = instance.is_superuser

        if commit:
            instance.save()
            if not Group.objects.filter(id=instance.id).exists():
                group = Group.objects.create(id=instance.id, service=instance.service, name=instance.username)
                group.users.add(instance.pk)
                group.save()

        return instance

    class Meta:
        model = User
        fields = ["username", "email", "is_superuser"]
