from django.contrib.auth.models import UserManager as BaseUserManager

class UserManager(BaseUserManager):
    def get_objects(self,user):
        if not user.is_authenticated or not user.is_active:
            return self.none()
        if user.is_member():
            result = self.none()
        else:    
            result = self.all()
        return result