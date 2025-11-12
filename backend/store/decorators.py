from rest_framework.response import Response
from rest_framework import status
from functools import wraps

def admin_required(func):
    """
    Decorator to restrict access to admin users only.
    Can be applied to viewset methods like destroy, update, create, etc.
    """
    @wraps(func)
    def wrapper(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        if request.user.role != "admin":
            return Response(
                {"detail": "Only admin allowed."},
                status=status.HTTP_403_FORBIDDEN
            )
        return func(self, request, *args, **kwargs)
    return wrapper
