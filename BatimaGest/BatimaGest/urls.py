"""
URL configuration for BatimaGest project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from BG import views, views_staff
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("<int:user_id>", views.index, name = "index"),
    path('partieComune/<int:user_id>', views.partieC, name = "patieC"),
    path("connexion/", views.connection, name = "login"),
    path("deconnexion/", views.deconnection, name= "logout"),
    path("inscription/", views.signUp, name= "signIn"),

    path("staff_login/", views_staff.connection_staff, name = "staff_login"),
    path("logout/", views_staff.deconnection, name = "staff_logout"),
    path('dashboard/<int:user_id>', views_staff.dashboard, name = "staffDashboard"),

    path("creer_signalement/<int:user_id>",views.create_report, name= "create_report"),
    path("", views.blank)
]+static(settings.MEDIA_URL, document_root= settings.MEDIA_ROOT)
