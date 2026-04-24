from django import forms
from BG.models import Resident

class login_form(forms.Form):
    username = forms.CharField(max_length=100)
    password = forms.CharField(max_length=100, widget=forms.PasswordInput)

class signIn_form(forms.ModelForm):
    class Meta:
        model = Resident
        fields = '__all__'