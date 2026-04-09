# my_cas_urls.py
# (Dựa trên nội dung gốc của mama_cas.urls nhưng đã bỏ qua 'login')

from django.urls import path
from mama_cas import views

# Lưu ý: Chúng ta không import CustomLoginView ở đây, mà sẽ làm ở urls.py chính.
# Mục đích của file này là cung cấp các URL *không phải* là login.

app_name = 'mama_cas'

urlpatterns = [
    # path('login', views.LoginView.as_view(), name='login'), # Đã loại bỏ
    path('logout', views.LogoutView.as_view(), name='logout'),
    path('validate', views.ValidateView.as_view(), name='validate'),
    path('serviceValidate', views.ServiceValidateView.as_view(), name='service_validate'),
    path('proxyValidate', views.ProxyValidateView.as_view(), name='proxy_validate'),
    path('proxy', views.ProxyView.as_view(), name='proxy'),
    path('p3/serviceValidate', views.ServiceValidateView.as_view(), name='p3_service_validate'),
    path('p3/proxyValidate', views.ProxyValidateView.as_view(), name='p3_proxy_validate'),
]