from django import forms
from BG.models import Resident
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm

class login_form(forms.Form):
    username = forms.CharField(max_length=100)
    password = forms.CharField(max_length=100, widget=forms.PasswordInput)

class signIn_form(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = get_user_model()
        fields = ['username', 'first_name' ,'last_name', 'email', 'telephone']