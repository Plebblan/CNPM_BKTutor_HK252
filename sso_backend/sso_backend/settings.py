from pathlib import Path

# Cấu hình BASE_DIR dựa trên cấu trúc dự án lồng
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start settings - chỉ bao gồm những phần liên quan đến CAS và JWT
SECRET_KEY = 'django-insecure-t#^51@k8p^p4h*h5*p_2d62v%j4n0^y2k@m!e9!m_5n!s(5g5='
DEBUG = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    # Django Core
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Ứng dụng CAS Server (mama_cas)
    'mama_cas',

    # Ứng dụng JWT và API
    'rest_framework',
    'rest_framework_simplejwt',
]

# Đảm bảo session và authentication middleware đúng thứ tự
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',   # Phải có
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware', # Phải có
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'sso_backend.urls'

# Cấu hình Template (Đã được kiểm tra và chỉnh sửa trước đó)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # Đảm bảo DIRS trỏ đến thư mục 'templates' nằm ngang hàng với thư mục cấu hình 'sso_backend'
        'DIRS': [BASE_DIR / 'templates'], 
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# --- CẤU HÌNH MAMA_CAS QUAN TRỌNG ---
# MAMA_CAS_SERVICES: Định nghĩa các dịch vụ Client được phép. 
# CHỈNH SỬA: Chuyển sang định dạng Dictionary để khắc phục lỗi AttributeError: 'str' object has no attribute 'copy'.
MAMA_CAS_SERVICES = [
    {
        'SERVICE': r'^https?://localhost:5173/.*',  # Dùng Regex để chấp nhận mọi đường dẫn bắt đầu bằng localhost:5173
        'NAME': 'Ứng dụng Frontend tại 5173',
        'enabled': True,
        'username_attribute': 'username',
        # Bạn có thể thêm các tùy chọn khác nếu cần
    },
    {
        # Regex cho Client Flask đang chạy trên cổng 8001 (http://127.0.0.1:8001/.*)
        'SERVICE': r'^http://127\.0\.0\.1:8001/.*',
        'NAME': 'Client Flask Localhost (127.0.0.1)',
        # Thêm các thuộc tính tùy chỉnh (như JWT) mà bạn muốn trả về
        'ATTRIBUTES': {
            'jwt_access_token': lambda user: 'placeholder_access_token', # Thay thế bằng logic JWT thật
            'jwt_refresh_token': lambda user: 'placeholder_refresh_token',
        }
    },
    {
        # Regex cho Client Flask đang chạy trên cổng 8001 (http://localhost:8001/.*)
        'SERVICE': r'^http://localhost:8001/.*',
        'NAME': 'Client Flask Localhost (localhost)',
        'ATTRIBUTES': {
            'jwt_access_token': lambda user: 'placeholder_access_token', # Thay thế bằng logic JWT thật
            'jwt_refresh_token': lambda user: 'placeholder_refresh_token',
        }
    },
    
    # Thêm các dịch vụ khác nếu có
]
# Thêm vào cuối settings.py (hoặc trong phần dev chỉ định)

# Cho phép cookie hoạt động khi chạy HTTP trong development
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# (Tùy chọn) nếu bạn dùng csrf token trong form login của mama-cas
CSRF_TRUSTED_ORIGINS = ['http://127.0.0.1:8000', 'http://localhost:8000']

# Định nghĩa URL gốc của CAS Server
CAS_SERVER_URL = 'http://127.0.0.1:8000/sso' 

# Thêm các cấu hình khác của bạn (như JWT)

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Timezone
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'