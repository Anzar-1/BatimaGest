from django.shortcuts import render,redirect

from django.contrib.auth import authenticate ,login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model

from BG.form import login_form
from BG.models import Resident

@login_required
def index(request):
    return render(request,"index.html")

def deconnection(request):
    logout(request)
    return redirect("login")

def connection(request):
    if request.method == 'POST':
        form = login_form(request.POST)
        if form.is_valid():
            user_name = form.cleaned_data['username']
            password = form.cleaned_data['password']
                
            print(user_name)
            print(password)

            user = authenticate(request,username =user_name, password =password)

            print(user)
            
            if user is not None :
                login(request, user)
                return redirect("index")
            else:
                print("Connexion failed")
        else:
            print(form.errors)
    else:
        form = login_form()

    return render(request,"connection.html",{"form": form})