from django.utils.translation import gettext_lazy as _
from model_utils import Choices

class UserConstants:
    """
    A constants class that exposes constants employed by the User model.

    IMPORTANT NOTE! If you add a role, you will have to correspondingly
    update permissions logic in individual perms.py
    """

    ROLE = Choices(
        (1, "admin", _("Admin")),
        (2, "member", _("Member")),
        # adding more roles? See note above
    )



class InviteConstants:
    """
    A constants class that exposes constants employed by the invite model.
    """

    ALLOWED_CHARS = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    MAX_ALLOWED_CHARS = 10

    FAILED_STATUS = _("failed")
    SUCCESS_STATUS = _("success")
    FIRST_NAME_TOO_BIG = _("First name can be maximum of 30 characters")
    LAST_NAME_TOO_BIG = _("Last name can be maximum of 30 characters")
    PASSWORDS_DONT_MATCH = _("Passwords don't match")
    INVALID_PASSWORD = (_("Password must be at least {0} characters"),)
    ROLE_IS_REQUIRED = _("Role is a required field")
    INVITE_ACCEPTED = _("Invitation accepted")
    FAILED_TO_REGISTER = _("No invitation for this email exists")
    USER_EXISTS = _("A user with this email is already registered")
    UPDATE_SELF_INVITE_ERROR = _("Updating your own invitation is not allowed")
    DELETE_SELF_INVITE_ERROR = _("Deleting your own invitation is not allowed")

    TOS_REQUIRED = _("Please agree to Awaaz.De terms of service")