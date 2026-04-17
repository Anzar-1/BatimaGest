from django.db import models

class Resident(models.Model):
    nom = models.fields.CharField(max_length= 50)
    prenom = models.fields.CharField(max_length= 50)
    telephone = models.fields.IntegerField()

class Partie_Comune(models.Model):
    residence = models.fields.CharField(max_length= 50)

class Signalement(models.Model):
    resident = models.ForeignKey(Resident, on_delete=models.SET_NULL, null = True)
    partieC= models.ForeignKey(Partie_Comune, on_delete= models.CASCADE)
    file_path = models.FileField(upload_to="files/", null = True,verbose_name="")