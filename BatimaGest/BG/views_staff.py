from django.shortcuts import render,redirect,get_object_or_404

from django.contrib.auth import authenticate ,login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import get_user_model

from BG.form import login_form
from BG.models import Resident
from BG.models import Signalement
from BG.models import Notification

from django.utils import timezone
from datetime import timedelta

def is_staff_user(user):
    return user.is_staff

@login_required
def deconnection(request):
    logout(request)
    return redirect("staff_login")

def connection_staff(request):
    if request.method == 'POST':
        form = login_form(request.POST)
        if form.is_valid():
            user_name = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request,username =user_name, password =password)

            if user is not None :
                login(request, user)
                user_id = user.id
                if user.is_staff == False:
                    return redirect("index", user_id)
                else:
                    return redirect('staffDashboard', user_id)
            else:
                print("Connexion failed")
        else:
            print(form.errors)#Devrais y avoir un message d'erreur
    else:
        form = login_form()

    return render(request,"Admin/login.html",{"form": form})

from django.core.serializers import serialize

@login_required
@user_passes_test(is_staff_user)
def dashboard(request, user_id):
    if request.user.id != user_id:
        return redirect("logout")
    user = Resident.objects.get(id = user_id)
    signal = Signalement.objects.filter(residence = user.residence)
    signal_count = signal.count()
    enAttente = signal.filter(state = "En Attente").count()
    enCours = signal.filter(state = "En cours").count()
    resolu = signal.filter(state = "Résolu").count()
    notif = Notification.objects.filter(resident__isnull = True)
    notif_nbr = notif.count()
    notif = serialize("json", notif)



    s = filtre(request, signal)

    if request.POST:
        report_id = request.POST.get("report_id")
        action = request.POST.get("action")

        report = get_object_or_404(Signalement, id=report_id)

        if action == "start":
            report.state = "En cours"
            notif = Notification()
            notif.resident = report.resident
            notif.message = "L'un des problème que vous avez signaler est en cours de traitement"
            notif.save()
        elif action == "resolve":
            report.state = "Résolu"
            notif = Notification()
            notif.resident = report.resident
            notif.message = "L'un des problème que vous avez signaler est résolu."
            notif.save()

        report.save()
        return redirect("staffDashboard", user_id)

    return render(request, "Admin/dashboard.html",{"user_id":user_id, "signal": s,
                                                   'signal_count': signal_count, "enAttente": enAttente,
                                                   "enCours": enCours, "resolu": resolu, "notif_nbr": notif_nbr,
                                                   "notif": notif})

def filtre(request, signals):
    
    status = request.GET.get("status")
    area = request.GET.get("area")
    priority = request.GET.get("priority")
    date = request.GET.get("date")

    # 🔹 STATUS FILTER (adjust to your DB values)
    if status and status != "all":
        if status == "pending":
            signals = signals.filter(state="En Attente")
        elif status == "in_progress":
            signals = signals.filter(state="En cours")
        elif status == "resolved":
            signals = signals.filter(state="Résolu")

    
    # 🔹 AREA FILTER
    if area and area != "all":
        signals = signals.filter(partieC__id=area)  # adjust field if needed

    # 🔹 PRIORITY FILTER
    if priority and priority != "all":
        signals = signals.filter(priorite=priority)

    # 🔹 DATE FILTER
    now = timezone.now()

    if date == "today":
        signals = signals.filter(created_at__date=now.date())

    elif date == "week":
        signals = signals.filter(created_at__gte=now - timedelta(days=7))

    elif date == "month":
        signals = signals.filter(created_at__gte=now - timedelta(days=30))

    return signals
