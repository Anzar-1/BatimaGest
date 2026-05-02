from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager, PermissionsMixin
from django.core.exceptions import ValidationError
import os

def Validate_fichier(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.png', '.jpg']
    if not ext.lower() in valid_extensions:
        raise ValidationError("Le fichier dois être une image png ou jpg.")


class Resident(AbstractUser, PermissionsMixin):
    telephone = models.fields.IntegerField(null = True, blank = True)
    
    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

class Partie_Comune(models.TextChoices):
    Ascenseur = "Ascenseur"
    Parking = "Parking"
    Escalier = "Escalier"
    Piscine = "Piscine"

class Signalement(models.Model):
    resident = models.ForeignKey(Resident, on_delete=models.SET_NULL, null = True, blank = True)
    partieC= models.fields.CharField(max_length=50, choices=Partie_Comune.choices, default = "Ascenseur")
    file_path = models.FileField(upload_to="files/", null = True,verbose_name="", blank = True,validators=[Validate_fichier]) 
    #Je dois verifier la "fin"
    description = models.CharField(max_length=500)
    
    class etat(models.TextChoices):
        Resolu = "Résolu"
        EnCours = "En cours"
        EnAttente = "En Attente"

    state = models.fields.CharField(max_length=50, choices = etat.choices, default = "En Attente")

    class Priority(models.TextChoices):
        Basse = "Basse"
        Moyenne = "Moyenne"
        Haute = "Haute"

    priorite = models.fields.CharField(max_length=50, choices = Priority.choices, default = "Basse")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Notification(models.Model):
    resident = models.ForeignKey(Resident, on_delete = models.CASCADE, null= True, blank= True)
    message = models.fields.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
