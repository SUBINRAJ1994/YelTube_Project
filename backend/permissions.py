from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has a `user` attribute.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return getattr(obj, "user", None) == request.user

class IsCommentOwnerOrVideoOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to allow editing comments only by comment owners,
    and deletion of comments by comment owners or the video owner.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.method == "DELETE":
            return obj.user == request.user or obj.video.user == request.user
        return obj.user == request.user
