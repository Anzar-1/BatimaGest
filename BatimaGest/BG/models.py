from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager, PermissionsMixin

#class customUserManager(UserManager):
#    def _create_user(self,email,password,**extrafields):
#        if not email:
#            raise ValueError("You have to provide an email adress")
#        email = self.normalize_email(email)
#        user = self.model(email= email, **extrafields)
#        user.set_password(password)
#        user.save(using = self._db)
#        return user
#    
#    def create_user(self, email,password,**extrafields):
#        extrafields.setdefault('is_staff', False)
#        extrafields.setdefault('is_superuser', False)
#        return self._create_user(email, password, **extrafields)
#    
#    def create_superuser(self, email,password,**extrafields):
#        extrafields.setdefault('is_staff', True)
#        extrafields.setdefault('is_superuser', True)
#        return self._create_user(email, password, **extrafields)

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
    resident = models.ForeignKey(Resident, on_delete=models.SET_NULL, null = True)
    partieC= models.fields.CharField(max_length=50, choices=Partie_Comune.choices, default = "Ascenseur")
    file_path = models.FileField(upload_to="files/", null = True,verbose_name="")
