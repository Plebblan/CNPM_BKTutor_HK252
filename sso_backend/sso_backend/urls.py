# urls.py (File chính)

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

# 1. Import Custom Login View của bạn
from .view import CustomLoginView

urlpatterns = [
    path('admin/', admin.site.urls),

    # === CAS SERVER ENDPOINTS ===
    path('sso/login', CustomLoginView.as_view(), name='mama_cas_login'),  # Ghi đè login
    path('sso/', include('sso_backend.my_cas_urls')),                     # Các endpoint còn lại

    # Các API JWT nếu cần (có thể bật lại sau)
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # ...
]