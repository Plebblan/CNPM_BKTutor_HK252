# sso_backend/view.py
from mama_cas.views import LoginView
from django.utils import timezone
from datetime import timedelta
from django.conf import settings


class CustomLoginView(LoginView):
    """
    Ghi đè LoginView để set cookie NGAY SAU KHI SUBMIT LOGIN THÀNH CÔNG (POST).
    Cookie sẽ xuất hiện ngay lần đầu tiên, không cần refresh lần 2.
    """

    def post(self, request, *args, **kwargs):
        # Gọi logic xử lý POST gốc của mama-cas (xác thực user + tạo ticket)
        response = super().post(request, *args, **kwargs)

        # Nếu POST thành công: user authenticated + đang redirect về service với ticket
        if (request.user.is_authenticated
                and hasattr(response, 'url')
                and response.status_code == 302
                and 'ticket=' in response.url):

            user_id = str(request.user.pk)
            max_age = 7 * 24 * 60 * 60  # 7 ngày

            secure = False if settings.DEBUG else True
            samesite = 'Lax'

            response.set_cookie(
                key='user_id',
                value=user_id,
                max_age=max_age,
                secure=secure,
                httponly=True,
                samesite=samesite,
                path='/',
            )

            print(f"[CAS POST SUCCESS] Cookie 'user_id={user_id}' đã set ngay lập tức!")

        return response

    def get(self, request, *args, **kwargs):
        # Giữ nguyên logic GET gốc (hiển thị form login)
        # Nhưng vẫn kiểm tra trường hợp đã login rồi (ví dụ: truy cập trực tiếp mà chưa logout)
        response = super().get(request, *args, **kwargs)

        if (request.user.is_authenticated
                and hasattr(response, 'url')
                and response.status_code == 302
                and 'ticket=' in response.url):

            user_id = str(request.user.pk)
            max_age = 7 * 24 * 60 * 60

            secure = False if settings.DEBUG else True
            samesite = 'Lax'

            response.set_cookie(
                key='user_id',
                value=user_id,
                max_age=max_age,
                secure=secure,
                httponly=True,
                samesite=samesite,
                path='/',
            )

            print(f"[CAS GET SUCCESS] Cookie 'user_id={user_id}' đã set!")

        return response