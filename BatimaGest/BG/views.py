from django.shortcuts import render,redirect

from django.contrib.auth import authenticate ,login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.contrib import messages

from BG.form import login_form
from BG.form import signIn_form
from BG.form import reportForm
from BG.models import Resident
from BG.models import Signalement
from BG.models import Notification
from django.core.serializers import serialize

@login_required
def index(request, user_id):
    if request.user.id != user_id:
        return redirect("logout")
    user =  Resident.objects.get(id = user_id)
    signal = Signalement.objects.filter(resident = user)
    enAttente = signal.filter(state = "En Attente").count()
    enCours = signal.filter(state = "En cours").count()
    resolu = signal.filter(state = "Résolu").count()
    notif = Notification.objects.filter(resident = user)
    notif_nbr = notif.count()
    notif = serialize("json", notif)


    return render(request,"index.html",{"user_id": user_id, 'signalement': signal,"enAttente": enAttente,
                                   "enCours": enCours , "resolu": resolu, "notif_nbr": notif_nbr,
                                   "notif": notif})

@login_required
def create_report(request, user_id):
    if request.user.id != user_id:
        return redirect("logout")
    user = Resident.objects.get(id = user_id)
    notif = Notification.objects.filter(resident = user)
    notif_nbr = notif.count()
    notif = serialize("json", notif)
    if request.method == "POST":
        form = reportForm(request.POST,request.FILES)
        if form.is_valid():
            r =form.save()
            r.resident = user
            r.residence = user.residence
            r.save()
            m = Notification.objects.create(message = "Un nouveau problème a été signalé !", residence = user.residence)
            return redirect("index", user_id)
    else:
        form = reportForm()
    return render(request, "create_report.html", {"form": form, "notif_nbr": notif_nbr,
                                   "notif": notif})

def deconnection(request):
    logout(request)
    return redirect("login")

def connection(request):
    if request.method == 'POST':
        form = login_form(request.POST)
        if form.is_valid():
            user_name = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request,username =user_name, password =password)

            if user is not None :
                login(request, user)
                user_id = user.id
                return redirect("index", user_id)
            else:
                messages.error(request, "Nom d'utilisateur ou mot de passe incorects.")
        else:
            print(form.errors)#Devrais y avoir un message d'erreur
    else:
        form = login_form()

    return render(request,"connection.html",{"form": form})

def signUp(request):
    if request.method == 'POST':
        form = signIn_form(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            user_id = user.id
            return redirect("index", user_id)
        else:
            print(form.errors)#là aussi faudrait que ça soit visible
    else:
        form = signIn_form()
    return render(request, "inscription.html", {"form": form})

@login_required
def partieC(request, user_id):
    if request.user.id != user_id:
        return redirect("logout")
    user = Resident.objects.get(id = user_id)
    signal_ascenseur = Signalement.objects.filter(partieC = "Ascenseur", residence = user.residence).count()
    signal_parking = Signalement.objects.filter(partieC = "Parking", residence = user.residence).count()
    signal_escalier = Signalement.objects.filter(partieC = "Escalier", residence = user.residence).count()
    signal_piscine = Signalement.objects.filter(partieC = "Piscine", residence = user.residence).count()
    notif = Notification.objects.filter(resident = user)
    notif_nbr = notif.count()
    notif = serialize("json", notif)
    return render(request,"partieC.html",{"user_id":user_id, "signal_ascenseur": signal_ascenseur,
                                          "signal_parking": signal_parking, "signal_escalier":signal_escalier,
                                          "signal_piscine": signal_piscine, "notif_nbr": notif_nbr,
                                        "notif": notif})

def blank(request):
    return render(request,"white.html")