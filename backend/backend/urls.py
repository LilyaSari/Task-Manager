from django.contrib import admin
from django.urls import path, include 

urlpatterns = [
    path('admin/', admin.site.urls), # Django admin route
    path('api/', include('base.api.urls')), # API base url
]
